const temperature = document.querySelector('.temperature');
const input = document.querySelector('input');
const form = document.querySelector('form');
const locationText = document.getElementById('location');

temperature.textContent = '';
locationText.textContent = '';

form.addEventListener('submit', e => {
    e.preventDefault();

    locationText.textContent = 'Loading. . .'
    
    if(!input.value) return locationText.innerText = "Please enter the location!";

    fetch(`/weather?adress=${input.value}`)
    .then(response => {
        return response.json();
    })
    .then(myJSON => {
        if(myJSON.error) return locationText.textContent = myJSON.error;
        locationText.textContent = myJSON.weather.location;
        temperature.textContent = `${myJSON.weather.temperature} C`;
    })
    .catch(error => {
        console.log(error);
    })
    
})

