import { Client } from "pg";

export const client: Client = new Client({
  user: "Carlos",
  password: "985231",
  host: "localhost",
  database: "m4_movies",
  port: 5432,
});

export const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected");
};
