// associated curves
tippy('.associated-curve',{
  content(element) {
    console.log(arguments)
    var img = document.createElement('img')
    img.src = element.href
    return img
  },
  onCreate(instance) {
    instance._hasLoaded = false;
    instance.reference.onclick = function (e) {
      e.preventDefault();
      return false;
    }
  },
  allowHTML: true,
  trigger: 'click',
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
    instance._hasLoaded = false;
    instance.reference.onclick = function (e) {
      e.preventDefault();
      return false;
    }
  },
  onTrigger(instance) {
    if (!instance._hasLoaded) {
      return linkPopupTrigger(instance)
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
    instance._hasLoaded = false;
    instance.reference.onclick = function (e) {
      e.preventDefault();
      return false;
    }
  },
  onTrigger(instance) {
    if (!instance._hasLoaded) {
      return linkPopupTrigger(instance)
    }
  },
  allowHTML: true,
  trigger: 'click',
  theme: 'gllink',
  duration: [0,0],
  interactive: true,
  appendTo: document.body
})

function linkPopupTrigger(instance) {
  var url = instance.reference.getAttribute('data-popup')
  var request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    if (this.readyState !== 4) return
    if (this.status !== 200) {
      // on error, just go to the link as normal
      window.location.href = instance.reference.href
      return false
    }

    // we have the response
    var response = this.responseText

    // fix all the links in it
    response = fixLinks(response, url, instance)

    // set the popup content to it, and show it
    instance.setContent(response)
    instance.show()
    instance._hasLoaded = true;
  }
  request.open('GET', url, true)
  request.send()
  return false
}

function fixLinks(content, urlContext, instance) {
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

  return fragment.innerHTML
}
