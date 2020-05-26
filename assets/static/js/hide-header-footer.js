if (window.opener !== null) {
    var header = document.getElementsByClassName('site-header')[0];
    var navbar = document.getElementsByClassName('nav-bar')[0]
    var footer = document.getElementsByClassName('site-footer')[0];
    var main = document.getElementsByTagName('main')[0];

    // this is a popup, hide the header and footer
    header.style.display = 'none';
    navbar.style.display = 'none';
    footer.style.display = 'none';
    main.style.paddingTop = '16px';
    main.style.paddingBottom = '16px';

    // create a close button
    var closeButton = document.createElement('button');
    closeButton.onclick = function () {
      window.close();
    }
    closeButton.innerText = 'Close window / Go back';

    // add a hr
    main.insertBefore(document.createElement('hr'), footer);

    // add the close button in
    var row = document.createElement('div');
    row.className = 'row';
    var col = document.createElement('div');
    col.className = 'col-md-12 text-center';
    row.appendChild(col);
    col.appendChild(closeButton);
    main.insertBefore(row, footer);
}
