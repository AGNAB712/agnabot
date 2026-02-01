const container = document.querySelector('.container');
const imageContainer = document.querySelector('.image-container');
const subheading = document.querySelector('.subheading');
const overlay = document.querySelector('.overlay');
const secondImage = document.querySelector('.second-image');

const width = window.innerWidth;

if (width <= 600) {

    console.log(width)
    imageContainer.style.bottom = '-250px';
    imageContainer.style.opacity = '1';

    subheading.style.bottom = '0px';
    subheading.style.opacity = '1';

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  console.log(scrolled)
  if (scrolled === 0) {
    isAtTop = true
  } else {
    isAtTop = false
  }

  if (scrolled > 0) {
    overlay.style.opacity = '1'; // Slide in the overlay from the left
  } else {
    overlay.style.opacity = '0'; // Slide out the overlay to the left
  }

  if (scrolled > 300) {
    secondImage.style.opacity = '1'; // Slide in the overlay from the left
  } else {
    secondImage.style.opacity = '0'; // Slide out the overlay to the left
  }
});


} else {
let isAtTop = true;

container.addEventListener('mousemove', (e) => {
  const yPosition = e.clientY;
  
  if (yPosition > 100 || !isAtTop) {
    imageContainer.style.bottom = '0';
    imageContainer.style.opacity = '1';

    subheading.style.bottom = '0px';
    subheading.style.opacity = '1';
  } else {
    imageContainer.style.bottom = '-250px';
    imageContainer.style.opacity = '0';

    subheading.style.bottom = '-100px';
    subheading.style.opacity = '0';
  }


});

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (scrolled === 0) {
    isAtTop = true
  } else {
    isAtTop = false
  }

  if (scrolled > 250) {
    overlay.style.left = '20%'; // Slide in the overlay from the left
    secondImage.style.right = '10%'; // Slide in the second image from the right
  } else {
    overlay.style.left = '-1000px'; // Slide out the overlay to the left
    secondImage.style.right = '-1000px'; // Slide in the second image from the right
  }
});
}



window.onload = function() {
  window.scrollTo(0, 0);
}

let viewPercentage;

//fix formatting
if (navigator.userAgent.includes("Firefox")) {
  viewPercentage = 180;
} else {
  viewPercentage = 100;
}

document.body.style.zoom = `${viewPercentage}%`;