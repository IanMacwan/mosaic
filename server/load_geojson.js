
const response = await fetch(
  `http://localhost:3000/api/facilities/nearby?lng=-79.38&lat=43.651`
);

const nearbyFacilities = await response.json();

console.log(nearbyFacilities);