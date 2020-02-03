import axios from 'axios'
import { $ } from './bling'

function loadPlaces(map, lat = 43.2, lng = -79.8) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`).then(res => {
    const places = res.data
    if (!places.length) return
    const markers = places.map(place => {
      const [placeLng, placeLat] = place.location.coordinates

      return {
        type: 'Feature',
        properties: {
          description: `
            <div class="popup">
              <a href="/store/${place.slug}">
                <img src="/uploads/${place.photo || 'store.png'}" alt="${
            place.name
          }"/>
                <p>${place.name} - ${place.location.address}</p>
              </a>
            </div>
          `,
        },
        geometry: {
          type: 'Point',
          coordinates: [placeLng, placeLat],
        },
      }
    })

    if (map.getLayer('markers')) {
      map.removeLayer('markers')
    }

    map.addLayer({
      id: 'markers',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: markers,
        },
      },
      layout: {
        'icon-image': 'custom-marker',
      },
    })
  })
}

function makeMap(mapDiv) {
  if (!$(`#${mapDiv}`)) return

  const MAPBOX_KEY =
    'pk.eyJ1IjoiamVuYXJvOTQiLCJhIjoiY2pzbnBpajh3MGV5MTQ0cnJ3dmJlczFqbiJ9.Aktxa1EqTzpy7yEaBDM1xQ'
  mapboxgl.accessToken = MAPBOX_KEY
  let map = new mapboxgl.Map({
    container: mapDiv, // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [-79.8, 43.2], // starting position [lng, lat]
    zoom: 11, // starting zoom
  })

  loadPlaces(map)

  let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  })

  geocoder.on('result', e => {
    loadPlaces(
      map,
      e.result.geometry.coordinates[0],
      e.result.geometry.coordinates[1]
    )
  })

  map.addControl(geocoder)

  map.on('load', function() {
    let popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
    })
    popup.setMaxWidth('unset')

    map.on('click', 'markers', function(e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer'

      var coordinates = e.features[0].geometry.coordinates.slice()
      var description = e.features[0].properties.description

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map)
    })

    /* Image: An image is loaded and added to the map. */
    map.loadImage('https://i.imgur.com/MK4NUzI.png', function(error, image) {
      if (error) throw error
      map.addImage('custom-marker', image)
    })
  })
}

export default makeMap
