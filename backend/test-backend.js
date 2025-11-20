const axios = require('axios');

async function test() {
  try {
    console.log('Testing Reverse Geocode...');
    const res = await axios.get('http://localhost:3000/utils/reverse-geocode?lat=-16.328&lon=-48.953');
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
}

test();
