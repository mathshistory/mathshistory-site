function loadMap () {

  var location = [placeLongitude, placeLatitude]
  var startZoom = 6

  // add the marker
  var vectorSource = new ol.source.Vector({});
  var feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(location))
  })
  feature.setStyle(SELECTED_STYLE)

  vectorSource.addFeature(feature)

  // create the map
  var map = new ol.Map({
    target: 'gazetteer-map',
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
      center: ol.proj.fromLonLat(location),
      zoom: startZoom,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM
    })
  });
}

loadMap();
