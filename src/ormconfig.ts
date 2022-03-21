import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumcloneuser',
  password: '123',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // never use synchronize option, dangerous in production
  // use migration !
  synchronize: false,
  // config for migration
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;
