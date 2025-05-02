import express from "express";
import pool from "./db.js";

const server = express();
server.use(express.json());

//add a user
server.post("/createUser", async (request, response) => {
  const userName = request.body.user_name;
  const lastName = request.body.last_name;
  const emailAddress = request.body.email_address;
  const password = request.body.password;
  const createUser = await pool.query(
    `
        INSERT INTO 
        "user"(user_name,last_name,email_address,password)
        VALUES
        ($1, $2, $3, $4) RETURNING *;
        `,
    [userName, lastName, emailAddress, password]
  );
  const userId = createUser.rows[0].user_id;
  response.status(200).send(userId);
});

//get all rooms in a place
server.get("/places/:placeId/rooms", async (request, response) => {
  const placeId = request.params.placeId;
  const placeLayout = await pool.query(
    `
    SELECT * FROM room
    WHERE place_id = $1
  `,
    [placeId]
  );
  response.status(200).send(placeLayout.rows);
});

//get all containers in a room
server.get("/containers/:roomId", async (request, response) => {
  const roomId = request.params.roomId;
  const roomLayout = await pool.query(
    `SELECT container_id, container_name FROM container WHERE room_id = $1`,
    [roomId]
  );
  const containers = roomLayout.rows;
  if (containers.length === 0) {
    response
      .status(200)
      .send({ message: "This room doesn't have any container." });
  } else {
    response.status(200).send(containers);
  }
});

//get all items in a container
server.get("/container/:containerId/items", async (request, response) => {
  const containerId = request.params.containerId;
  const containerInhalt = await pool.query(
    `SELECT 
    item_id, item_name 
    FROM item 
    WHERE container_id = $1`,
    [containerId]
  );

  const items = containerInhalt.rows;
  if (items.length === 0) {
    response.status(200).send({ message: "This container is empty." });
  } else {
    response.status(200).send(items);
  }
});

//Add an item
server.post("/items/create", async (request, response) => {
  const itemName = request.body.item_name;
  const purchaseDate = request.body.purchase_date;
  const expirationDate = request.body.expiration_date;
  const color = request.body.color;
  const price = request.body.price;
  const containerId = request.body.container_id;
  const roomId = request.body.room_id;

  const createItem = await pool.query(
    `
      INSERT INTO 
      item(item_name, purchase_date, expiration_date, color, price, container_id, room_id)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
      `,
    [itemName, purchaseDate, expirationDate, color, price, containerId, roomId]
  );
  const itemId = createItem.rows[0].item_id;
  for (let categoryId of request.body.item_category_id) {
    await pool.query(
      `INSERT INTO item_to_item_category(item_id, item_category_id)
          VALUES ($1, $2);
          `,
      [itemId, categoryId]
    );
  }

  response.status(200).send("Everything worked!");
});

//Add a new room
server.post("/rooms/create", async (request, response) => {
  const roomName = request.body.room_name;
  const placeId = request.body.place_id;
  const createRoom = await pool.query(
    `
      INSERT INTO 
      room(room_name,place_id)
      VALUES
      ($1, $2) RETURNING *;
      `,
    [roomName, placeId]
  );

  response.status(200).send("Everything worked!");
});

//Add a new container
server.post("/containers/create", async (request, response) => {
  const containerName = request.body.container_name;
  const roomId = request.body.room_id;
  const createContainer = await pool.query(
    `
      INSERT INTO 
      container(container_name,room_id)
      VALUES
      ($1, $2) RETURNING *;
      `,
    [containerName, roomId]
  );
  response.status(200).send("Everything worked!");
});

//Change User Details
server.patch("/user/changeUserDetail", async (request, response) => {
  const userId = request.body.user_id;
  const email = request.body.email_address;
  const password = request.body.password;
  const userName = request.body.user_name;
  const lastName = request.body.last_name;
  if (lastName != null) {
    await pool.query(
      `
      UPDATE "user"
      SET last_name = $1
      WHERE user_id = $2;
      `,
      [lastName, userId]
    );
  }

  if (email != null) {
    await pool.query(
      `
      UPDATE "user"
      SET email_address = $1
      WHERE user_id = $2;
      `,
      [email, userId]
    );
  }

  if (password != null) {
    await pool.query(
      `
      UPDATE "user"
      SET password = $1
      WHERE user_id = $2;
      `,
      [password, userId]
    );
  }

  if (userName != null) {
    await pool.query(
      `
      UPDATE "user"
      SET user_name = $1
      WHERE user_id = $2;
      `,
      [userName, userId]
    );
  }
  response.status(200).send("Everything worked!");
});

// Change item location
server.patch("/items/changeLocation", async (request, response) => {
  const itemId = request.body.item_id;
  const containerId = request.body.container_id;
  const roomId = request.body.room_id;
  const changeLocation = await pool.query(
    `
      UPDATE item
      SET container_id = $1, room_id= $2
      WHERE item_id = $3;
      `,
    [containerId, roomId, itemId]
  );
  response.status(200).send("Everything worked!");
});

//Delete an item
server.delete("/items/delete", async (request, response) => {
  const itemId = request.body.item_id;
  const deleteItem = await pool.query(
    `
        DELETE FROM item
        WHERE item_id = $1;
        `,
    [itemId]
  );
  response.status(200).send("Everything worked!");
});

//Get all items the user has
server.get("/user/:userId/items", async (request, response) => {
  const userId = request.params.userId;
  const getItems = await pool.query(
    `
    SELECT
    item.item_id,
    item.item_name,
    container.container_id,
    container.container_name,
    room.room_id,
    room.room_name,
    place.place_id,
    place.place_name
FROM item_to_user
JOIN "user" ON item_to_user.user_id = "user".user_id
JOIN item ON item_to_user.item_id = item.item_id
JOIN container ON item.container_id = container.container_id
JOIN room ON container.room_id = room.room_id
JOIN place ON room.place_id = place.place_id
WHERE "user".user_id = $1; `,
    [userId]
  );
  response.status(200).send(getItems.rows);
});

//Get item details by item ID
server.get("/items/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const itemDetail = await pool.query(
    `
      SELECT * FROM item
      WHERE item_id = $1
    `,
    [itemId]
  );
  res.status(200).send(itemDetail.rows[0]);
});

//Get a user their items that are not in a container yet
server.get("/items/:userId/uncontained", async (request, response) => {
  const userId = request.params.userId;
  const itemNoContainer = await pool.query(
    `
    SELECT *
    FROM item
    JOIN item_to_user ON item.item_id = item_to_user.item_id
    WHERE item_to_user.user_id = $1 AND item.container_id IS NULL
  `,
    [userId]
  );
  const items = itemNoContainer.rows;
  if (items.length === 0) {
    response
      .status(200)
      .send({ message: "Everything is organized in a container!" });
  } else {
    response.status(200).send(items);
  }
});

//Get all items from a user that gonna expire soon or expired
server.get("/items/:userId/expire", async (request, response) => {
  const userId = request.params.userId;
  const getExpireItems = await pool.query(
    `
    SELECT
      item.item_id,
      item.item_name,
      item.expiration_date,
      item.container_id,
      item.room_id,
      container.container_name,
      room.room_name,
    CASE 
        WHEN item.expiration_date < CURRENT_DATE THEN 'expired'
        WHEN item.expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' THEN 'expiring_soon'
        ELSE 'valid'
      END AS status
    FROM item
    JOIN container ON container.container_id = item.container_id
    JOIN room ON room.room_id = item.room_id
    JOIN item_to_user ON item.item_id = item_to_user.item_id
    WHERE item.expiration_date IS NOT NULL
      AND item_to_user.user_id = $1
      AND
      (item.expiration_date < CURRENT_DATE
        OR item.expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      )
  `,
    [userId]
  );

  if (getExpireItems.rows.length === 0) {
    response.status(200).json({ message: "Everything is fresh!" });
  } else {
    response.status(200).send(getExpireItems.rows);
  }
});

//get how much many a user spend in each category
server.get("/user/:userId/spending", async (request, response) => {
  const userId = request.params.userId;

  const getUserSpending = await pool.query(
    `
    SELECT
      "user".user_id,
      "user".user_name,
      item_category.item_category_name,
      COUNT(item.item_id) AS item_count,
      SUM(item.price) AS total_price
    FROM item_to_user
    JOIN "user" ON item_to_user.user_id = "user".user_id
    JOIN item ON item_to_user.item_id = item.item_id
    JOIN item_to_item_category ON item_to_item_category.item_id = item.item_id
    JOIN item_category ON item_category.item_category_id = item_to_item_category.item_category_id
    WHERE "user".user_id = $1
    GROUP BY "user".user_id, "user".user_name, item_category.item_category_name
    ORDER BY "user".user_id ASC
  `,
    [userId]
  );

  response.status(200).send(getUserSpending.rows);
});

server.listen(3000, () => {
  console.log("Server started");
});
