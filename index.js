const path = require('path'); // use path module
const express = require('express'); // use express module
const mysql = require('mysql'); // use mysql
const hbs = require('hbs'); // use hbs view engine
const bodyParser = require('body-parser'); // use bodyParser midlerware
const morgan = require('morgan');
const { DB_HOST, DB_USER, DB_PASS, DB_DATABASE } = process.env;
const app = express();

// config database
const conn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_DATABASE
})

//cek connection
conn.connect((err) => {
    if (!err) {
        console.log('Connected');
    } else {
        console.log("Database is not connect");
    }
})

// set port
app.listen(3000, () => {
    console.log('App listening on port 3000 ...');
});

app.use(morgan('dev'));

// view file connect
app.set("views", path.join(__dirname, "views"));
// View engine
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Home Page Route
app.get("/", (req, res) => {
    let sql = "SELECT * FROM user";
    let query = conn.query(sql, (err, results) => {
        if (!err) {
            res.render("index", {
                results: results,
            })
        } else {
            throw err;
        }
    });
});

// Save data
app.post("/save", (req, res) => {
    let data = req.body;
    console.log('data', data);
    let sql = "INSERT INTO user SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (!err){
            res.redirect('/');
        }else{
            throw err;
        }
    });
});

// hapus data
app.get("/delete/:id", (req, res) => {
    let idUser = req.params.id;
    let sql = "DELETE FROM user WHERE id=" + idUser + "";
    let query = conn.query(sql, (err, results) => {
        if (!err){
            res.redirect('/');
        }else{
            throw err;
        }
    });
  });

  // view edit data
  app.get("/ubah/:id", (req, res) => {
      let idUser = req.params.id;
      let sql = "SELECT * FROM user WHERE id ="+idUser+"";
      let query = conn.query(sql, (err, results) => {
        if (!err){
            res.render('view_edit', {
                //kenapa disitu pake [0] karna kalo ngga dia pasti muncul object bukan data
                results: results[0],
            })
        }else{
            throw err;
        } 
      })
  })

  // update data
  app.post("/update", (req, res) => {
      let data = req.body;
      let sql = "UPDATE user set nama = '"+data.nama+"', alamat = '"+data.alamat+"', hobi = '"+data.hobi+"' WHERE id = '"+data.id+"'";
      let query = conn.query(sql, (err, results) => {
          if (!err) {
              res.redirect("/");
          } else {
              throw err;
          }
      })
  })

// insert data
// conn.query("insert into user values ('2', 'zada', 'Tegal', 'game')",
//     (err, rows, fields) => {
//         conn.end();
//         if (!err) {
//             console.log("Insert data success ", rows);
//         } else {
//             console.log("Error while insert data");
//         }
//     }
// );

// show all data
// conn.query("Select * From user",
//     (err, rows, fields) => {
//         conn.end();
//         if (!err) {
//             console.log("Get all datas ", rows);
//         } else {
//             console.log("Error while show data");
//         }
//     }
// );

// update data 
// conn.query("Update user set nama='Faqih zada', alamat='Bandung', hobi='Dota 2' where id='1'",
//     (err, rows, fields) => {
//         conn.end();
//         if (!err) {
//             console.log("Data Has Been Update", rows);
//         } else {
//             console.log("Error while update data");
//         }
//     }
// );

// delete data
// conn.query("delete from user where id='2'",
//     (err, rows, fields) => {
//         conn.end();
//         if (!err) {
//             console.log("success delete data ", rows);
//         } else {
//             console.log("Error while delete data");
//         }
//     }
// );

