import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'miba23', // Ganti dengan password MySQL Anda yang sebenarnya
  database: 'landing_page_db',
  port: 3306,
});
