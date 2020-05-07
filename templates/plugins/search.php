{% extends "layout.html" %}

{% block head %}
{# include the search configuration #}
{% include "plugins/searchconfig.php" %}

<?php

  // not actually sure if this is ever set...
  if (isset($_GET["mode"])) {
    $mode = $_GET["mode"];
  }

  // we need to display results
  if (isset($_GET["query"])) {
    $mode = "query";
    $query_string = htmlspecialchars(trim($_GET["query"]));
  }

  // not sure what this does either
  if (isset($_GET["serviceID"])) {
    $serviceID = $_GET["serviceID"];
  }
?>

{{ super() }}
<meta name="robots" content="nofollow">

<!-- opengraph -->
<meta property="og:title" content="Search<?php if (isset($query_string)) echo 'results for: ' . $query_string;?> - Maths History">
<meta property="og:description" content="Search the Maths History site">
<meta property="og:site_name" content="Maths History">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="{{ this|canonical_url }}">

<!-- twitter card -->
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="Maths History" />
<meta name="twitter:title" content="Search<?php if (isset($query_string)) echo 'results for: ' . $query_string;?> - Maths History" />
<meta name="twitter:description" content="Search the Maths History site" />
{% endblock %}

{% block title %}Search<?php if (isset($query_string)) echo 'results for: ' . $query_string;?>{% endblock %}

{% block body %}

<div class="row">
  <div class="col-md-12">
    <h1>Search</h1>
  </div>
</div>

<?php

// display the search page
if ($mode === "") {
?>
<div class="row">
  <div class="col-md-12 col-md-offset-3 text-center">
    <form action="?" method="GET">
      <input required name="query" type="text" accesskey="q" placeholder="Search">
      <button type="submit">Search</button>
    </form>
  </div>
</div>
<?php
}

// display the results page
if ($mode === "query") {

  // get the sections we are searching in
  $search_sections = array();
  if (isset($_GET["section_biographies"])) {
    array_push($search_sections, "/v:Biographies/");
    $section_biographies = true;
  }
  if (isset($_GET["sections_histtopics"])) {
    array_push($search_sections, "/v:HistTopics/");
    $sections_histtopics = true;
  }
  if (isset($_GET["sections_curves"])) {
    array_push($search_sections, "/v:Curves/");
    $sections_curves = true;
  }
  if (isset($_GET["sections_honours"])) {
    array_push($search_sections, "/v:Honours/");
    $sections_honours = true;
  }
  if (isset($_GET["sections_societies"])) {
    array_push($search_sections, "/v:Societies/");
    $sections_societies = true;
  }
  $search_sections_query = "";
  if (sizeof($search_sections) > 0) {
    $search_sections_query = "+[" . implode($search_sections, " ") . "]";
  }

?>
<div class="row">
  <div class="col-md-3">
    <h4>Filter</h4>

    <form action="?" method="GET">

      <!-- have the search box again -->
      <h6>Search Query</h6>
      <input required name="query" type="text" accesskey="q" placeholder="Search" value="<?php echo $query_string; ?>" />

      <!-- allow choosing of what sections of the site to search -->
      <h6>Site Sections</h6>
      <fieldset>
        <label><input type="checkbox" name="section_biographies" <?php if (isset($section_biographies)) echo "checked"; ?> /> Biographies</label>
        <br/>
        <label><input type="checkbox" name="sections_histtopics" <?php if (isset($sections_histtopics)) echo "checked"; ?> /> History Topics</label>
        <br/>
        <label><input type="checkbox" name="sections_curves" <?php if (isset($sections_curves)) echo "checked"; ?> /> Famous Curves</label>
        <br/>
        <label><input type="checkbox" name="sections_honours" <?php if (isset($sections_honours)) echo "checked"; ?> /> Honours</label>
        <br/>
        <label><input type="checkbox" name="sections_societies" <?php if (isset($sections_societies)) echo "checked"; ?> /> Societies</label>
      </fieldset>

      <!-- search button -->
      <button type="submit">Search</button>

    </form>

  </div>
  <div class="col-md-9">
    <h4>Results</h4>

    <?php
      // get where to begin displaying the results at
      if (isset($_GET["start_rank"])) {
        $startRank = $_GET["start_rank"];
      }

      // generate the query part
      $query = urlencode($_GET["query"] . " " . $search_sections_query);

      // build the basic query
      $query = 'query=' . $query . '&num_ranks=' . $resultsPerPage . '&btnG=Search&collection=' . $collection . '&profile=' . $profile . '&form=' . $form;

      // add on where to begin displaying the results at
      if (isset($_GET["start_rank"]) && $_GET["start_rank"] != "") {
        $query .= "&start_rank=" . $_GET["start_rank"];
      }

      // generate full query string
      $queryString = $baseUrl.$query;

      // get the results
      $content = file_get_contents($queryString, false, stream_context_create($stream_opts));

      // replace search.html with empty
      $content = str_replace("search.html","",$content);

      // and echo it out
      echo $content;
    ?>
  </div>
<?php
}
?>
</div>

{% endblock %}
