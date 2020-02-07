// adapted from the 'win1' function
var win = false;
function extraLinkPopup (location) {
  var h = 600;
  var v = 1000;
  if (v > screen.height) v = screen.height
  if (h > screen.width) h = screen.width
  var options = [
    'toolbar=0',
    'status=0',
    'scrollbars=1',
    'location=0',
    'resizable=1',
    'menubar=1',
    'screenx=10',
    'screeny=10',
    'width=' + h,
    'height=' + v
  ]
  win = window.open(location, '_blank', options.join(','))
}

// make them hide when the main window is focused
document.body.onfocus = function () {
  if (win && win.location) {
    win.close()
    win = false
  }
}

// go through all links, processing ones that go to /Extras/
var links = document.getElementsByTagName('a')
for (var i = 0; i < links.length; i++) {
  var link = links[i]
  if (link.href.indexOf('/Extras/') === -1) continue
  link.onclick = function (e) {
    var href = e.target.href
    extraLinkPopup(href)
    e.preventDefault()
    return false
  }
}
