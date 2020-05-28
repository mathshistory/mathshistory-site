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
    //readfile($location);

    // create the theorem
    $theorem = "<hr/>\n<div class=\"row\">\n  <div class=\"col-md-12\">\n    <a href=\"https://www.theoremoftheday.org/\">Theorem of the day</a> from Robin Whitty\n  </div>\n</div>";

    // need to modify it for theorem of the day
    $contents = file_get_contents($location);
    $contents = str_replace("<!-- insert theorem here -->", $theorem, $contents);

    echo $contents;

?>
