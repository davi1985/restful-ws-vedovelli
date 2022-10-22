import mysqlServer from "mysql2";
import sha1 from "sha1";
import { errorHandler } from "../../errorHandler";

import { RemoveUser, SaveUser, UpdateUser, Users } from "./types";

export const users = (connection: mysqlServer.Connection) => {
  return {
    all: async () => {
      return new Promise<Users>((resolve, reject) => {
        connection.query("SELECT id, email FROM users", (error, results) => {
          if (error) {
            return errorHandler(error, "Falha ao listar as usuários", reject);
          }

          resolve({
            users: results,
          } as unknown as Users);
        });
      });
    },

    save: async (email: string, password: string) => {
      return new Promise<SaveUser>((resolve, reject) => {
        connection.execute(
          "INSERT INTO users (email,password) VALUES (?,?)",
          [email, sha1(password)],
          (error, results: mysqlServer.ResultSetHeader) => {
            if (error) {
              return errorHandler(
                error,
                `Falha ao salvar a usuário ${email}`,
                reject
              );
            }

            resolve({
              user: {
                id: results.insertId,
                email,
              },
            });
          }
        );
      });
    },

    update: async (id: number, password: string) => {
      return new Promise<UpdateUser>((resolve, reject) => {
        connection.execute(
          "UPDATE users SET password = ? WHERE id = ?",
          [sha1(password), id],
          (error, results: mysqlServer.ResultSetHeader) => {
            if (error || !results.affectedRows) {
              return errorHandler(
                error,
                `Falha ao atualizar a usuário de id ${id}`,
                reject
              );
            }

            resolve({
              user: {
                id,
              },
              affectedRows: results.affectedRows,
            });
          }
        );
      });
    },

    remove: async (id: number) => {
      return new Promise<RemoveUser>((resolve, reject) => {
        connection.execute(
          "DELETE FROM users WHERE id = ?",
          [id],
          (error, results: mysqlServer.ResultSetHeader) => {
            if (error || !results.affectedRows) {
              return errorHandler(
                error,
                `Falha ao deletar a usuário de id ${id}`,
                reject
              );
            }

            resolve({
              message: "Usuário removido com sucesso",
              affectedRows: results.affectedRows,
            });
          }
        );
      });
    },
  };
};