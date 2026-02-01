const express = require('express');
require('dotenv').config();
const app = express();
const port = 3000;
const { QuickDB } = require("quick.db");
const sizeOf = require('image-size')
const url = require('url')
const http = require('http')
const fetch = require('node-fetch');
const fs = require('fs');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const path = require('path')
const axios = require('axios');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const crypto = require('crypto');
const gTTS = require('gtts');
const ffmpeg = require('fluent-ffmpeg');
const lanugages = require('./languages.json')
const { exec } = require('child_process');
const dfpwm = require('dfpwm')

const token = process.env.WEBSITETOKEN;
const websiteauth = process.env.WEBSITEAUTH;
const channelId = '1156302752218091530';
const messageId = '1156302916873900032';

const db = new QuickDB({ filePath: "./website/json.sqlite" });

app.set('view engine', 'ejs');
app.set('views', './website/views');
app.use(favicon(path.join(__dirname, 'public', 'logo.ico')));
app.use(express.static('./website/public'));

//this is for sign in stuff
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({
      secret: crypto.randomBytes(32).toString('hex'), // Replace with a secret key for session encryption
      resave: false,
      saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());

main()

const defaultRead = {
  username: '(404)',
  avatar: '/agnabot.png',
  bg: '/background.png',
  agnabuckAmount: '(not found)',
  myPlace: '(404)'
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${websiteauth}`) {
    res.status(401).send('Unauthorized');
    console.log('look at this loser')
    return 
  }

  // Authentication successful, proceed to the next middleware or route handler
  next();
};

async function main() {

await loadSqlite()

let all = await db.all()
let filtertop = await all.filter(data => !isNaN(data.id))
await filtertop.sort((a, b) => b.value.a - a.value.a);

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: 'https://agnab.onrender.com/auth/discord/callback',
    scope: ['identify']
}, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        return done(null, profile);
    } else {
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/agnabot/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (await db.has(userId)) {

    const me = await db.get(userId);
    const myPlace = await filtertop.findIndex(obj => obj.id === userId) + 1
    let toRead = {
      username: me?.websiteData?.username,
      avatar: me?.websiteData?.avatar,
      bg: me?.websiteData?.image,
      agnabuckAmount: me?.a,
      myPlace: myPlace
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

app.get('/wiadn', async (req, res) => {
  res.render('wiadn');
});

app.get('/agnabot', async (req, res) => {
  const all = await db.all()
  const myFiltertop = await all.filter(data => !isNaN(data.id))
  await myFiltertop.sort((a, b) => b.value.a - a.value.a);
  const top = Object.values(myFiltertop).slice(0, 10);
  let toParse = []
  top.forEach((key, i) => {
    let toPush = {
      username: myFiltertop[i].value.websiteData?.username,
      avatar: myFiltertop[i].value.websiteData?.avatar,
      agnabuckAmount: myFiltertop[i].value?.a,
      id: myFiltertop[i].id
    }
    const toPushKeys = Object.keys(toPush)
    toPushKeys.forEach((key) => {
      if (!toPush[key]) {
        toPush[key] = defaultRead[key]
      }
    })

    toParse.push(toPush)
  })
  res.render('agnabot', { toParse });
});




app.get('/search', async (req, res) => {
  const query = req.query.query; // assuming the search query is passed as a query parameter

  const all = await db.all()
  const searchResult = all.filter(item => item.value.websiteData?.username.includes(query.toLowerCase()));
  let users = []
  searchResult.forEach((key) => {
    users.push({ username: key.value.websiteData.username, id: key.id, avatar: key.value.websiteData.avatar, agnabuckAmount: key.value.a })
  })

  res.render('search', { users, query });
});

// start the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
}

async function loadSqlite() {
fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`, {
  headers: {
    Authorization: `Bot ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    if (data.code) {
      return console.log(`error code from discord: ${data.code}`, data?.message)
    }
    const attachment = data?.attachments[0];
    const fileUrl = attachment.url;

    fetch(fileUrl)
      .then(res => res.buffer())
      .then(buffer => {
        fs.writeFileSync('./website/json.sqlite', buffer); // change the file name and extension accordingly
        console.log('File downloaded successfully!');
      })
      .catch(err => console.error('Error downloading file:', err));
  })
  .catch(err => console.error('Error fetching message:', err));

  all = await db.all()
  filtertop = await all.filter(data => !isNaN(data.id))
}

async function fetchAttachment(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

//LOGIN things

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/', // redirect if authentication fails
}), (req, res) => {
    res.redirect('/agnabot');
});

app.get('/checkAuth', (req, res) => {
    if (req.user) { //if the user exists
        res.status(200).send(req.user);
    } else {
        res.status(401).send('User is not logged in');
    }
});

//API things

app.get('/api/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (await db.has(userId)) {
    const me = await db.get(userId)
    res.send(me)
  } else {
    res.send({ code: 404, message: 'user not found Womp womp' });
  }
});

app.use(bodyParser.json());

app.post('/api/loadsqlite', authenticate, async (req, res) => {
  const receivedData = req.body;
  for (const key in receivedData) {
    if (Object.hasOwnProperty.call(receivedData, key)) {
      const myData = receivedData[key]
      await db.set(receivedData[key].id, receivedData[key].value);
    }
  }
  res.send('yup')
  console.log('loaded new sqlite')
});

app.get('/api/tts', async (req, res) => {
    console.log(req.query?.text, req.query?.voice)
    let output
    if (req.query.text) {
      let voice = req.query?.voice || 'en'
      req.query?.voice in lanugages ? voice : voice = 'en'
    const gtts = await new gTTS(req.query.text, voice);
    const buffer = gtts.save('temp.mp3', async function (err, result) {
      if(err) { throw new Error(err) }
      console.log('Finished TTS');
      convertMp3ToDFPWM('temp.mp3', res)
    });
    }
})

const encoder = new dfpwm.Encoder()
async function convertMp3ToDFPWM(inputFile, res) {
ffmpeg(inputFile)
  .outputOptions('-f s8')
  .outputOptions('-ar 44100')
  .outputOptions('-ac 1')
  .outputOptions('-acodec pcm_s8')
  .output('temp.pcm')
  .on('end', () => {
    const pcmData = fs.readFileSync('temp.pcm');
    const dfpwmData = encoder.encode(pcmData)
    res.send(dfpwmData)
  })
  .on('error', (err) => {
    console.error('Error during conversion:', err);
  })
  .run();
}
