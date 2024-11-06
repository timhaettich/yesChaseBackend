require('dotenv').config()

const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: process.env.DATABASE_URL,
      user: "yeschase",
      password: process.env.PASSWORD,
      database: "YesChase",
      connectTimeout: 60000
    },
    jwt: process.env.JWT
  };

  module.exports = config;
