var toggle = document.getElementById('references-toggle')
if (!!toggle) {
  var list = document.getElementById('references-list')
  toggle.onclick = function () {
    var current = list.style.display
    var newDisplay = list.style.display === 'none' ? 'block' : 'none'
    var label = list.style.display === 'none' ? 'hide' : 'show'
    list.style.display = newDisplay
    toggle.innerText = label
    return false
  }
}
