
//initialize sql and create a database
let db;
initSqlJs({ locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}` }).then(SQL => {
    db = new SQL.Database();
    db.run("CREATE TABLE readings (id INTEGER PRIMARY KEY, date TEXT, content TEXT);");
});

//insert data
function logReading(date, content) {
    db.run("INSERT INTO readings (date, content) VALUES (?, ?);", [date, content]);
}

function getReadings() {
    let results = db.exec("SELECT * FROM readings;");
    console.log(results);
}

let data = db.export();
localStorage.setItem("myDatabase", JSON.stringify([...data]));



