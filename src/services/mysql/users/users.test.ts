import test from "ava";

import { connection } from "../tests/setup";
import { users } from "../users";

const usersModule = users(connection);

const create = () => users(connection).save("user@test.com", "12345");
const truncateTable = () => connection.execute("TRUNCATE TABLE users");

test.beforeEach((t) => truncateTable());
test.after.always((t) => truncateTable());

test("All users", async (t) => {
  await create();

  const list = await usersModule.all();

  t.is(list.users.length, 4);
  t.is(list.users[0].email, "user@test.com");
});

test("Create user", async (t) => {
  const result = await create();

  t.is(result.user.email, "user@test.com");
});

test("Update user", async (t) => {
  await create();

  const updated = await usersModule.update(1, "new-pass");

  t.is(updated.user.id, 1);
  t.is(updated.affectedRows, 1);
});

test("Remove user", async (t) => {
  await create();

  const updated = await usersModule.remove(1);

  t.is(updated.affectedRows, 1);
});
