import mysqlServer from "mysql2";
import sha1 from "sha1";

import jwt from "jsonwebtoken";
import { errorHandler } from "../../errorHandler";
import { Token, User } from "./types";

export const auth = (connection: mysqlServer.Connection) => {
  return {
    authenticate: async (email: string, password: string): Promise<Token> => {
      const queryString =
        "SELECT id, email FROM users WHERE email = ? AND password = ?";
      const queryData = [email, sha1(password)];

      const [results] = await connection
        .promise()
        .query(queryString, queryData);

      const user = results as unknown as User;

      if (!user) {
        errorHandler("Falha ao localizar o usuário");
      }

      const token = jwt.sign(
        {
          email,
          id: user.id,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: 60 * 60 * 24, // one day
        }
      );

      return {
        token,
      };
    },
  };
};
