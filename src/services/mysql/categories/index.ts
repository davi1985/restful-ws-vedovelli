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
    all: async () => {
      return new Promise<Categories>((resolve, reject) => {
        const query = "SELECT * FROM categories";

        connection.query(query, (error, results) => {
          if (error) {
            return errorHandler(error, "Falha ao listar as categorias", reject);
          }

          resolve({
            categories: results,
          } as unknown as Categories);
        });
      });
    },

    save: async (name: string) => {
      return new Promise<SaveCategory>((resolve, reject) => {
        const query = "INSERT INTO categories (name) VALUES (?)";
        const queryData = [name];

        connection.execute(
          query,
          queryData,
          (error, results: mysqlServer.ResultSetHeader) => {
            if (error) {
              return errorHandler(
                error,
                `Falha ao salvar a categoria ${name}`,
                reject
              );
            }

            resolve({
              category: {
                id: results.insertId,
                name,
              },
            });
          }
        );
      });
    },

    update: async (id: number, name: string) => {
      return new Promise<UpdateCategory>((resolve, reject) => {
        const query = "UPDATE categories SET name = ? WHERE id = ?";
        const queryData = [name, id];

        connection.execute(
          query,
          queryData,
          (error, results: mysqlServer.ResultSetHeader) => {
            if (error || !results.affectedRows) {
              return errorHandler(
                error,
                `Falha ao atualizar a categoria ${name}`,
                reject
              );
            }

            resolve({
              category: {
                id,
                name,
              },
              affectedRows: results.affectedRows,
            });
          }
        );
      });
    },

    remove: async (id: number) => {
      return new Promise<RemoveCategory>((resolve, reject) => {
        const query = "DELETE FROM categories WHERE id = ?";
        const queryData = [id];

        connection.execute(
          query,
          queryData,
          (error, results: mysqlServer.ResultSetHeader) => {
            if (error || !results.affectedRows) {
              return errorHandler(
                error,
                `Falha ao deletar a categoria de id ${id}`,
                reject
              );
            }

            resolve({
              message: "Categoria removida com sucesso",
              affectedRows: results.affectedRows,
            });
          }
        );
      });
    },
  };
};
