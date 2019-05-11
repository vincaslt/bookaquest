import { config } from 'dotenv'
import 'reflect-metadata'

config()

import { withCors } from '@app/decorators/withCors'
import authHandlers from '@app/handlers/auth'
import userHandlers from '@app/handlers/user'
import serve from 'micro'
import * as microDev from 'micro-dev'
import { router } from 'microrouter'
import { createConnection } from 'typeorm'

const handler = withCors(router(...userHandlers, ...authHandlers))

const port = process.env.PORT || 3001

// tslint:disable no-console
createConnection()
  .then(_ => console.info('database connection established'))
  .catch(error => console.error(error))

if (process.env.NODE_ENV === 'development') {
  microDev({ silent: false, limit: '1mb', host: '::', port })(handler)
} else {
  console.info(`listening on port ${port}`)
  serve(handler).listen(port)
}
// tslint:enable no-console
