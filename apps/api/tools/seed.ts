import { config } from 'dotenv';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserInitFields, UserModel } from '../src/app/models/User';
import { generateRandomString } from '../src/app/utils/string';

async function seed() {
  if (!process.env.MONGODB_CONNECTION) {
    console.error('Missing env var MONGODB_CONNECTION');
    return;
  }

  await mongoose.connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const user: UserInitFields = {
    fullName: 'vincas stonys',
    email: 'vincaslt@gmail.com',
    password: await bcrypt.hash('123456', 10),
    emailVerification: {
      code: generateRandomString(32),
      done: false
    }
  };

  await UserModel.create(user);

  console.log('done');
}

config();
seed();
