import corsMiddleware from 'restify-cors-middleware'

export const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['*'],
  exposeHeaders: ['*']
})
