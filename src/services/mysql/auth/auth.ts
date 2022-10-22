import mysqlServer from "mysql2";
import sha1 from "sha1";

import jwt from "jsonwebtoken";
import { errorHandler } from "../../errorHandler";

interface IToken {
  token: string;
}

export const auth = (connection: mysqlServer.Connection) => {
  return {
    authenticate: async (email: string, password: string) => {
      const queryString =
        "SELECT id, email FROM users WHERE email = ? AND password = ?";
      const queryData = [email, sha1(password)];

      return new Promise<IToken>((resolve, reject) => {
        connection.query(
          queryString,
          queryData,
          (error, results: mysqlServer.RowDataPacket[]) => {
            if (error) {
              return errorHandler(
                error,
                "Falha ao localizar o usuário",
                reject
              );
            }

            const { email, id } = results[0];

            const token = jwt.sign(
              {
                email,
                id,
              },
              process.env.JWT_SECRET as string,
              {
                expiresIn: 60 * 60 * 24, // one day
              }
            );

            resolve({
              token,
            });
          }
        );
      });
    },
  };
};
