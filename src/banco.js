
const { Pool } = require("pg");

const banco = new Pool({
    host: "aws-0-us-east-1.pooler.supabase.com",
    port: 5432,
    user: "postgres.ynatnzynqbchpgsjwoea",
    password: "Stepro2020#@#$",
    database: "postgres",
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = banco;
