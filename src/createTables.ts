import pool from "./db";

const createTables = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS container, item, item_category, item_to_item_category, "user", room, place, item_to_user, user_to_place;

    CREATE TABLE "user" (
        user_id SERIAL,
        user_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email_address VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        PRIMARY KEY(user_id)
    );

    CREATE TABLE place (
        place_id SERIAL,
        place_name VARCHAR NOT NULL,
        PRIMARY KEY(place_id)
    );

    CREATE TABLE user_to_place(
        user_to_place_id SERIAL,
        user_id INT NOT NULL,
        place_id INT NOT NULL,
        PRIMARY KEY (user_to_place_id),
        FOREIGN KEY(place_id) REFERENCES place(place_id),
        FOREIGN KEY(user_id) REFERENCES "user"(user_id)
    );

    CREATE TABLE room (
        room_id SERIAL,
        room_name VARCHAR NOT NULL,
        place_id  INT NOT NULL,
        PRIMARY KEY(room_id),
        FOREIGN KEY(place_id) REFERENCES place(place_id)
    );

    CREATE TABLE container (
        container_id SERIAL,
        container_name VARCHAR NOT NULL,
        room_id  INT NOT NULL,
        PRIMARY KEY(container_id),
        FOREIGN KEY(room_id) REFERENCES room(room_id)
    );

    CREATE TABLE item (
        item_id SERIAL,
        item_name VARCHAR NOT NULL,
        purchase_date TIMESTAMP,
        expiration_date TIMESTAMP,
        color VARCHAR,
        price FLOAT,
        container_id INT,
        room_id INT NOT NULL,
        PRIMARY KEY(item_id),
        FOREIGN KEY(container_id) REFERENCES container(container_id),
        FOREIGN KEY(room_id) REFERENCES room(room_id)
    );

    CREATE TABLE item_category(
        item_category_id SERIAL,
        item_category_name VARCHAR NOT NULL,
        PRIMARY KEY(item_category_id)
    );

    CREATE TABLE item_to_user(
        item_to_user_id SERIAL ,
        item_id INT NOT NULL,
        user_id INT NOT NULL,
        PRIMARY KEY(item_to_user_id),
        FOREIGN KEY(item_id) REFERENCES item(item_id),
        FOREIGN KEY (user_id) REFERENCES "user"(user_id)
    );

    CREATE TABLE item_to_item_category(
        item_to_item_category_id SERIAL,
        item_id INT NOT NULL,
        item_category_id INT NOT NULL,
        PRIMARY KEY(item_to_item_category_id),
        FOREIGN KEY(item_id) REFERENCES item(item_id),
        FOREIGN KEY (item_category_id) REFERENCES item_category(item_category_id)
    );
  `);
};

createTables();
