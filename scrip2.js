// Obtener las referencias del DOM/HTML
const ciudadInput = document.getElementById("ciudad");
const obtenerPronosticoBtn = document.getElementById("obtenerPronostico");
const pronosticoDiv = document.getElementById("pronostico");

// Función que me permite obtener el pronóstico
function obtenerPronostico() {
  const ciudad = ciudadInput.value.trim();
  if (ciudad === "") {
    mostrarError("Por favor ingresa una ciudad");
    return;
  }

  // Pega tu llave API acá abajo
  const apiKey = "f4713b05361b7c34acc6c065eebda2c5";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

  // Realizar una solicitud HTTP utilizando la función fetch
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Utilizar la API de geocodificación de Google Maps para obtener las coordenadas de la ciudad
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: ciudad }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          const latitud = results[0].geometry.location.lat();
          const longitud = results[0].geometry.location.lng();
          // Mostrar los datos del pronóstico en el pronosticoDiv
          mostrarPronostico(data, latitud, longitud);
        } else {
          mostrarError("No se pudo encontrar la ciudad");
        }
      });
    })
    .catch(error => {
      mostrarError("Error al obtener el pronóstico");
      console.error(error);
    });
}

// Mostrar datos en el html
function mostrarPronostico(data, latitud, longitud) {
  const { name, main, weather } = data;
  const temperatura = main.temp;
  const sensacion = main.feels_like;
  const humedad = main.humidity;
  const descripcion = weather[0].description;
  const pronosticoHTML = `
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">${name}</h2>
        <p class="card-text">Temperatura: ${temperatura}°C</p>
        <p class="card-text">Sensación: ${sensacion}°C</p>
        <p class="card-text">Humedad: ${humedad}%</p>
        <p class="card-text">Descripción: ${descripcion}</p>
      </div>
    </div>
  `;
  pronosticoDiv.innerHTML = pronosticoHTML;

  // Actualizar el mapa con las coordenadas de la ciudad
  const mapa = new google.maps.Map(document.getElementById("map"), {
    center: { lat: latitud, lng: longitud },
    zoom: 10
  });

  // Agregar un marcador en el mapa con la ubicación de la ciudad
  new google.maps.Marker({
    position: { lat: latitud, lng: longitud },
    map: mapa,
    title: name
  });
}

function mostrarError(mensaje) {
  const errorHTML = `
    <div class="alert alert-danger" role="alert">
      ${mensaje}
    </div>
  `;
  pronosticoDiv.innerHTML = errorHTML;
}

// Agregar evento de click al botón de obtener pronóstico
obtenerPronosticoBtn.addEventListener("click", obtenerPronostico);