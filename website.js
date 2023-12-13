const express = require('express');
const app = express();
const port = 3000; // you can change this to your preferred port
const { QuickDB } = require("quick.db");
const sizeOf = require('image-size')
const url = require('url')
const http = require('http')

const defaultRead = {
  username: '(404)',
  avatar: '/agnabot.png',
  bg: '/background.png',
  agnabuckAmount: '(not found)',
  myPlace: '(404)'
}

async function main() {
const db = new QuickDB({ filePath: "./json.sqlite" });
const all = await db.all()
const filtertop = all.filter(data => !isNaN(data.id))
await filtertop.sort((a, b) => b.value.a - a.value.a);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

// define a route to handle the search
app.get('/agnabot/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (await db.has(userId)) {

    const me = await db.get(userId);
    let toRead = {
      username: me?.websiteData?.username,
      avatar: me?.websiteData?.avatar,
      bg: me?.websiteData?.image,
      agnabuckAmount: me?.a,
      myPlace: filtertop.findIndex(obj => obj.id === userId) + 1
    }
    const toReadKeys = Object.keys(toRead)
    toReadKeys.forEach((key) => {
      if (!toRead[key]) {
        toRead[key] = defaultRead[key]
      }
    })
    let inventoryArray
    if (me.inv) {
      inventoryArray = Object.keys(me?.inv)
    } else {
      inventoryArray = []
    }

    res.render('inventory', toRead);
  } else {
    res.render('notfound', { userId });
  }
});

// define a route to handle the search
app.get('/', async (req, res) => {
  res.render('home');
});

// start the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
}

main()

module.exports = main