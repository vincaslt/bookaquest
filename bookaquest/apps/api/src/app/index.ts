import { config } from 'dotenv';
import 'reflect-metadata';

config();

import serve from 'micro';
import * as microDev from 'micro-dev';
import { createConnection } from 'typeorm';
import { environment } from '../environments/environment';
import { withRouter } from './lib/decorators/withRouter';
import { withCors } from './lib/decorators/withCors';
import { authHandlers } from './handlers/auth';
import { bookingHandlers } from './handlers/booking';
import { escapeRoomHandlers } from './handlers/escapeRoom';
import { organizationHandlers } from './handlers/organization';
import { userHandlers } from './handlers/user';

const handler = withCors(
  withRouter(
    userHandlers,
    authHandlers,
    bookingHandlers,
    escapeRoomHandlers,
    organizationHandlers
  )
);

const port = process.env.PORT || 3001;

createConnection()
  .then(() => console.info('database connection established'))
  .catch(error => console.error(error));

if (!environment.production) {
  microDev({ silent: false, limit: '1mb', host: '::', port })(handler);
} else {
  console.info(`listening on port ${port}`);
  serve(handler).listen(port);
}
