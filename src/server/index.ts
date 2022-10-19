import { createServer, plugins } from 'restify'
import { routes } from '../http/routes'
import { cors } from './cors'

const server = createServer()

// cors execution
server.pre(cors.preflight)
server.use(cors.actual)
server.use(plugins.bodyParser())

// routes
routes(server)

export { server }
