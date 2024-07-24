export interface DBConfiguration {
  port: number;
  database: {
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
  };
}

export default () => {
  const config: DBConfiguration = {
    port: parseInt(process.env.PORT ?? '3000'),
    database: {
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'a2004',
      database: process.env.DATABASE_NAME ?? 'testDB',
    },
  };
  return config;
};
