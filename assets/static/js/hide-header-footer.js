if (window.opener !== null) {
    // this is a popup, hide the header and footer
    document.getElementsByClassName('site-header')[0].style.display = 'none';
    document.getElementsByClassName('nav-bar')[0].style.display = 'none';
    document.getElementsByClassName('site-footer')[0].style.display = 'none';
    document.getElementsByTagName('main')[0].style.paddingTop = '16px';
    document.getElementsByTagName('main')[0].style.paddingBottom = '16px';
}
