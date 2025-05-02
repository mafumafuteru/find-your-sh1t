# README Find-Your-Sh1t

### Prerequisites

- [Postgresql](https://www.postgresql.org/download/)
- [Node](https://nodejs.org/en/download)

### Setup Instructions

1. Install Packages:

`npm i`

2. **Connect to Postgres:**

`psql -U [your root user] `

Then enter your root password.

3. **Create New User for Backend:**

`CREATE USER fys_backend WITH PASSWORD 'suchgoodpassword123';`

4. **Create Database:**

`CREATE DATABASE fys_database;`

5. **Give User Permissions over Database**

`GRANT ALL PRIVILEGES ON DATABASE fys_database TO fys_backend;`

Connect to Database:

`\c fys_database`

Grant Privileges on Schema public to backend user:

`GRANT ALL PRIVILEGES ON DATABASE fys_database TO fys_backend;`

Then exit postgres:

`exit`

6. **Create .env File in project directory:**

**_.env:_**

```bash
DB_USERNAME=fys_backend
DB_PASSWORD=suchgoodpassword123
PORT=[postgres databases port]
```

7. **To Create Tables, Indexes and fill them with data run this command inside the project directory:**

`npm run create-all`

8. **To Start the backend run:**

`npm run dev`

### Project Description

Recently I found that I kept misplacing stuff. I was really tired not knowing where I put something at home. So I came up with the idea of creating an App to help my find my sh1t. The end goal of my project is to have a mobile app where I can add an item and select which container to put it in. Then when i search for the item in the app, I will see exactly in which container, and in which room it is.

### Relationships

A user can create a user account, they can then create a home or add an existing home (for example if they live with someone that already has created a home in the app). They can then create rooms, and in the rooms create containers. Containers can be anything like a Cupboard, Drawer, Table...
Then they can create items and assign these items to a specific container, or just to a room. While creating the item they can also choose which categories apply to it.

The following ER-Diagram shows the database setup:

![find_your_sh!t (1).png](https://res.craft.do/user/full/b0e62220-21e7-3e79-e368-d4886dca007e/doc/47462851-035B-44D6-A14F-245B85833C70/198D2545-9B19-4E6E-826D-40CD1C50D6A9_2/6HSSnZikAzwoBY43rohHLPNpN2sktZRJYG4zb3tJ7GMz/find_your_sht%201.png)

### Indexes

To increase performance I created a couple of indexes:

| Name                      | Description                                        |
| ------------------------- | -------------------------------------------------- |
| idx_user_to_place_user_id | Find All Places for a specific user faster         |
| idx_room_place_id         | Find All Rooms for Place faster                    |
| idx_container_room_id     | Find All Containers in a Room faster               |
| idx_item_to_user_user_id  | Find All Items belonging to a specific User faster |

### Use Cases Implemented

| **Use Case**                                                | **Route**                     | **Method** |
| ----------------------------------------------------------- | ----------------------------- | ---------- |
| Add a user                                                  | /createUser                   | POST       |
| Get all containers in a room                                | /containers/:roomId           | GET        |
| Get all items in a container                                | /container/:containerId/items | GET        |
| Add an item                                                 | /items/create                 | POST       |
| Add a new room                                              | /rooms/create                 | POST       |
| Add a new container                                         | /containers/create            | POST       |
| Change User Details                                         | /user/changeUserDetail        | PATCH      |
| Change item Container                                       | /items/changeLocation         | PATCH      |
| Delete an item                                              | /items/delete                 | DELETE     |
| Get all items from a user                                   | /user/:userId/items           | GET        |
| Get all items from a user that gonna expire soon or expired | /items/:userId/expire         | GET        |
| Get how much money a user spend in each category            | /user/:userId/spending        | GET        |

### Origin of Example Data

The example data is generated in the following files:

- createDummyData.ts
- insertRows.ts

To generate the data I used an AI to help me make arrays for the different item names and room names, as well as to support in writing the code for the data generation.

Additional info for the rows I generated with the faker.js package.
