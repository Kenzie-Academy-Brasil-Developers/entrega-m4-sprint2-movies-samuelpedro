import { Client } from "pg";

export const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
});

const createTable = async () => {
  try {
    const queryString: string = `
    CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      category VARCHAR(20) NOT NULL,
      duration INT NOT NULL,
      price INT NOT NULL
  );
`;

    await client.query(queryString);
    console.log("Movie created sucessfully");
  } catch (error) {
    console.log(error);
  }
};

export const connectDataBase = async () => {
  try {
    await client.connect();
    console.log("Database connected sucessfully");
    await createTable();
  } catch (error) {
    console.log(error);
  }
};
