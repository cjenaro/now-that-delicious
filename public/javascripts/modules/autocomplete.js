const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')

function autocomplete(input, latInput, lngInput) {
  if (!input) return

  const MAPBOX_KEY =
    'pk.eyJ1IjoiamVuYXJvOTQiLCJhIjoiY2pzbnBpajh3MGV5MTQ0cnJ3dmJlczFqbiJ9.Aktxa1EqTzpy7yEaBDM1xQ'
  mapboxgl.accessToken = MAPBOX_KEY

  let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  })

  geocoder.addTo('#search-address')
  geocoder.on('result', e => {
    input.value = e.result.place_name
    latInput.value = e.result.geometry.coordinates[0]
    lngInput.value = e.result.geometry.coordinates[1]
  })

  document.querySelector('#search-address>div').style =
    'width: 100%; max-width: unset; border: 1px solid #e6e6e6; box-shadow: unset; border-radius: 0; z-index: 1000; font-family: sans-serif; font-size: 100%; line-height: 1.15; margin: 0 0 10px 0;'
}

export default autocomplete
