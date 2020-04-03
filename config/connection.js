//JawsDB
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JASDB_URL);
} else {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hacketheplanet",
    database: "todoagain_db"
  });
}
