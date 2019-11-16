// import { config } from 'dotenv';
import 'reflect-metadata';

// config();

import * as microDev from 'micro-dev';
import { createConnection } from 'typeorm';
import serve from 'micro';
import { environment } from '../environments/environment';
import { withRouter } from './lib/decorators/withRouter';
import { withCors } from './lib/decorators/withCors';
import { authHandlers } from './handlers/auth';
import { bookingHandlers } from './handlers/booking';
import { escapeRoomHandlers } from './handlers/escapeRoom';
import { organizationHandlers } from './handlers/organization';
import { userHandlers } from './handlers/user';
import { BookingEntity } from './entities/BookingEntity';
import { EscapeRoomBusinessHoursEntity } from './entities/EscapeRoomBusinessHoursEntity';
import { EscapeRoomEntity } from './entities/EscapeRoomEntity';
import { OrganizationBusinessHoursEntity } from './entities/OrganizationBusinessHoursEntity';
import { OrganizationEntity } from './entities/OrganizationEntity';
import { OrganizationMembershipEntity } from './entities/OrganizationMembershipEntity';
import { PaymentDetailsEntity } from './entities/PaymentDetailsEntity';
import { RefreshTokenEntity } from './entities/RefreshTokenEntity';
import { UserEntity } from './entities/UserEntity';

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

createConnection({
  type: 'postgres',
  database: process.env.TYPEORM_DATABASE,
  host: process.env.TYPEORM_HOST,
  logging: !!process.env.TYPEORM_LOGGING,
  password: process.env.TYPEORM_PASSWORD,
  port: +(process.env.TYPEORM_PORT || 3000),
  synchronize: !!process.env.TYPEORM_SYNCHRONIZE,
  username: process.env.TYPEORM_USERNAME,
  entities: [
    BookingEntity,
    EscapeRoomBusinessHoursEntity,
    EscapeRoomEntity,
    OrganizationBusinessHoursEntity,
    OrganizationEntity,
    OrganizationMembershipEntity,
    PaymentDetailsEntity,
    RefreshTokenEntity,
    UserEntity
  ]
})
  .then(() => console.info('database connection established'))
  .catch(error => console.error(error));

if (!environment.production) {
  microDev({ silent: false, limit: '1mb', host: '::', port })(handler);
} else {
  console.info(`listening on port ${port}`);
  serve(handler).listen(port);
}
