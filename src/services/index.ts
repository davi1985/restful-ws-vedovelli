import mysqlServer from "mysql2";
import { categories } from "./mysql/categories";

const connection = mysqlServer.createConnection({
  host: "localhost",
  port: 3306,
  user: "davisilva",
  password: "root",
  database: "restnode",
});

const categoryModule = categories(connection);

export const db = {
  categories: () => categoryModule,
};
