<?php

    // this file does not do a redirect, but instead reads the contents of the
    // appropriate page, and displays them.
    // compared to the old "Today" page, it does not convert the "previous" and
    // "next" links to "yesterday" and "tomorrow".

    // get the month and day
    $today = getdate();
    $day = $today['mday'];
    $month = $today['mon'];

    // get the location, and echo it out
    $location = sprintf('../oftheday-%02d-%02d/index.html', $month, $day);
    readfile($location);

?>
