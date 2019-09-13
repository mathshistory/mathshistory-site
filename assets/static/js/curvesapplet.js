if (!self.SwingJS) {
  console.error('swingjs2.js was not found. It needs to be in swingjs folder in the same directory as ' + document.location.href)
} else if (typeof j2sPath === 'undefined' || typeof options === 'undefined') {
  console.error('cannot locate j2spath or options variable')
} else {
  var info = {
    code: "uk.ac.stand.mcs.wwwhistory.famouscurves.FamousCurves",
    main: null,
    core: "NONE",
    width: 400,
    height: 400,
    readyFunction: null,
    j2sPath: j2sPath,
    allowjavascript: true,
    ...options
  }

  SwingJS.getApplet('testApplet', info)
  getClassList = function() {
    J2S._saveFile('_j2sclasslist.txt', Clazz.ClassFilesLoaded.sort().join('\n'))
  }
}
