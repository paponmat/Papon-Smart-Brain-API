const fs = require('fs');

module.exports = {
  client: 'pg',
  connection: {
    host: 'dpg-cjlda0fv9s6c73cba5n0-a.singapore-postgres.render.com',
    port: 5432,
    user: 'paponmat',
    database: 'smartbrain_60pw',
    password: 'apauJ2QQ2kPCITIWAwLCx8gjUzdk2MhP',
    ssl: { ca: fs.readFileSync('./config/server.crt'),} 
    ? { rejectUnauthorized: false } : false,
    },
};
  