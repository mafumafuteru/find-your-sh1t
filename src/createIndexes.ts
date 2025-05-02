import pool from "./db";

const createIndexes = async () => {
  await pool.query(
    `
    CREATE INDEX idx_user_to_place_user_id ON user_to_place(user_id);
    CREATE INDEX idx_room_place_id ON room(place_id);
    CREATE INDEX idx_container_room_id ON container(room_id);
    CREATE INDEX idx_item_to_user_user_id ON item_to_user(user_id);
    `
  );
};

createIndexes();
