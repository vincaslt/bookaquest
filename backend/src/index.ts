import { config } from 'dotenv'
import 'reflect-metadata'

config()

import authHandlers from '@app/handlers/auth'
import bookingHandlers from '@app/handlers/booking'
import escapeRoomHandlers from '@app/handlers/escapeRoom'
import organizationHandlers from '@app/handlers/organization'
import userHandlers from '@app/handlers/user'
import { withCors } from '@app/lib/decorators/withCors'
import { withRouter } from '@app/lib/decorators/withRouter'
import serve from 'micro'
import * as microDev from 'micro-dev'
import { createConnection } from 'typeorm'

const handler = withCors(
  withRouter(userHandlers, authHandlers, escapeRoomHandlers, organizationHandlers, bookingHandlers)
)

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
