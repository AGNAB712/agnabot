const container = document.querySelector('body');
const image = document.querySelector('.big-boi');
const links = document.querySelector('.links');
const timestamp = document.getElementById("timestamp")
const about = document.querySelector('.about-container')
const icon = document.querySelector('.icon-container')

let isAtTop = true;

const width = window.innerWidth;

image.style.bottom = '-250px';
image.style.opacity = '0';

links.style.bottom = '-100px';
links.style.opacity = '0';

if (width <= 600) {
  image.style.bottom = '-3px';
  image.style.opacity = '1';

  links.style.bottom = '-10px';
  links.style.opacity = '1';
}

container.addEventListener('mousemove', (e) => {
  const yPosition = e.clientY;
  
  if ((yPosition > 300 || !isAtTop) || width <= 600) {
    image.style.bottom = '-3px';
    image.style.opacity = '1';

    links.style.bottom = width <= 600 ? "-10px" : '10px';
    links.style.opacity = '1';
  } else {
    image.style.bottom = '-250px';
    image.style.opacity = '0';

    links.style.bottom = '-100px';
    links.style.opacity = '0';
  }

});



function updateTime() {
  const currentDate = new Date();
  const hours = currentDate.getUTCHours();
  let minutes = currentDate.getUTCMinutes();

  let cstHours = hours - 6 < 0 ? (hours-6) + 24 : hours - 6
  let timeStringStamp = "AM"
  if (cstHours > 12) {
    timeStringStamp = "PM"
    cstHours -= 12
  }

  `${minutes}`.length == 1 ? minutes = "0"+minutes : minutes = minutes

  timestamp.innerHTML = cstHours + ":" + minutes + " " + timeStringStamp
}

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (scrolled === 0) {
    isAtTop = true
  } else {
    isAtTop = false
    image.style.bottom = '-3px';
    image.style.opacity = '1';

    links.style.bottom = '10px';
    links.style.opacity = '1';
  }

  if (scrolled > 250) {
    about.style.opacity = 1;
    about.style.left = 0;

    icon.style.opacity = 1;
    icon.style.marginLeft = width <= 600 ? "0" : "100px";
  } else {
    about.style.opacity = 0;
    about.style.left = "-500px";

    icon.style.opacity = 0;
    icon.style.marginLeft = "1500px";
  }
});

updateTime()
setInterval(updateTime, 60000);