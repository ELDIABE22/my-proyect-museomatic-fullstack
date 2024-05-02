import mysql from 'mysql2/promise';

const config = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    port: process.env.MYSQLPORT || 3306,
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'museodb'
}

export const connection = await mysql.createConnection(config);