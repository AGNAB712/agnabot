const leaderboardText = document.querySelector('.leaderboard-header');
const sidebar = document.querySelector('.sidebar');

let loggedIn = false;
checkAuth()

function redirectToAuth() {
  if (loggedIn == false) {
    window.location.href = `/auth/discord`;
  } else {
    window.location.href = `/agnabot/${loggedIn.id}`;
  }
}

function checkAuth() {
  fetch('/checkAuth')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        loggedIn = false;
        throw new Error('User is not logged in');
      }
    })
    .then(data => {
      loggedIn = data;
      const authButton = document.getElementById('authButton');
      authButton.innerHTML = `
        <img src="https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png" alt="User Avatar" class="user-avatar">
          ${data.username}
          `;
    })
    .catch(error => {
      const authButton = document.getElementById('authButton');
        authButton.innerHTML = `
        <img src="discord.png" alt="Discord Logo" class="user-avatar">
          Log in with Discord
        `;
    console.error('Error checking authentication:', error);
    });
  }


const width = window.innerWidth;

window.onload = function() {
if (width <= 600) {

//finish mobile support later Lol

} else {
    sidebar.style.left = '5%';
    leaderboardText.style.left = '10%';
}
}


function search() {
  const query = document.getElementById('searchInput').value;
  window.location.href = `/search?query=${query}`;
}

function handleKey(e) {
  if (e.key === 'Enter') {
    search();
  }
}