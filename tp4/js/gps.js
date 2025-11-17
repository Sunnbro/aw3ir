function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.querySelector("#gpsMap").innerHTML =
      "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  const zoom = 5;
  const delta = 0.05 / Math.pow(2, zoom - 10);

  const bboxEdges = {
    south: position.coords.latitude - delta,
    north: position.coords.latitude + delta,
    west: position.coords.longitude - delta,
    east: position.coords.longitude + delta,
  };

  const bbox = `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${position.coords.latitude}%2C${position.coords.longitude}`;

  document.getElementById("gpsMap").innerHTML = `
        <iframe
          width="100%"
          height="200"
          frameborder="0"
          scrolling="no"
          src="${iframeSrc}">
        </iframe>
      `;
}

function showError(error) {
  let msg = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      msg = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      msg = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      msg = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      msg = "An unknown error occurred.";
      break;
  }
  document.querySelector("#gpsMap").innerHTML = msg;
}
