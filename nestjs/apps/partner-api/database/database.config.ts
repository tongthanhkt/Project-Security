export const databaseConfig = () => ({
  database: {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    name: process.env.MYSQL_PARTNER_DATABASE_NAME,
    enabledLogging: process.env.MYSQL_ENABLE_LOGGING === 'true',
  },
});
