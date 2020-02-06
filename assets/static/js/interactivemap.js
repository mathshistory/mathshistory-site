// config properties for the openlayer maps
var ATTRIBUTIONS = 'All maps © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.'
var TILE_URL = 'https://l-mathshist-w1.st-andrews.ac.uk/mapimages/{z}/{x}/{y}.png'
var MIN_ZOOM = 1
var MAX_ZOOM = 9

// keep the marker style consistent throughout all the maps
var SELECTED_STYLE = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({
      color: 'red'
    }),
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 1
    })
  })
})
