// define constants from web page to be used
const weatherForm = document.querySelector('form');
const searchElement = document.querySelector('input');
const messageOne = document.querySelector('#message-one');
const messageTwo = document.querySelector('#message-two');
const messageThree = document.querySelector('#message-three');

messageOne.textContent = '';
messageTwo.textContent = '';

// add event listener on submit button
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const location = searchElement.value;

  // write default messages while forecast is being get
  messageOne.textContent = 'Loading...';
  messageTwo.textContent = '';
  messageThree.textContent = '';

  // if we get forecast send it to page
  fetch('/weather?address=' + location).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        messageOne.textContent = data.error;
        messageTwo.textContent = '';
        messageThree.textContent = '';
      } else {
        messageOne.textContent = data.location;
        messageTwo.textContent =
          'In ' + data.location + ' weather is ' + data.weather_stack;
        messageThree.textContent =
          'In ' + data.location + ' weather is ' + data.open_weather;
      }
    });
  });
});
