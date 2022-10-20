import mysqlServer from "mysql2";
import { errorHandler } from "../errorHandler";
import {
  Categories,
  SaveCategory,
  UpdateCategory,
  RemoveCategory,
} from "./types";

export const categories = (connection: mysqlServer.Connection) => {
  return {
    all: async () => {
      return new Promise<Categories>((resolve, reject) => {
        connection.query("SELECT * FROM categories", (error, results) => {
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
        connection.execute(
          "INSERT INTO categories (name) VALUES (?)",
          [name],
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
        connection.execute(
          "UPDATE categories SET name = ? WHERE id = ?",
          [name, id],
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
        connection.execute(
          "DELETE FROM categories WHERE id = ?",
          [id],
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
