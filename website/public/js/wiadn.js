const currentDate = new Date();
const offset = 5
let currentHour = currentDate.getUTCHours() - offset; //cst offset
if (currentHour < 0) { currentHour = (currentDate.getUTCHours()+24) - offset }
const currentMinute = currentDate.getUTCMinutes();

const weekday = [
  { name: 'sleeping', image: 'bed', startTime: { minutes: 0, hour: 0 } },
  { name: 'alive', description: 'probably awake but probably wont answer you', image: 'relax', startTime: { minutes: 0, hour: 7 } },
  { name: 'on the bus', image: 'bus', startTime: { minutes: 21, hour: 7 } },
  { name: 'at school', description: 'most likely not available', image: 'school', startTime: { minutes: 0, hour: 8 } },
  { name: 'on the bus', image: 'bus', startTime: { minutes: 26, hour: 14 } },
  { name: 'at home', description: 'probably available but i might have life stuff', image: 'relax', startTime: { minutes: 10, hour: 15 } },
  { name: 'asleep', image: 'bed', startTime: { minutes: 0, hour: 22 } },
];

const weekend = [
  { name: 'sleeping', image: '', startTime: { minutes: 0, hour: 0 } },
  { name: 'working', image: '', startTime: { minutes: 0, hour: 0 } },
  { name: 'eating', image: '', startTime: { minutes: 0, hour: 0 } },
  { name: 'relaxing', image: '', startTime: { minutes: 0, hour: 0 } },
];

let currentActivity = { name: 'nothing', image: '' };
for (const activity of weekday.reverse()) {
  if (currentHour >= activity.startTime.hour && currentMinute >= activity.startTime.minutes) {
    currentActivity = activity;
    break;
  }
}

const image = document.getElementById("wiadnImage")
image.src = "../images/wiadn/"+currentActivity.image+".png"
//image.src = "../images/wiadn/bed.png"

const header = document.getElementById("wiadnHeader")
header.innerHTML = currentActivity.name

const descriptor = document.getElementById("wiadnDescriptor")
if (currentActivity.description) {
  descriptor.style.display = "block"
  descriptor.innerHTML = currentActivity.description
} else {
  descriptor.style.display = "none"
}

console.log('current activity:', currentActivity, currentActivity.description);
