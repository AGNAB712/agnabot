const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "./website/json.sqlite" });

const currentURL = window.location.href;
const urlParts = currentURL.split('/');
const userIDIndex = urlParts.indexOf('agnabot') + 1; // cause the id happens after agnabot
const myUserID = urlParts[userIDIndex];




