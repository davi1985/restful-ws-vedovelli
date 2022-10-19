import { Server } from "restify";
import { db } from "../services";

export const routes = (server: Server) => {
  server.get("/", (_, res, next) => {
    res.send("Enjoy the silence!");

    next();
  });

  server.get("/category", async (req, res, next) => {
    try {
      const categories = await db.categories().all();

      res.status(200);
      res.json(categories);

      next();
    } catch (error) {
      res.status(400);
      res.send(error);

      next();
    }
  });

  server.post("/category", async (req, res, next) => {
    const { name } = req.body;

    try {
      const categories = await db.categories().save(name);

      res.status(200);
      res.json(categories);

      next();
    } catch (error) {
      res.status(400);
      res.send(error);

      next();
    }
  });

  server.put("/category/:id", async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const categories = await db.categories().update(Number(id), name);

      res.status(200);
      res.json(categories);

      next();
    } catch (error) {
      res.status(400);
      res.send(error);

      next();
    }
  });

  server.del("/category/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
      const category = await db.categories().remove(Number(id));

      res.status(200);
      res.json(category);

      next();
    } catch (error) {
      res.status(400);
      res.send(error);

      next();
    }
  });
};