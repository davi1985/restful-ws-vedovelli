import mysqlServer from "mysql2";
import { auth } from "./mysql/auth/auth";
import { categories } from "./mysql/categories";
import { users } from "./mysql/users";

const connection = mysqlServer.createConnection({
  host: process.env.MYSQL_HOST as string,
  port: process.env.MYSQL_PORT as unknown as number,
  user: process.env.MYSQL_USER as string,
  password: process.env.MYSQL_PASSWORD as string,
  database: process.env.MYSQL_DATABASE as string,
});

const categoryModule = categories(connection);
const usersModule = users(connection);
const authModule = auth(connection);

export const db = {
  categories: () => categoryModule,
  users: () => usersModule,
  auth: () => authModule,
};
