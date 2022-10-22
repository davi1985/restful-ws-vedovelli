import { Next, Request, Response } from "restify";
import jwt from "jsonwebtoken";

interface IJWTMiddleware {
  exclusionsRoutes: string[];
}

export const jwtMiddleware =
  (deps: IJWTMiddleware) => async (req: Request, res: Response, next: Next) => {
    const token = req.headers["x-access-token"];

    if (!deps.exclusionsRoutes.includes(req.href())) {
      if (!token) {
        res.send(403, { error: "Token não encontrado" });

        return false;
      }

      try {
        (<any>req).decoded = jwt.verify(
          token as string,
          process.env.JWT_SECRET as string
        );
      } catch (error) {
        res.send(403, { error: "Falha ao autenticar o token" });
      }
    }

    next();
  };
