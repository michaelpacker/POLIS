<?php

// See if there's a session. If not, start one
if(session_status() == PHP_SESSION_NONE) {
    session_start();
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>N420 - Knightslab Testing</title>
        <link type="text/css" rel="stylesheet" href="/N420/css/styles.css" />
         <link type="text/css" rel="stylesheet" href="/N420/css/timeline_filter.css" />
		
        <link title="timeline-styles" rel="stylesheet" href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js"></script>
    </head>
    <body>
        <header class="clearfix">
        	<div class="container">
				<h1>N420 Polis Center Timeline.js Extended</h1>
				<!-- <p>Generate a number of events over a 225 year period to display on the timeline. Between 5 and 100 events will display, with random dummy text and placeholder images.</p>
				<p>Some events will have an end date, with the event spanning multiple years.</p>
				<h2>Plugin methods for grouping</h2>
				<p>Eras are denoted by sections of color on the timeline. Each era has a "headline" entry in the data to define it.</p>
				<p>Groups are another method of giving some relationship to events on the timeline</p> -->

				<!-- <input type="number" id="defineEventNumber" name="defineEventNumber" /> -->
				<input class="reload" type="submit" value="GENERATE JSON AND RELOAD THE TIMELINE" onclick="window.location.reload()" />
            </div>

        </header>
        <div id="main" class="container">   
        
            