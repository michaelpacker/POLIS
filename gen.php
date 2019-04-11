<?php

include ('includes/header_gen.php');

?>





<?php


// For the loop - say 234. You'd need to find out what day, month, and year any given number out of 234 actually is. It'd need that value assigned to it.
// So - land on 42. 
// Get your calendar start year
// Loop until you get to 42. Stop.
// You'd need to know month values (number of days) and leap year info. So look that up (new function)

// For each day, see if an event happened
// -- get the current year
// -- if the year is in the 1800s, then see if an event already exists for the year
// ---- if not, roll the dice
// ---- if roll success create event, update flag for this day, this month, this year
// ------ would this need to be stored in an array? So then loop through the array and see if day, month, year are entered into the array
// ------ I guess storing the event itself into its proper array by creating the collection array would be what you want to check.
// -- if year is 1900s, see if an event already exists for the year
// ---- if not, roll the dice
// ---- if yes, roll the dice with lesser chance of success
// ---- if roll success, create event, update flag for this day, this month, this year
// -- if year is 2000s, see if an event already exists for the month
// ---- if not, roll the dice
// ---- if yes, roll the dice with lesser chance of success

// multiple events on the same day?


function writeText($x) {
   $loremArray = array("Lorem", "lorem", "ipsum", "Dolor", "sit", "Amet", "consectetur", 
    "Adipiscing", "elit", "Sed", "eiusmod", "Tempor", "incididunt", "ut", "Labore", 
    "et", "dolore", "magna", "Aliqua", "Ut", "enim", "ad", "Minim", "veniam", 
    "quis", "Nostrud", "exercitation", "Ullamco", "laboris", "nisi", "ut", "Aliquip", 
    "ex", "ea", "Commodo", "consequat", "Duis", "aute", "irure", "reprehenderit", 
    "voluptate", "Velit", "esse", "Cillum", "eu", "Fugiat", "fugiat", "nulla", "Pariatur", 
    "Excepteur", "sint", "Occaecat", "Cupidatat", "non", "Proident", "sunt", "culpa", 
    "qui", "Officia", "deserunt", "Mollit", "anim", "id", "est", "Laborum");   
    
    $thisSentence = '';
    $wordCount = 0;

   foreach ($loremArray as $value) {
        $thisWord = '';
        $numTest = rand(0,1);
        if ($numTest === 1) {
            $thisWord = $value." ";
            
            $thisSentence .= $thisWord;
            $wordCount++;
        }
        if ($wordCount === $x) {
            break;
        }
    }
    return $thisSentence;
}



function generateTimeline() {
	// Generate the minimum and maximum number of events
	$eventCount = rand(2999,3000);
	
	echo "<p>There are <b>", $eventCount, "</b> events on the timeline</p>";
	
	$minYear = 1800;
    $maxYear = date("Y");
	
	$era_start_date_records = array();
	$era_end_date_records = array();
	$era_text_records = array();
	$era_loop_array = array();
	
	$group_records = array();
	$background_records = array();
	$media_records = array();
	$start_date_records = array();
	$end_date_records = array();
	$text_records = array();
	$loop_array = array();
	$collection_array = array();
	$era_collection_array = array();
	// $json_response = array();
	
	// Create some very limited ERAs
	$eraCount = rand(2,10);
	for ($h = 0; $h < $eraCount; $h++) {
		
		// Define ERA start
		$eraStartYear = rand($minYear,$maxYear);
        $eraStartMonth = rand(1,12);
        if ($eraStartMonth === 2) {
            $eraStartDay = rand(1, 28);
        } elseif ($eraStartMonth === 9 || $eraStartMonth === 4 || $eraStartMonth === 6 || $eraStartMonth === 11) {
            $eraStartDay = rand(1,30);
        } else {
            $eraStartDay = rand(1,31);
        }
		
		// Create ERA start date array
		$era_start_date_records = array_merge($era_start_date_records, array("day"=>$eraStartDay,"month"=>$eraStartMonth,"year"=>$eraStartYear));
		
		
		// Define ERA end
		$eraEndRange = rand(4,40);
		$eraEndYear = $eraStartYear + $eraEndRange;
		
		$eraEndMonth = rand(1,12);
		if ($eraEndMonth === 2) {
				$endDay = rand(1, 28);
			} elseif ($eraEndMonth === 9 || $eraEndMonth === 4 || $eraEndMonth === 6 || $eraEndMonth === 11) {
				$eraEndDay = rand(1,30);
			} else {
				$eraEndDay = rand(1,31);
			} 
		
		// Create ERA end date array
		$era_end_date_records = array_merge($end_date_records, array("day"=>$eraEndDay,"month"=>$eraEndMonth,"year"=>$eraEndYear));
		
		// Define ERA text (optional but recommended)
		$eraTextWordCount = rand(10,20);
		$eraText = writeText($eraTextWordCount);
		$eraText = "ERA Text: ".$eraText;
		$eraHeadline = "ERA " .$h. ": Headline for the era " .$h;
		
		// Create ERA text array
		$era_text_records = array_merge($era_text_records, array("headline"=>$eraHeadline,"text"=>$eraText));
		
		// Bundle the loop arrays up
		$era_loop_array = array_merge($era_loop_array, array("start_date"=>$era_start_date_records,"end_date"=>$era_end_date_records,"text"=>$era_text_records));
		
		// Push to our master array
		array_push($era_collection_array, $era_loop_array);

	}
	
	
	
	
	// Generate data for each event
	for ($i = 0; $i < $eventCount; $i++) {
		
		$group = '';
		$eventYear = 0;
		$endYear = 0;
		
		// Define GROUP
		$groupNumber = rand (1,7);
		
		if ($groupNumber != 7) {
			$group = "Group ".$groupNumber;
		}
		
		// Define background image
		$imgNum = rand(1,50);
		// $backgroundURL = "img/test_image_" .$imgNum .".jpg";
		$backgroundURL = '';
		$backgroundColor = '';
		
		// Create background
		$background_records = array_merge($background_records, array("url"=>$backgroundURL,"color"=>$backgroundColor));
			
		// Define media image
		$imgNum = rand(1,50);
		$mediaURL = "img/test_image_" .$imgNum .".jpg";
		// $mediaURL = $backgroundURL;
		$mediaThumb = $mediaURL;
		
		// Define media caption and media credit
		$captionWordCount = rand(10,20);
		$mediaCaption = writeText($captionWordCount);
		$mediaCaption = "CAPTION: ".$mediaCaption;
		$creditWordCount = rand(3,6);
		$mediaCredit = writeText($creditWordCount);
		$mediaCredit = "CREDIT: ".$mediaCredit;
		
		// Create media array
		$media_records = array_merge($media_records, array("url"=>$mediaURL,"thumbnail"=>$mediaThumb,"caption"=>$mediaCaption,"credit"=>$mediaCredit));
		// echo "MEDIA RECORDS<br>";
		// print_r(array_values($media_records));
		// echo "<br><br>";
		
		// Define Start Date
		$eventRand = rand($minYear,$maxYear);
		$eventYear = $eventRand;
        $eventMonth = rand(1,12);
        if ($eventMonth === 2) {
            $eventDate = rand(1, 28);
        } elseif ($eventMonth === 9 || $eventMonth === 4 || $eventMonth === 6 || $eventMonth === 11) {
            $eventDate = rand(1,30);
        } else {
            $eventDate = rand(1,31);
        }
		
		
		
		// Create Start Date Array
		$start_date_records = array_merge($start_date_records, array("day"=>$eventDate,"month"=>$eventMonth,"year"=>$eventYear));
		
		
		// Define End Date, if there is one that needs to be defined
		$endDateFlag = 0;
		
		// Define Text
		$headlineWordCount = rand(1,10);
		$textHeadline = writeText($headlineWordCount);
		$textHeadline = $eraText = $textHeadline;
		$textWordCount = rand(200,500);
		$textText = writeText($textWordCount);
		$textText = $textText;
		
		// Create Text Array
		$text_records = array_merge($text_records, array("headline"=>$textHeadline,"text"=>$textText));
		

		// Collect everything in the loop into its own array for structure
		// See if there's any conditional information
		/* if ($endDateFlag === 1) {
			$loop_array = array_merge($loop_array, array("media"=>$media_records,"start_date"=>$start_date_records,"end_date"=>$end_date_records,"text"=>$text_records));
		} else {
			$loop_array = array_merge($loop_array, array("media"=>$media_records,"start_date"=>$start_date_records,"text"=>$text_records));
		} */
		
		$loop_array = array_merge($loop_array, array("background"=>$background_records,"media"=>$media_records,"start_date"=>$start_date_records,"text"=>$text_records));
		// $loop_array = array_merge($loop_array, array("media"=>$media_records,"start_date"=>$start_date_records,"text"=>$text_records));
		
	
		if (!empty($group)) {
			$loop_array = array_merge($loop_array, array("group"=>$group));
		}
			
		// echo "LOOP ARRAY<br>";
		// print_r(array_values($loop_array));
		// echo "<br><br>";
	
        array_push($collection_array, $loop_array);
	
	} // END LOOP

	// echo "<b>COLLECTION OUTSIDE THE LOOP</b><br>";
	// print_r(array_values($collection_array));
	
	// Here's where we'd need to collect ERA and TITLE information
	
	
	$json_builder = array();
	$json_builder = array_merge($json_builder, array("events"=>$collection_array,"eras"=>$era_collection_array));

	// echo "<br><br><b>JSON RESPONSE</b><br>";
    $response = $json_builder;
    // echo json_encode($response);
	
	$fp = fopen('timeline_gen.json', 'w+');
    // Write the array to the JSON file, as JSON

    fwrite($fp, json_encode($response)); // Maybe put this up above and into a variable?

    // Close the file
    fclose($fp);
}

generateTimeline();

?>




<div id='timeline-embed' style="width: 100%; height: 600px"></div>





<?php
// clean up resultsets when we're done with them!
// $query->close();

// close the connection.
// $conn->close();

include ('includes/footer_gen.php');
