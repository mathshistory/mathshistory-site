var request = new XMLHttpRequest()
request.onreadystatechange = function () {
  if (this.readyState !== 4) return
  if (this.status !== 200) return console.error(this.status)

  var response = this.responseText
  var data = JSON.parse(response)

  loadMap(data)
}
request.open('GET', mapDataLocation, true)
request.send()

// keep the marker style consistent throughout all the maps
var PARISMAP_STYLE = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({
      color: 'black'
    }),
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 1
    })
  })
})


function loadMap (places) {

  var startCenter = [2.2877965,48.8566408]
  var startZoom = 12
  var fragment = location.hash.substr(1).trim().toLowerCase()

  // build up the markers
  var vectorSource = new ol.source.Vector({});
  for (var i = 0; i < places.length; i++) {
    var place = places[i]
    var feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([place.longitude, place.latitude])),
      name: place.name,
      lat: place.longitude,
      long: place.latitude,
      id: place.id,
    })

    if (selectedPlace && place.id === selectedPlace) {
      feature.setStyle(SELECTED_STYLE)
    } else {
      console.log(PARISMAP_STYLE)
      feature.setStyle(PARISMAP_STYLE)
    }

    vectorSource.addFeature(feature)
  }

  // create the map
  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          attributions: ATTRIBUTIONS,
          url: TILE_URL
        })
      }),
      new ol.layer.Vector({
        source: vectorSource
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat(startCenter),
      zoom: startZoom,
      minZoom: 12,
      maxZoom: 17,
      /* the below coordinates were obtained by positioning the map, and then running: map.getView().calculateExtent(map.getSize()) */
      extent: [243011.03572303336, 6241514.360493725, 276261.14302708505, 6260623.617565019]
    })
  });

  // when marker clicked, go to that entry
  map.on('click', function(e) {
    var features = map.getFeaturesAtPixel(e.pixel)
    if (features) {
      var feature = features[0]
      feature.setStyle(SELECTED_STYLE)
      var url = parisMapRoot + feature.get('id')
      window.location.href = url
      e.preventDefault()
    }
  })

  // show pointer mouse when hovering over marker
  map.on('pointermove', function(e) {
    var hit = map.getFeaturesAtPixel(e.pixel)
    map.getViewport().style.cursor = hit ? 'pointer' : ''
  })
}
