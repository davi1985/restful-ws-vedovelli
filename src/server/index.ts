import { createServer, plugins } from "restify";
import { routes } from "../http/routes";
import { cors } from "./cors";
import { jwtMiddleware } from "../middlewares/jwt";

const server = createServer();

const exclusionsRoutes = ["/auth"];

server.pre(cors.preflight);
server.use(cors.actual);
server.use(plugins.bodyParser());
server.use(jwtMiddleware({ exclusionsRoutes }));

routes(server);

export { server };
