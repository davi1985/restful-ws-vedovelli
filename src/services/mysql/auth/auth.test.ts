import test from "ava";

import { connection } from "../tests/setup";
import { users } from "../users";
import { auth } from "./auth";

const authModule = auth(connection);

const create = () => users(connection).save("user@test.com", "123456");
const truncateTable = () => connection.execute("TRUNCATE TABLE users");

test.beforeEach((t) => truncateTable());
test.after.always((t) => truncateTable());

test("Login de usuário - sucesso", async (t) => {
  await create();

  const result = await authModule.authenticate("user@test.com", "123456");

  t.not(result.token, null);
  t.not(result.token.length, 0);
});
