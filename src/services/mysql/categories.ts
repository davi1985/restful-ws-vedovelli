import mysqlServer from "mysql2";
import { errorHandler } from "../errorHandler";

type Category = {
  id: number;
  name: string;
};

interface Categories {
  categories: Category[];
}

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
      return new Promise<{ category: Category }>((resolve, reject) => {
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
      return new Promise<{ category: Omit<Category, "id"> }>(
        (resolve, reject) => {
          connection.execute(
            "UPDATE categories SET name = ? WHERE id = ?",
            [name, id],
            (error, results) => {
              if (error) {
                return errorHandler(
                  error,
                  `Falha ao atualizar a categoria ${name}`,
                  reject
                );
              }

              resolve({
                category: {
                  name,
                },
              });
            }
          );
        }
      );
    },

    remove: async (id: number) => {
      return new Promise((resolve, reject) => {
        connection.execute(
          "DELETE FROM categories WHERE id = ?",
          [id],
          (error, results) => {
            if (error) {
              return errorHandler(
                error,
                `Falha ao deletar a categoria de id ${id}`,
                reject
              );
            }

            resolve({
              message: "Categoria removida com sucesso",
            });
          }
        );
      });
    },
  };
};
