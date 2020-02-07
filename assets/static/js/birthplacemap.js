var request = new XMLHttpRequest()
request.onreadystatechange = function () {
  if (this.readyState !== 4) return
  if (this.status !== 200) return console.error(this.status)

  var response = this.responseText
  var data = JSON.parse(response)

  loadMap(data)
}
request.open('GET', './data.json', true)
request.send()

function loadMap (places) {

  // currently selected feature
  var currentFeature = null
  var startCenter = [0, 0]
  var startZoom = 1
  var fragment = location.hash.substr(1).trim().toLowerCase()

  // build up the markers
  var vectorSource = new ol.source.Vector({});
  for (var i = 0; i < places.length; i++) {
    var place = places[i]
    var feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([place.longitude, place.latitude])),
      people: place.people,
      name: place.name,
      lat: place.longitude,
      long: place.latitude,
      country: place.country,
      webref: place.webref,
      gaz: place.gaz
    })

    if (place.id.toLowerCase() === fragment) {
      feature.setStyle(SELECTED_STYLE)
      currentFeature = feature
      startCenter = [place.longitude, place.latitude]
      startZoom = 7
      showPlace(place.name, place.people, place.latitude, place.longitude, place.country, place.webref, place.gaz)
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
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM
    })
  });

  // when marker clicked, show relevent info
  map.on('click', function(e) {
    var features = map.getFeaturesAtPixel(e.pixel)
    if (features) {
      // reset styling of old feature
      if (currentFeature) currentFeature.setStyle(null)

      currentFeature = features[0]
      currentFeature.setStyle(SELECTED_STYLE)
      showPlace(currentFeature.get('name'), currentFeature.get('people'), currentFeature.get('lat'), currentFeature.get('long'), currentFeature.get('country'), currentFeature.get('webref'), currentFeature.get('gaz'))
      e.preventDefault()
    }
  })

  // show pointer mouse when hovering over marker
  map.on('pointermove', function(e) {
    var hit = map.getFeaturesAtPixel(e.pixel)
    map.getViewport().style.cursor = hit ? 'pointer' : ''
  })

}


function showPlace (name, people, lat, long, country, webref, gaz) {
  var locationHeader = document.getElementById('location-name')
  locationHeader.innerText = name

  var countryHeader = document.getElementById('location-country')
  if (country && country !== '') {
    countryHeader.innerText = country
  } else {
    countryHeader.innerText = ''
  }

  var latLongHeader = document.getElementById('location-latlong')
  if (lat && long) {
    latLongHeader.innerText = lat + ', ' + long
  } else {
    latLongHeader.innerText = ''
  }

  var wikiHeader = document.getElementById('location-webref')
  while (wikiHeader.firstChild) wikiHeader.removeChild(wikiHeader.firstChild)
  if (webref && webref !== '') {
    var link = document.createElement('a')
    link.innerText = 'More Info'
    link.href = webref
    link.target = '_blank'
    wikiHeader.appendChild(link)
  }

  if (gaz && gaz !== '') {
    var link = document.createElement('a')
    link.innerText = 'Gazateer entry'
    link.href = gaz
    link.target = '_blank'
    wikiHeader.appendChild(document.createElement('br'))
    wikiHeader.appendChild(link)
  }

  var peopleList = document.getElementById('location-people')
  while (peopleList.firstChild) peopleList.removeChild(peopleList.firstChild)
  for (var i = 0; i < people.length; i++) {
    var li = document.createElement('li')
    var a = document.createElement('a')
    a.innerText = people[i].name
    a.href = people[i].url
    li.appendChild(a)
    peopleList.appendChild(li)
  }
}
