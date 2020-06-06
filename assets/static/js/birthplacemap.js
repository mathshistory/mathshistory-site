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

function format_latlong(lat, long) {
  var formatted_lat = ''
  var formatted_long = ''

  // do lat (north, south)
  if (lat < 0) {
    formatted_lat = (lat*-1).toString().replace('.','°') + "'S"
  } else {
    formatted_lat = lat.toString().replace('.','°') + "'N"
  }

  // do long (east, west)
  if (long < 0) {
    formatted_long = (long*-1).toString().replace('.','°') + "'W"
  } else {
    formatted_long = long.toString().replace('.','°') + "'E"
  }

  return formatted_lat + ' ' + formatted_long
}

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
      lat: place.latitude,
      long: place.longitude,
      country: place.country,
      links: place.links,
      gaz: place.gaz
    })

    if (place.id.toLowerCase() === fragment) {
      feature.setStyle(SELECTED_STYLE)
      currentFeature = feature
      startCenter = [place.longitude, place.latitude]
      startZoom = 7
      showPlace(place.name, place.people, place.latitude, place.longitude, place.country, place.links, place.gaz)
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
    if (features.length !== 0) {
      // reset styling of old feature
      if (currentFeature) currentFeature.setStyle(null)

      currentFeature = features[0]
      currentFeature.setStyle(SELECTED_STYLE)
      showPlace(currentFeature.get('name'), currentFeature.get('people'), currentFeature.get('lat'), currentFeature.get('long'), currentFeature.get('country'), currentFeature.get('links'), currentFeature.get('gaz'))
      e.preventDefault()
    }
  })

  // show pointer mouse when hovering over marker
  map.on('pointermove', function(e) {
    var hit = map.getFeaturesAtPixel(e.pixel)
    map.getViewport().style.cursor = hit ? 'pointer' : ''
  })

}


function showPlace (name, people, lat, long, country, links, gaz) {
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
    latLongHeader.innerText = format_latlong(lat, long)
  } else {
    latLongHeader.innerText = ''
  }

  var locationLinks = document.getElementById('location-links')
  while (locationLinks.firstChild) locationLinks.removeChild(locationLinks.firstChild)
  if (links && links.length != 0) {
    var span = document.createElement('span')
    span.innerText = 'More information about:'
    locationLinks.appendChild(span)
    var list = document.createElement('ul')

    for (var i = 0; i < links.length; i++) {
      var item = document.createElement('li')
      var link = document.createElement('a')
      link.innerText = links[i].text
      link.href = links[i].url
      link.target = '_blank'
      item.appendChild(link)
      list.appendChild(item)
    }
    locationLinks.appendChild(list)
  }

  var gazLink = document.getElementById('gaz-webref')
  while (gazLink.firstChild) gazLink.removeChild(gazLink.firstChild)
  if (gaz && gaz !== '') {
    for (var i = 0; i < gaz.length; i++) {
      var link = document.createElement('a')
      link.innerText = i == 0 && gaz.length == 1 ? 'Gazetteer entry' : ('Gazetteer entry ' + (i + 1))
      link.href = gaz[i]
      link.target = '_blank'
      gazLink.appendChild(link)
    }
  }

  var peopleList = document.getElementById('location-people')
  while (peopleList.firstChild) peopleList.removeChild(peopleList.firstChild)
  var span = document.createElement('span')
  span.innerText = 'Mathematicians born here:'
  peopleList.appendChild(span)
  var list = document.createElement('ul')
  for (var i = 0; i < people.length; i++) {
    var li = document.createElement('li')
    var a = document.createElement('a')
    a.innerText = people[i].name
    a.href = people[i].url
    li.appendChild(a)
    if (people[i].near && people[i].near != '') {
      li.appendChild(document.createTextNode(' (at ' + people[i].near + ')'))
    }
    list.appendChild(li)
  }
  peopleList.appendChild(list)
}
