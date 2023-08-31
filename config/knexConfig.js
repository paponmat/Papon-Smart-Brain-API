const fs = require('fs');
const KNEXCONFIG_HOST = process.env.KNEXCONFIG_HOST;
const KNEXCONFIG_USER = process.env.KNEXCONFIG_USER;
const KNEXCONFIG_DATABASE = process.env.KNEXCONFIG_DATABASE;
const KNEXCONFIG_PASSWORD = process.env.KNEXCONFIG_PASSWORD;

module.exports = {
  client: 'pg',
  connection: {
    host: KNEXCONFIG_HOST,
    port: 5432,
    user: KNEXCONFIG_USER,
    database: KNEXCONFIG_DATABASE,
    password: KNEXCONFIG_PASSWORD,
    ssl: { ca: fs.readFileSync('/etc/secrets/server.crt'),} 
    ? { rejectUnauthorized: false } : false,
    },
};
  