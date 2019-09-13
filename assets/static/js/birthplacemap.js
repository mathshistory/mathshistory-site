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

  var selectedStyle = new ol.style.Style({
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
      webref: place.webref
    })

    if (place.id.toLowerCase() === fragment) {
      feature.setStyle(selectedStyle)
      currentFeature = feature
      startCenter = [place.longitude, place.latitude]
      startZoom = 7
      showPlace(place.name, place.people, place.latitude, place.longitude, place.country, place.webref)
    }

    vectorSource.addFeature(feature)
  }

  // create the map
  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          attributions: 'All maps © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
          url: 'http://archive.hictooth.com/maps/{z}/{x}/{y}.png'
        })
      }),
      new ol.layer.Vector({
        source: vectorSource
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat(startCenter),
      zoom: startZoom,
      minZoom: 1,
      maxZoom: 7
    })
  });

  // when marker clicked, show relevent info
  map.on('click', function(e) {
    var features = map.getFeaturesAtPixel(e.pixel)
    if (features) {
      // reset styling of old feature
      if (currentFeature) currentFeature.setStyle(null)

      currentFeature = features[0]
      currentFeature.setStyle(selectedStyle)
      showPlace(currentFeature.get('name'), currentFeature.get('people'), currentFeature.get('lat'), currentFeature.get('long'), currentFeature.get('country'), currentFeature.get('webref'))
      e.preventDefault()
    }
  })

  // show pointer mouse when hovering over marker
  map.on('pointermove', function(e) {
    var hit = map.getFeaturesAtPixel(e.pixel)
    map.getViewport().style.cursor = hit ? 'pointer' : ''
  })

}


function showPlace (name, people, lat, long, country, webref) {
  var locationHeader = document.getElementById('location-name')
  locationHeader.innerText = name

  var countryHeader = document.getElementById('location-country')
  if (country && country !== '') {
    countryHeader.innerText = country
  } else {
    countryHeader.innerText = ''
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
