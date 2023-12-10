const express = require('express');
const app = express();
const port = 3000; // you can change this to your preferred port
const { QuickDB } = require("quick.db");

const db = new QuickDB({ filePath: "./json.sqlite" });

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

// define a route to handle the search
app.get('/search/:userId', async (req, res) => {
  const userId = req.params.userId;

  // check if the user id exists in the database
  if (await db.has(userId)) {
    const me = await db.get(userId);
    const inventoryArray = Object.keys(me.inv)
    const agnabuckAmount = `${me.a}`;

    // render the inventory page with the contents
    res.render('inventory', { userId, inventoryArray, agnabuckAmount });
  } else {
    // render a page indicating user not found
    res.render('notfound', { userId });
  }
});

// start the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});