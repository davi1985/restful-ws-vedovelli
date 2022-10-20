import test from "ava";

import { connection } from "./setup";
import { categories } from "../categories";

const categoriesModule = categories(connection);

const create = () => categories(connection).save("category-test");
const truncateTable = () => connection.execute("TRUNCATE TABLE categories");

test.beforeEach((t) => truncateTable());
test.after.always((t) => truncateTable());

test("All categories", async (t) => {
  await create();

  const list = await categoriesModule.all();

  t.is(list.categories.length, 4);
  t.is(list.categories[0].name, "category-test");
});

test("Create category", async (t) => {
  const result = await create();

  t.is(result.category.name, "category-test");
});

test("Update Category", async (t) => {
  await create();

  const updated = await categoriesModule.update(1, "category-test-updated");

  t.is(updated.category.name, "category-test-updated");
  t.is(updated.affectedRows, 1);
});

test("Remove Category", async (t) => {
  await create();

  const updated = await categoriesModule.remove(1);

  t.is(updated.affectedRows, 1);
});
