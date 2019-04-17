// JavaScript Document

// Pull additional text nodes from timeline json data
// Insert them into the view when each related slide is loaded
setTimeout(waitForPageLoad, 1000);


function waitForPageLoad() {
	$(document).ready(function() {
		
		var eventTextInventory = []; // Master array for matching active slides to data
		var eventCount = 0;
		
		
		findActiveSlide(1);

		var activeSlideID    = '';
		var activeSlideTitle = '';
		

		// Get the data from the JSON file
		$.ajax({
			url: 'js/timeline_motext.json',
			dataType: 'json',
			type: 'get',
			cache: 'false',
			success: initializeExtendedText,
		});
		
	
		
		
		// Listen for clicks, get the active slide info, adjust text accordingly
		$('.tl-timemarker').bind('keypress click', function(){
			// Wait for animation to stop
			findActiveSlide(1001);
			placeContent(eventCount,1001);
			
		});
		$('.tl-slidenav-next').bind('keypress click', function(){
			// Wait for animation to stop
			findActiveSlide(1001);
			placeContent(eventCount,1001);
			
			
		});
		$('.tl-slidenav-previous').bind('keypress click', function(){
			findActiveSlide(1001);
			placeContent(eventCount,1001);
			
		});
		
		function findActiveSlide(time) {
			// If needed, wait until the new slide loads, then get the information we want
			setTimeout(function(){ 
				var storySlider = $('.tl-storyslider')[0];
				var storySliderRect = storySlider.getBoundingClientRect();
				var slide = $('.tl-slide');
				
				for (var i = 0; i < slide.length; i++) {
					
					var thisSlide = slide[i];

					var slideRect = thisSlide.getBoundingClientRect();
					if (slideRect.left === storySliderRect.left) {
						// This slide is in the view. Proceed
						
						// Find the ID
						activeSlideID = thisSlide.id;
						// alert(activeSlideID + " This slide IS IN THE VIEW");

						// Get the headline of the slide, pop it into our global
						activeSlideTitle = thisSlide.getElementsByClassName('tl-headline')[0].textContent;
					
						// Clean it up, removing any trailing spaces, just in case
						activeSlideTitle = activeSlideTitle.trim();
		
					}
				}
				
				// Place content
				
				
			}, time);
		}		
		



		function initializeExtendedText(response) {
			parseJSON(response);
			// Now that we have our objects populated, get the size of each
			eventCount 	= eventTextInventory.length;
			
			createTextContainers();
			// Set the content for the first slide
			placeContent(eventCount,1);
			
		}

		function parseJSON(response) {
				var result;
				result = response;
			
				// Build data arrays of EVENT text objects
				$(result.events).each(function(index, value) { 
					
					// Get the text attributes
					var primaryheadline 	= value.text.headline.trim(); 				// Slide headline
					var primaryText			= value.text.text.trim();
					
					var secondaryHeadline 	= '';
					var secondaryText 		= '';
					var tertiaryHeadline	= '';
					var tertiaryText 		= '';
					
					if (value.text.secondary_headline) {
						secondaryHeadline 	= value.text.secondary_headline.trim();
						secondaryText		= value.text.secondary_text.trim();
					}							
					if (value.text.tertiary_headline) {
						tertiaryHeadline 	= value.text.tertiary_headline.trim();
						tertiaryText		= value.text.tertiary_text.trim();
					}	
					
					
					
					var eventID = primaryheadline.toLowerCase();
					// Remove commas
					eventID = eventID.replace(/,/g,"");
					// Remove periods
					eventID = eventID.replace(/\./g, "");
					// Remove apostrophes
					eventID = eventID.replace(/'/g, "");
					// Replace dollar sign with underscore
					eventID = eventID.replace(/\$/g, "_");
					// Replace spaces with dashes
					eventID = eventID.replace(/\s+/g, '-');
					
					// Make an array specific to this loop
					var eventArr = [];
					
					// Populate the local array
					eventArr.event_id			= eventID;
					eventArr.headline 			= primaryheadline;
					eventArr.text 				= primaryText;
					eventArr.secondary_headline = secondaryHeadline;
					eventArr.secondary_text 	= secondaryText;
					eventArr.tertiary_headline 	= tertiaryHeadline;
					eventArr.tertiary_text		= tertiaryText;
					
					eventTextInventory.push(eventArr);
					
				});
			
				// Process Events Array for duplicate headings
				// Timeline.js appends duplicate headings with sequential numbers
				// We need to match timeline.js formatting for ID
				for (var i = 0; i < eventTextInventory.length; i++) {

					var thisID = eventTextInventory[i].event_id;
					var k = 2;
					for (var j = i+1; j < eventTextInventory.length; j++) {

						if (thisID === eventTextInventory[j].event_id) {
							// Get the value of the matched id
							var matchedEventID = eventTextInventory[j].event_id;
							// Append with number
							var newEventID = matchedEventID + '-' + k;
							// Overwrite the headline value at the matched index

							eventTextInventory[j].event_id = newEventID;

							k++;	
						} // end IF
					} // end FOR
				} // end FOR
		}


		
		

		function createTextContainers() {
			var timelineEmbedWidth = $('#timeline-embed').outerWidth();

			// Create containers that sit below the timeline
			var timelineContainer 				= $('#timeline-embed');
			var extendedTextContainer 			= $('<div id="tltxt-container"></div>');
			var extendedTextContent 			= $('<div id="tltxt-content"></div>');
			
			// There needs to be a test which looks for this secondary/tertiary text and allows for the containers accordingly
			var extendedTextContentA 			= $('<div id="tltxt-secondaryText" class="tltxt-section"></div>');
			var extendedTextContentB			= $('<div id="tltxt-tertiaryText" class="tltxt-section"></div>');
			
			// See if we have data to go into these containers
			// HTML can be stored in the timline JSON but who knows for sure
			// We may need to test for the presence of tags, but until then, we'll write some
	
			extendedTextContainer.insertAfter(timelineContainer);
			extendedTextContainer.prepend(extendedTextContent);
				
			extendedTextContent.prepend(extendedTextContentA);
			extendedTextContentA.prepend("<h3 class='tltxt-headline'></h3>"); // H3 makes sense if this is secondary to the slide title/text
			extendedTextContentA.append("<p class='tltxt-body'></p>");
	
			extendedTextContent.append(extendedTextContentB);
			extendedTextContentB.prepend("<h4 class='tltxt-headline'></h4>"); // H4 makes sense if this is subordiante section above
			extendedTextContentB.append("<p class='tltxt-body'></p>");

			
			// Set the max width to about 80% of the width of the timeline container
			$('#tltxt-container').css({'width':'100%','max-width':timelineEmbedWidth});
			// Listen for window resize, recalculate
			$( window ).resize(function() { 
				var newEmbedWidth = $('#timeline-embed').outerWidth();
				$('#tltxt-container').css({'width':'100%','max-width':newEmbedWidth});
				
			});

		}


		function placeContent(a,time) {
			setTimeout(function(){ 
			//loop through the data array
				for (var k = 0; k < a; k++) {

				var thisEventID			 	= eventTextInventory[k].event_id;
				var thisSecondaryHeadline 	= eventTextInventory[k].secondary_headline;
				var thisSecondaryText 		= eventTextInventory[k].secondary_text;
				
				var thisTertiaryHeadline 	= eventTextInventory[k].tertiary_headline;
				var thisTertiaryText 		= eventTextInventory[k].tertiary_text;
				
				// convert headline to ID
				// if id matches the ID of the visible slide, then populate
				
				if ( thisEventID === activeSlideID) {
					if (!$('#tltxt-content #tltxt-secondaryText .tltxt-headline').text().trim().length) {
						$('#tltxt-content #tltxt-secondaryText .tltxt-headline').html(thisSecondaryHeadline).fadeIn(401);
						$('#tltxt-content #tltxt-secondaryText .tltxt-body').html(thisSecondaryText).fadeIn(401);
					} else {
						$('#tltxt-content #tltxt-secondaryText .tltxt-headline').fadeOut(400);
						$('#tltxt-content #tltxt-secondaryText .tltxt-body').fadeOut(400);
						$('#tltxt-content #tltxt-secondaryText .tltxt-headline').html(thisSecondaryHeadline).fadeIn(401);
						$('#tltxt-content #tltxt-secondaryText .tltxt-body').html(thisSecondaryText).fadeIn(401);
					}
					
					if (!$('#tltxt-content #tltxt-tertiaryText .tltxt-headline').text().trim().length) {
						$('#tltxt-content #tltxt-tertiaryText .tltxt-headline').html(thisTertiaryHeadline).fadeIn(401);
						$('#tltxt-content #tltxt-tertiaryText .tltxt-body').html(thisTertiaryText).fadeIn(401);
					} else {
						$('#tltxt-content #tltxt-tertiaryText .tltxt-headline').fadeOut(400);
						$('#tltxt-content #tltxt-tertiaryText .tltxt-body').fadeOut(400);
					
						$('#tltxt-content #tltxt-tertiaryText .tltxt-headline').html(thisTertiaryHeadline).fadeIn(401);
						$('#tltxt-content #tltxt-tertiaryText .tltxt-body').html(thisTertiaryText).fadeIn(401);
					}
				}
				// This JS was written by me, michael packer, on a saturday the fourteenth
				// of the year twenty nineteen. I'm totally to blame.
				
			}		
			}, time);
		}




	});
}
