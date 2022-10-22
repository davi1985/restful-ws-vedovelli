import { Next, Request, Response, Server } from "restify";
import { db } from "../services";

export const routes = (server: Server) => {
  server.get("/", (_: Request, res: Response, next: Next) => {
    res.send("Enjoy the silence!");

    next();
  });

  server.post("/auth", async (req: Request, res: Response, next: Next) => {
    const { email, password } = req.body;

    try {
      const token = await db.auth().authenticate(email, password);

      res.send(201, token);
    } catch (error) {
      res.status(400);
      res.send(error);
    }

    next();
  });

  server.get("/category", async (_: Request, res: Response, next: Next) => {
    try {
      const categories = await db.categories().all();

      res.send(200, categories);
    } catch (error) {
      res.send(400, error);
    }

    next();
  });

  server.post("/category", async (req: Request, res: Response, next: Next) => {
    const { name } = req.body;

    try {
      const categories = await db.categories().save(name);

      res.send(201, categories);
    } catch (error) {
      res.send(400, error);
    }

    next();
  });

  server.put(
    "/category/:id",
    async (req: Request, res: Response, next: Next) => {
      const { id } = req.params;
      const { name } = req.body;

      try {
        const categories = await db.categories().update(Number(id), name);

        res.send(200, categories);
      } catch (error) {
        res.send(400, error);
      }

      next();
    }
  );

  server.del(
    "/category/:id",
    async (req: Request, res: Response, next: Next) => {
      const { id } = req.params;

      try {
        const category = await db.categories().remove(Number(id));

        res.send(204, category);
      } catch (error) {
        res.send(400, error);
      }

      next();
    }
  );
};
