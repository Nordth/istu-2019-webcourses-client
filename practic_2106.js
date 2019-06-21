// ------------------
// 1. Маршруты
// ------------------
const express = require('express');

const app = express();

app.get('/',  (req, res, next) => {
    res.send("Hello <b>World!</b>")
});

app.get('/product/:id',  (req, res, next) => {
    res.send(`Detail info about:
              ${req.params.id}`);
});

// ------------------
// 2. Обработка форм
// ------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/contact',  (req, res, next) => {
    res.send(`
      <form action='/send' method="POST">
         First name: 
         <input type="text" name="firstname">
         <input type="submit">      
      </form>
    `);
});

app.post('/send', (req, res) => {
   res.send(`You have entered: 
            ${req.body.firstname}`);
});

// ------------------
// 3. Простое api
// ------------------

app.use(bodyParser.json());

const products = [{ title: "A" }, { title: "B" }]
app.get('/api/products', (req, res) => {
   res.json(products)
})
app.post('/api/products', (req, res) => {
   products.push(req.body.product);
   res.json(true)
})

// Postman

// ------------------
// 4. Api, работающее с файлом
// ------------------

// Создайте products.json в корне проекта
const fs = require("fs");

app.get('/api2/products', (req, res) => {
   fs.readFile(__dirname + "/products.json", 
      "utf8", (err, data) => {
          try{
             if (err) throw new Error(err);
             const products = JSON.parse(data);
             res.json({res: products});         
          }
          catch (err){
             res.json({error: err.message});
          }
      })
})

// ------------------
// 5. Api, работающее с базой
// ------------------

const sqlite = require('sqlite');
async function initSqlite(){
   const db = await sqlite.open(
               __dirname + '/db.sqlite');
   await db.run(`DROP TABLE IF EXISTS product;`);
   await db.run(`
      CREATE TABLE product(
          id integer PRIMARY KEY AUTOINCREMENT,
          title text NOT NULL
      );`);
 await db.run(`INSERT INTO product(title) VALUES('A')`);
 await db.run(`INSERT INTO product(title) VALUES('B')`);
   return db;
}
const dbPromise = initSqlite();

app.get('/api3/products', async (req, res) => {
    const db = await dbPromise;
    res.json({
       res: await db.all(`SELECT * FROM product`)
    });
})

app.listen(5000);

// node index.js
// В браузере: http://localhost:5000
