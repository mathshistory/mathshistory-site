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

function loadMap (places) {

  var startCenter = [-4.8139907,54.836587]
  var startZoom = 5
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
      minZoom: 5,
      maxZoom: MAX_ZOOM
    })
  });

  // when marker clicked, go to that entry
  map.on('click', function(e) {
    var features = map.getFeaturesAtPixel(e.pixel)
    if (features.length !== 0) {
      var feature = features[0]
      feature.setStyle(SELECTED_STYLE)
      var url = gazRoot + feature.get('id')
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
