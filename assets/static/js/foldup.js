var toggleIds = ['references-toggle', 'additional-toggle', 'honours-toggle', 'xrefs-toggle']
var listIds = ['references-list', 'additional-list', 'honours-list', 'xrefs-list']

function setupToggle(toggleId, listId) {
  if (!!document.getElementById(toggleId)) {
    // do this is js so that if the browser doesn't have js enabled, it will still show
    document.getElementById(listId).style.display = 'none'
    document.getElementById(toggleId).onclick = function () {
      var current = document.getElementById(listId).style.display
      var newDisplay = document.getElementById(listId).style.display === 'none' ? 'flex' : 'none'
      var label = document.getElementById(listId).style.display === 'none' ? 'hide' : 'show'
      document.getElementById(listId).style.display = newDisplay
      document.getElementById(toggleId).innerText = label
      return false
    }
  }
}

for (var i = 0; i < toggleIds.length; i++) {
  setupToggle(toggleIds[i], listIds[i])
}
