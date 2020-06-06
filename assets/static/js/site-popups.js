// associated curves
tippy('.tippyPic',{
  content(element) {
    var img = document.createElement('img')
    img.src = element.href
    return img
  },
  onCreate(instance) {
    instance._hasLoaded = false
    instance.reference.onclick = function (e) {
      e.preventDefault()
      return false
    }
  },
  allowHTML: true,
  trigger: 'click',
  theme: 'other',
  duration: [0,0],
  interactive: true,
  appendTo: document.body
})


// all translations
tippy('.translation',{
  content(element) {
    return element.getAttribute('data-popup')
  },
  allowHTML: true,
  trigger: 'click',
  theme: 'translation',
  duration: [0,0],
  interactive: true
})

// all references
tippy('.reference',{
  content(element) {
    return element.getAttribute('data-popup')
  },
  onCreate(instance) {
    instance.reference.onclick = function (e) {
      e.preventDefault()
      return false
    }
  },
  allowHTML: true,
  trigger: 'click',
  theme: 'reference',
  duration: [0,0],
  interactive: true,
  appendTo: document.body
})

// mlinks
tippy('.mlink', {
  onCreate(instance) {
    instance._hasLoaded = false
    instance.reference.onclick = function (e) {
      e.preventDefault()
      return false
    }
  },
  onTrigger(instance) {
    if (!instance._hasLoaded) {
      return linkPopupTrigger(instance, false)
    }
  },
  allowHTML: true,
  trigger: 'click',
  theme: 'mlink',
  duration: [0,0],
  interactive: true,
  appendTo: document.body
})

// mlinks
tippy('.gllink', {
  onCreate(instance) {
    instance._hasLoaded = false
    instance.reference.onclick = function (e) {
      e.preventDefault()
      return false
    }
  },
  onTrigger(instance) {
    instance.setContent(instance._initialContent)
    if (!instance._hasLoaded) {
      return linkPopupTrigger(instance, true)
    }
  },
  allowHTML: true,
  trigger: 'click',
  theme: 'gllink',
  duration: [0,0],
  interactive: true,
  appendTo: document.body
})

// anything else!
tippy('.tippyUrl', {
  onCreate(instance) {
    instance._hasLoaded = false
    instance.reference.onclick = function (e) {
      e.preventDefault()
      return false
    }
  },
  onTrigger(instance) {
    if (!instance._hasLoaded) {
      return linkPopupTrigger(instance, false)
    }
  },
  allowHTML: true,
  trigger: 'click',
  theme: 'other',
  duration: [0,0],
  interactive: true,
  appendTo: document.body
})

function getData(url, cb) {
  var request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    if (this.readyState !== 4) return
    if (this.status !== 200) {
      cb(true)
    }

    // we have the response
    var response = this.responseText
    cb(null, response)
  }
  request.open('GET', url, true)
  request.send()
}

function linkPopupTrigger(instance, isGllink) {
  var url = instance.reference.getAttribute('data-popup')

  getData(url, function (err, response) {
    if (err) {
      // on error, just go to the link as normal
      window.location.href = instance.reference.href
      return false
    }

    // fix all the links in it
    response = fixLinks(response, url, instance, isGllink)

    // set the popup content to it, and show it
    instance.setContent(response)
    instance.show()
    instance._hasLoaded = true
    instance._initialContent = response
  })

  // return false to disable the normal link
  return false
}

function fixLinks(content, urlContext, instance, isGllink) {
  // convert to fragment
  var fragment = document.createElement('div')
  fragment.innerHTML = content

  // get the absolute url of this popup
  var absoluteUrl = new URL(urlContext, window.location.href).href

  // fix all the urls
  var links = fragment.getElementsByTagName('a')
  for (var i = 0; i < links.length; i++) {
    var link = links[i]
    var href = link.getAttribute('href')
    var actualLocation = new URL(href, absoluteUrl)
    link.href = actualLocation
  }

  // update the popup when the images load
  var imgs = fragment.getElementsByTagName('img')
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i]
    img.onload = function () {
      instance.popperInstance.update()
    }
  }

  // for gllinks, these should change the contents of the popup
  if (isGllink) {
    links = fragment.getElementsByClassName('gllink')
    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      link.onclick = function (e) {
        e.preventDefault()
        var href = e.target.getAttribute('data-popup')
        var actualLocation = new URL(href, absoluteUrl)
        getData(actualLocation, function (err, data) {
          if (err) {
            // on error, just go to the link as normal
            window.location.href = href
          }

          var response = fixLinks(data, urlContext, instance, isGllink)
          instance.setContent(response)
        })
        return false
      }
    }
  }

  return fragment
}
