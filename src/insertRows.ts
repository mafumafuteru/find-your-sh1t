import { faker } from "@faker-js/faker";
import {
  generatePlace,
  generateRoomUniqueRooms,
  generateUniqueContainers,
  generateUniqueItems,
  generateUser,
} from "./createDummyData";
import pool from "./db";

const insertItemCategories = async () => {
  const categories = [
    "Food",
    "Drink",
    "Tools",
    "Clothes",
    "Shoes",
    "Jewelry",
    "Toiletries",
    "Cleaning Supplies",
    "Fitness Equipment",
    "Electronics",
    "Office Supplies",
    "Toys",
    "Entertainment Products",
    "Kitchenware",
    "Bags & Luggage",
    "Bedding & Linens",
    "Books & Printed Media",
    "Medications & First Aid",
    "Pet Supplies",
    "Gardening Tools",
    "Craft & Art Supplies",
    "Storage Containers",
    "Decor & Ornaments",
    "Lighting Equipment",
    "Stationery",
  ];

  for (let category of categories) {
    await pool.query(
      `INSERT INTO "item_category" (item_category_name) VALUES ($1);`,
      [category]
    );
  }
};

const insertSingleUser = async () => {
  try {
    const user = generateUser();
    const secondUser = generateUser();
    let addSecondUser = false;
    if (faker.number.int({ min: 0, max: 1 }) == 1) {
      addSecondUser = true;
    }
    const createdUser = await pool.query(
      `INSERT INTO "user" (user_name, last_name, email_address, password) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [user.userName, user.lastName, user.emailAddress, user.password]
    );
    const userId = createdUser.rows[0].user_id;

    let userIdSecond: number;
    if (addSecondUser) {
      const secondCreatedUser = await pool.query(
        `INSERT INTO "user" (user_name, last_name, email_address, password) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [user.userName, user.lastName, user.emailAddress, user.password]
      );
      userIdSecond = secondCreatedUser.rows[0].user_id;
    }

    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
      const place = generatePlace();

      const createdPlace = await pool.query(
        `INSERT INTO "place" (place_name) VALUES ($1) RETURNING *;`,
        [place]
      );

      const createdPlaceId = createdPlace.rows[0].place_id;

      await pool.query(
        `INSERT INTO "user_to_place" (user_id, place_id) VALUES ($1, $2) RETURNING *;`,
        [userId, createdPlaceId]
      );

      if (addSecondUser) {
        await pool.query(
          `INSERT INTO "user_to_place" (user_id, place_id) VALUES ($1, $2) RETURNING *;`,
          [userIdSecond!, createdPlaceId]
        );
      }

      const roomAmount = faker.number.int({ min: 2, max: 10 });
      const roomNames = generateRoomUniqueRooms(roomAmount);
      for (let roomName of roomNames) {
        const createdRoom = await pool.query(
          `INSERT INTO "room" (room_name, place_id) VALUES ($1, $2) RETURNING *;`,
          [roomName, createdPlaceId]
        );

        const createdRoomId = createdRoom.rows[0].room_id;

        const containerAmount = faker.number.int({ min: 1, max: 5 });

        const containerNames = generateUniqueContainers(containerAmount);
        for (let containerName of containerNames) {
          const createdContainer = await pool.query(
            `INSERT INTO "container" (container_name, room_id) VALUES ($1, $2) RETURNING *;`,
            [containerName, createdRoomId]
          );

          const containerId = createdContainer.rows[0].container_id;

          const itemAmount = faker.number.int({ min: 2, max: 15 });
          const items = generateUniqueItems(itemAmount);

          for (let item of items) {
            const createdItem = await pool.query(
              `INSERT INTO "item" (item_name, purchase_date, expiration_date, color, price, container_id, room_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
              [
                item.itemName,
                faker.number.int({ min: 1, max: 2 }) == 1
                  ? item.purchaseDate
                  : null,
                faker.number.int({ min: 1, max: 10 }) == 1
                  ? faker.number.int({ min: 1, max: 10 }) == 1
                    ? faker.date.recent({ days: 100 })
                    : faker.date.soon({ days: 500 })
                  : null,
                faker.number.int({ min: 1, max: 2 }) == 1 ? item.color : null,
                faker.number.int({ min: 1, max: 2 }) == 1 ? item.price : null,
                faker.number.int({ min: 1, max: 10 }) != 1 ? containerId : null,
                createdRoomId,
              ]
            );
            const itemId = createdItem.rows[0].item_id;

            const randomizer = faker.number.int({ min: 1, max: 3 });
            if (addSecondUser) {
              if (randomizer == 1) {
                await pool.query(
                  `INSERT INTO "item_to_user" (item_id, user_id) VALUES ($1, $2);`,
                  [itemId, userId]
                );
                await pool.query(
                  `INSERT INTO "item_to_user" (item_id, user_id) VALUES ($1, $2);`,
                  [itemId, userIdSecond!]
                );
              } else if (randomizer == 2) {
                await pool.query(
                  `INSERT INTO "item_to_user" (item_id, user_id) VALUES ($1, $2);`,
                  [itemId, userId]
                );
              } else {
                await pool.query(
                  `INSERT INTO "item_to_user" (item_id, user_id) VALUES ($1, $2);`,
                  [itemId, userIdSecond!]
                );
              }
            } else {
              await pool.query(
                `INSERT INTO "item_to_user" (item_id, user_id) VALUES ($1, $2);`,
                [itemId, userId]
              );
            }

            const categories = await pool.query(
              'SELECT * FROM "item_category";'
            );
            const categoryIds = categories.rows.map((x) => x.item_category_id);
            const categoryAmount = faker.number.int({ min: 1, max: 3 });
            const selectedCategoriesIds = faker.helpers.arrayElements(
              categoryIds,
              categoryAmount
            );
            for (let categoryId of selectedCategoriesIds) {
              await pool.query(
                `INSERT INTO "item_to_item_category" (item_id, item_category_id) VALUES ($1, $2);`,
                [itemId, categoryId]
              );
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

insertItemCategories();

const generateMultipleUsers = (amount) => {
  for (let i = 0; i < amount; i++) {
    insertSingleUser();
  }
};

generateMultipleUsers(5);
