import mysqlServer from "mysql2";
import { categories } from "./mysql/categories";

const connection = mysqlServer.createConnection({
  host: process.env.MYSQL_HOST as string,
  port: process.env.MYSQL_PORT as unknown as number,
  user: process.env.MYSQL_USER as string,
  password: process.env.MYSQL_PASSWORD as string,
  database: process.env.MYSQL_DATABASE as string,
});

const categoryModule = categories(connection);

export const db = {
  categories: () => categoryModule,
};
