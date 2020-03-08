import { config } from 'dotenv';
import 'reflect-metadata';

config();

import * as microDev from 'micro-dev';
import serve from 'micro';
import * as mongoose from 'mongoose';
import { environment } from '../environments/environment';
import { withRouter } from './lib/decorators/withRouter';
import { withCors } from './lib/decorators/withCors';
import { authHandlers } from './handlers/auth';
import { bookingHandlers } from './handlers/booking';
import { escapeRoomHandlers } from './handlers/escapeRoom';
import { organizationHandlers } from './handlers/organization';
import { userHandlers } from './handlers/user';
import { initEmail } from './helpers/email';
import { withErrorHandling } from './lib/decorators/withErrorHandling';

// TODO: loging (Sentry)
async function init() {
  if (!process.env.MONGODB_CONNECTION) {
    console.error('Missing env var MONGODB_CONNECTION');
    return;
  }

  await mongoose.connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  console.info('Database connection established');

  initEmail();

  const port = process.env.PORT || 3001;
  const handler = withErrorHandling(
    withRouter(
      userHandlers,
      authHandlers,
      bookingHandlers,
      escapeRoomHandlers,
      organizationHandlers
    )
  );

  if (!environment.production) {
    microDev({ silent: false, limit: '1mb', host: '::', port })(
      withCors(handler)
    );
  } else {
    console.info(`listening on port ${port}`);
    serve(handler).listen(port);
  }
}

init();
