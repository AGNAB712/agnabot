const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "./website/json.sqlite" });

const currentURL = window.location.href;
const urlParts = currentURL.split('/');
const userIDIndex = urlParts.indexOf('agnabot') + 1; // cause the id happens after agnabot
const myUserID = urlParts[userIDIndex];

function generateDiscordEmbed(userID) {
  const me = await db.get(userID)
  const avatarURL = me.websiteData.avatar || './website/public/agnabot.png'; // Default avatar URL
  
  // Discord Open Graph metadata
  const metadata = {
    'title': `${me.websiteData.username} - agnab.site`,
    'description': `Yup`,
    'image': {
      'url': avatarURL,
    },
    // Add more metadata fields as needed (e.g., 'url', 'type', 'site_name', etc.)
  };

  return metadata;
}


const embedData = generateDiscordEmbed(myUserID);
console.log(embedData)

const metaTags = document.createElement('meta');
metaTags.setAttribute('property', 'og:title');
metaTags.setAttribute('content', embedData.title);
document.head.appendChild(metaTags);