import mysqlServer from "mysql2";

export const errorHandler = (
  error: mysqlServer.QueryError,
  msg: string,
  rejectFunction: (reason?: any) => void
) => {
  console.log(error);

  rejectFunction({ error: msg });
};
