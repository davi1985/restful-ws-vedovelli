import mysqlServer from "mysql2";
import { errorHandler } from "../../errorHandler";
import {
  Categories,
  RemoveCategory,
  SaveCategory,
  UpdateCategory,
} from "./types";

export const categories = (connection: mysqlServer.Connection) => {
  return {
    all: async (): Promise<Categories> => {
      const query = "SELECT * FROM categories";

      const results = await connection.promise().query(query);

      return { categories: results[0] } as unknown as Categories;
    },

    save: async (name: string): Promise<SaveCategory> => {
      const query = "INSERT INTO categories (name) VALUES (?)";
      const queryData = [name];

      const [results] = (await connection
        .promise()
        .query(query, queryData)) as unknown as mysqlServer.ResultSetHeader[];

      if (results.affectedRows === 0) {
        errorHandler(`Não foi possível salvar a categoria ${name}`);
      }

      return {
        category: {
          id: results.insertId,
          name,
        },
      };
    },

    update: async (id: number, name: string): Promise<UpdateCategory> => {
      const query = "UPDATE categories SET name = ? WHERE id = ?";
      const queryData = [name, id];

      const [results] = (await connection
        .promise()
        .query(query, queryData)) as unknown as mysqlServer.ResultSetHeader[];

      if (results.affectedRows === 0) {
        errorHandler(`Não foi possível atualizar a categoria de id ${id}`);
      }

      return {
        category: {
          id,
          name,
        },
        affectedRows: results.affectedRows,
      };
    },

    remove: async (id: number): Promise<RemoveCategory> => {
      const query = "DELETE FROM categories WHERE id = ?";
      const queryData = [id];

      const [results] = (await connection
        .promise()
        .query(query, queryData)) as unknown as mysqlServer.ResultSetHeader[];

      if (results.affectedRows === 0) {
        errorHandler(`Não foi possível remover a categoria de id ${id}`);
      }

      return {
        message: "Categoria removida com sucesso",
        affectedRows: results.affectedRows,
      };
    },
  };
};
