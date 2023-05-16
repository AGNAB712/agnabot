const express = require('express');
const server = express();

server.all(`/`, (req, res) => {
    res.send(`hallo everybody this is my life support you shouldn't be here but congrats on finding it`);
});

function keepAlive() {
    server.listen(3000, () => {
        console.log(`Server is now ready! | ` + Date.now());
    });
}

module.exports = keepAlive;