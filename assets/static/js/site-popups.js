function popupOptions (title) {
  return {
    title: title,
    trigger: 'click',
    placement: 'top',
    html: true,
    closeOnClickOutside: true,
    popperOptions: {
      modifiers: {
        flip: {
          enabled: false
        }
      }
    }
  }
}

function getPopupFragment (url, cb) {
  var request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    if (this.readyState !== 4) return
    if (this.status !== 200) return cb({status: this.status})

    var response = this.responseText
    var fragment = document.createElement('div')
    fragment.innerHTML = response

    cb(null, fragment)
  }
  request.open('GET', url, true)
  request.send()
}


function formatGlossaryFragment (fragment, popup, urlContext) {
  var links = fragment.querySelectorAll('.gllink')
  for (var i = 0; i < links.length; i++) {
    var link = links[i]
    link.onclick = function (el, event) {
      event.preventDefault()
      var popupLocation = el.getAttribute('data-popup')

      // compute actual location
      popupLocation = new URL(popupLocation, urlContext)

      getPopupFragment(popupLocation, function (error, fragment) {
        if (error) console.error(error)

        // recurse around
        formatGlossaryFragment(fragment, popup, popupLocation)
        popup.updateTitleContent(fragment)
      })
      return false
    }.bind(this, link)
  }
}


function preloadPopups (elements, urls, index) {
  if (typeof index === 'undefined') index = 0
  if (index >= elements.length) return

  getPopupFragment(urls[index], function (error, fragment) {
    if (error) {
      console.error(error)
      return preloadPopups(elements, urls, index + 1)
    }

    // add the tooltip in
    var popup = new Tooltip(elements[index], popupOptions(fragment))

    // special case for glossaries
    // make gllinks in the popup, show in that popup
    if (elements[index].classList.contains('gllink')) {
      var urlContext = new URL(urls[index], window.location.href).href
      formatGlossaryFragment(fragment, popup, urlContext)
    }

    // special case for biographies
    // on popup click, go to the full biography
    if (elements[index].classList.contains('mlink')) {
      fragment.onclick = function (href, event) {
        window.location.href = href
      }.bind(this, elements[index].href)
    }

    // on successful popup add, break the link
    elements[index].onclick = function (e) {
      e.preventDefault()
      return false
    }

    // recurse round to the next link
    preloadPopups(elements, urls, index+1)
  })
}

// place to store links and elements
var urls = []
var elements = []

// mlinks
var links = document.getElementsByClassName('mlink')
for (var i = 0; i < links.length; i++) {
  var link = links[i]
  var popupLocation = link.getAttribute('data-popup')
  urls.push(popupLocation)
  elements.push(link)
}

// gllinks - only if NOT on glossary page
if (window.location.pathname.indexOf('/Glossary/') === -1) {
  links = document.getElementsByClassName('gllink')
  for (var i = 0; i < links.length; i++) {
    var link = links[i]
    var popupLocation = link.getAttribute('data-popup')
    urls.push(popupLocation)
    elements.push(link)
  }
}

// preload those popups
preloadPopups(elements, urls)

// translations
var translations = document.getElementsByClassName('translation')
for (var i = 0; i < translations.length; i++) {
  var translation = translations[i]
  var text = translation.getAttribute('data-translation')
  var popup = new Tooltip(translation, popupOptions(text))
}

// references
if (typeof referenceData !== 'undefined') {
  referenceData.forEach(reference => {
    var rnum = reference.number
    var fragment = document.createElement('div')
    fragment.className = 'bio'
    fragment.innerHTML = reference.reference
    var elements = document.getElementsByClassName(`reference-${rnum}`)
    for (var i = 0; i < elements.length; i++) {
      var popup = new Tooltip(elements[i], popupOptions(fragment))
      elements[i].onclick = function (e) {
        e.preventDefault()
        return false
      }
      console.log(elements[i])
    }
  })
}
