const fetch = require('node-fetch');
const fs = require('fs');

const token = 'MTE4NTgwODA0MTcxOTkxMDQwMQ.GqdTgd.qlaoR5CZ77JecpPdMOyZ--_PrTo5pp13BoXOso';
const channelId = '1156302752218091530';
const messageId = '1156302916873900032';

fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`, {
  headers: {
    Authorization: `Bot ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    const attachment = data.attachments[0];
    const fileUrl = attachment.url;

    fetch(fileUrl)
      .then(res => {
        const dest = fs.createWriteStream('json.sqlite'); // change the file name and extension accordingly
        res.body.pipe(dest);
      })
      .catch(err => console.error('Error downloading file:', err));
  })
  .catch(err => console.error('Error fetching message:', err));
