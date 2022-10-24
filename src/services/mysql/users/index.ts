import mysqlServer from "mysql2";
import sha1 from "sha1";
import { errorHandler } from "../../errorHandler";

import { RemoveUser, SaveUser, UpdateUser, Users } from "./types";

export const users = (connection: mysqlServer.Connection) => {
  return {
    all: async (): Promise<Users> => {
      const query = "SELECT * FROM users";

      const results = await connection.promise().query(query);

      return { users: results[0] } as unknown as Users;
    },

    save: async (email: string, password: string): Promise<SaveUser> => {
      const query = "INSERT INTO users (email,password) VALUES (?,?)";
      const queryData = [email, sha1(password)];

      const [results] = (await connection
        .promise()
        .query(query, queryData)) as unknown as mysqlServer.ResultSetHeader[];

      if (results.affectedRows === 0) {
        errorHandler(`Falha ao salvar a usuário ${email}`);
      }

      return {
        user: {
          id: results.insertId,
          email,
        },
      };
    },

    update: async (id: number, password: string): Promise<UpdateUser> => {
      const query = "UPDATE users SET password = ? WHERE id = ?";
      const queryData = [sha1(password), id];

      const [results] = (await connection
        .promise()
        .query(query, queryData)) as unknown as mysqlServer.ResultSetHeader[];

      if (results.affectedRows === 0) {
        errorHandler(`Não foi possível atualizar a categoria de id ${id}`);
      }

      return {
        user: {
          id,
        },
        affectedRows: results.affectedRows,
      };
    },

    remove: async (id: number): Promise<RemoveUser> => {
      const query = "DELETE FROM users WHERE id = ?";
      const queryData = [id];

      const [results] = (await connection
        .promise()
        .query(query, queryData)) as unknown as mysqlServer.ResultSetHeader[];

      if (results.affectedRows === 0) {
        errorHandler(`Falha ao deletar a usuário de id ${id}`);
      }

      return {
        message: "Categoria removida com sucesso",
        affectedRows: results.affectedRows,
      };
    },
  };
};
