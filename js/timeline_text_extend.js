// JavaScript Document
// Mike Packer April, 2019
// N420 SOIC
// Pull additional text nodes from timeline json data
// Insert them into the view when each related slide is loaded
setTimeout(waitForPageLoad, 1000);


function waitForPageLoad() {
	$(document).ready(function() {
		var eventTextInventory = []; // event slide text
		var titleTextInventory = []; // title slide text
		var eventCount = 0;
		var titleSlideCount = 0;			// title slide count
		
		// Global containers
		var extendedTextContent  = '';
		var extendedTextContentA = '';
		var extendedTextContentB = '';

		var moreString = 'More'; // Sets the text of the moreInfo button
		
		// Get the data from the JSON file
		$.ajax({
			url: 'js/timeline.json',
			dataType: 'json',
			type: 'get',
			cache: 'false',
			success: initializeExtendedText,
		});
		
		function parseJSON(response) {
				var result;
				result = response;
				// Build data array of TITLE slide text objects
				// Not every slideshow will have a title slide
				if (result.hasOwnProperty('title')) {
					$(result.title).each(function(index, value) {
						var primaryheadline 	= value.text.headline.trim(); 				// Slide headline
						var primaryText			= value.text.text.trim();					// Slide text
						var secondaryHeadline 	= '';
						var secondaryText 		= '';
						var tertiaryHeadline	= '';
						var tertiaryText 		= '';

						if (value.text.secondary_headline) {
							secondaryHeadline 	= value.text.secondary_headline.trim();
						}
						if (value.text.secondary_text) {
							secondaryText		= value.text.secondary_text.trim();
						}
						if (value.text.tertiary_headline) {
							tertiaryHeadline 	= value.text.tertiary_headline.trim();
						}
						if (value.text.tertiary_text) {
							tertiaryText		= value.text.tertiary_text.trim();
						}

						var titleID = primaryheadline.toLowerCase();
						// Title slides should include only plain textn
						// Remove HTML or brackets and slashes
						// titleID = titleID.replace(/<(?:.|\n)*?>/gm, '');
						// titleID = titleID.replace(/</g,"");
						// titleID = titleID.replace(/>/g,"");
						titleID = titleID.replace(/\//g,"-");
						// Remove commas
						titleID = titleID.replace(/,/g,"");
						// Remove periods
						titleID = titleID.replace(/\./g, "");
						// Remove colons
						titleID = titleID.replace(/\:/g, "");
						// Remove semi-colons
						titleID = titleID.replace(/\;/g, "");
						// Remove apostrophes
						titleID = titleID.replace(/'/g, "");
						// Replace dollar sign with underscore
						titleID = titleID.replace(/\$/g, "_");
						// Replace spaces with dashes
						titleID = titleID.replace(/\s+/g, '-');
						// Replace slash with dash
						titleID = titleID.replace(/\//g,"-");

						// Make an array specific to this loop
						var titleArr = [];

						// Populate the local array
						// We're always going to try to have secondary and tertiary keys in our array
						titleArr.event_id			= titleID;
						titleArr.headline 			= primaryheadline;
						titleArr.text 				= primaryText;
						titleArr.secondary_headline = secondaryHeadline;
						titleArr.secondary_text 	= secondaryText;
						titleArr.tertiary_headline 	= tertiaryHeadline;
						titleArr.tertiary_text		= tertiaryText;

						titleTextInventory.push(titleArr);
					});
				} 
				
				// Build data arrays of EVENT slide text objects
				$(result.events).each(function(index, value) { 
					
					// Get the text attributes
					var primaryheadline 	= value.text.headline.trim(); 				// Slide headline
					var primaryText			= value.text.text.trim();					// Slide text
					var secondaryHeadline 	= '';
					var secondaryText 		= '';
					var tertiaryHeadline	= '';
					var tertiaryText 		= '';
					
					if (value.text.secondary_headline) {
						secondaryHeadline 	= value.text.secondary_headline.trim();
					}
					if (value.text.secondary_text) {
						secondaryText		= value.text.secondary_text.trim();
					}
					if (value.text.tertiary_headline) {
						tertiaryHeadline 	= value.text.tertiary_headline.trim();
					}
					if (value.text.tertiary_text) {
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
					// Replace slash with dash
					eventID = eventID.replace(/\//g,"-");
					
					// Make an array specific to this loop
					var eventArr = [];
					
					// Populate the local array
					// We're always going to try to have secondary and tertiary keys in our array
					eventArr.event_id			= eventID;
					eventArr.headline 			= primaryheadline;
					eventArr.text 				= primaryText;
					eventArr.secondary_headline = secondaryHeadline;
					eventArr.secondary_text 	= secondaryText;
					eventArr.tertiary_headline 	= tertiaryHeadline;
					eventArr.tertiary_text		= tertiaryText;
					
					eventTextInventory.push(eventArr);
					// console.log(eventTextInventory);
					
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
			return eventTextInventory;
		}
		
		function initializeExtendedText(response) {
			
			parseJSON(response);
			eventCount = eventTextInventory.length;
			titleSlideCount = titleTextInventory.length;
			createTextContainers();
			createMoreInfoButton();
			findActiveSlide(eventCount,titleSlideCount,1001);
			

		}
		
		function createTextContainers() {
			var timelineEmbedWidth = $('#timeline-embed').outerWidth();
			
			// If secondary text, build containers
			// If tertiary text, build containers
			// loop through inventory, see what slide is active
			// find that slides data
			// test for null values at nodes
			// if not null, build containers
			
			// Create containers that sit below the timeline
			var timelineContainer 			= $('#timeline-embed');
			var extendedTextContainer 		= $('<div id="tltxt-container" class="collapsed"></div>');
			extendedTextContent 			= $('<div id="tltxt-content"></div>');
			extendedTextContainer.insertAfter(timelineContainer);
			extendedTextContainer.prepend(extendedTextContent);
			
			extendedTextContentA 	= $('<div id="tltxt-secondaryText" class="tltxt-section"></div>');
			extendedTextContentB	= $('<div id="tltxt-tertiaryText" class="tltxt-section"></div>');
			
			extendedTextContent.prepend(extendedTextContentA);
			extendedTextContent.append(extendedTextContentB);
			
			extendedTextContentA.prepend("<h3 class='tltxt-headline'></h3>"); // H3 makes sense if this is secondary to the slide title/text
			extendedTextContentA.append("<div class='tltxt-body'></div>");
			extendedTextContentB.prepend("<h4 class='tltxt-headline'></h4>"); // H4 makes sense if this is subordiante section above
			extendedTextContentB.append("<div class='tltxt-body'></div>");
			
			// See if we have data to go into these containers elsewhere
			
			// Set the max width to about 80% of the width of the timeline container
			$('#tltxt-container').css({'width':'100%','max-width':timelineEmbedWidth});
			
			// Listen for window resize, recalculate width
			$( window ).resize(function() { 
				var newEmbedWidth = $('#timeline-embed').outerWidth();
				$('#tltxt-container').css({'width':'100%','max-width':newEmbedWidth});
				
			});

		}
		
		// Get the active slide now
		function findActiveSlide(count,titleSlideCount,time) { 
			// More toggle needs to be hidden by default and only shown if there's extended text
			if ($('.tltxt-moreControlContainer').is(':visible')) {
				$('.tltxt-moreControlContainer').css('display','none');
			}
			// Reduncant check, just to be sure
			if ($('#tltxt-container').hasClass('opened')) { 
				$('#tltxt-container').removeClass('opened');
				$('#tltxt-container').addClass('collapsed');
			}
			
			setTimeout(function(){
				// Find the timemarker which is set to 'active'. That's our current slide.
				var activeMarker = $('.tl-timemarker-active');
				var activeMarkerID = activeMarker.attr('id');
				
				// if no active marker is defined, then we must be on a TITLE slide
				if (activeMarkerID === undefined) {
					// We're on a title slide
					// See if there are any other title entries
					
					for (var h = 0; h < titleSlideCount; h++) {
						// Get secondary/tertiary text from the titleTextInventory object
						var secHedTitle = titleTextInventory[h].secondary_headline;
						var secTxtTitle = titleTextInventory[h].secondary_text;
						var terHedTitle = titleTextInventory[h].tertiary_headline;
						var terTxtTitle = titleTextInventory[h].tertiary_text; 
						
						var secHedTitleCount = secHedTitle.length;
						var secTxtTitleCount = secTxtTitle.length;
						var terHedTitleCount = terHedTitle.length;
						var terTxtTitleCount = terTxtTitle.length;
						
						if (secHedTitleCount > 0) {
							$('#tltxt-container').removeClass('collapsed');
							$('#tltxt-container').addClass('opened');
							populateText('secHed',secHedTitle);
						} 
						
						// We may have text without a headline
						if (secTxtTitleCount > 0) {
							$('#tltxt-container').removeClass('collapsed');
							$('#tltxt-container').addClass('opened');
							populateText('secTxt',secTxtTitle);
						}
						if (terHedTitleCount > 0) {
							$('#tltxt-container').removeClass('collapsed');
							$('#tltxt-container').addClass('opened');
							populateText('terHed',terHedTitle);
						} 
						
						if (terTxtTitleCount > 0) {
							$('#tltxt-container').removeClass('collapsed');
							$('#tltxt-container').addClass('opened');
							populateText('terTxt',terTxtTitle);
						}
						// Since we want to show all the text on the title slide, we won't include the "more" button yet
						// We pop the extended text container open by default
					}
					
				} else {
					// We're on an EVENT slide
					// Get secondary/tertiary text from the eventTextInventory object
					
					var activeMarkerTxt = activeMarker.find('.tl-headline').text();

					// Match the text of the H2 with the text of text.headline in the JSON file (our array)
					for (var i = 0; i < count; i++) {
						var slideTitle = eventTextInventory[i].headline;

						var secHed = eventTextInventory[i].secondary_headline;
						var secTxt = eventTextInventory[i].secondary_text;
						var terHed = eventTextInventory[i].tertiary_headline;
						var terTxt = eventTextInventory[i].tertiary_text; 

						var secHedCount = secHed.length;
						var secTxtCount = secTxt.length;
						var terHedCount = terHed.length;
						var terTxtCount = terTxt.length;

						// Find the node that matches the active slide headline
						// We could try to match marker ID to slide ID, by removing the suffix -marker
						// but we still need to find the right record in our JSON, 
						// and trying to match ID to slide Headline would require more work

						if (activeMarkerTxt === slideTitle) {
							// See if there's content in the secondary or tertiary nodes at this index
							// Any portion of text may exist without the other
							if (secHedCount > 0) {
								// populate the text
								populateText('secHed',secHed);
							} 
							if (secTxtCount > 0) {
								// populate the text
								populateText('secTxt',secTxt);
							}

							if (terHedCount > 0) {
								// populate the text
								populateText('terHed',terHed);
							} 

							if (terTxtCount > 0) {
								// place the new tertiary body structure
								populateText('terTxt',terTxt);
							} 
							
							// We know we have additional content, now place the "more" button
							if (secHedCount > 0 || secTxtCount > 0 || terHedCount > 0 || terTxtCount > 0) {
								$('.tltxt-moreControlContainer').css('display','block');
								$('.tltxt-moreControlContainer .tltxt-moreControl').fadeIn(400);
							} else if (secHedCount === 0 && secTxtCount === 0 && terHedCount === 0 && terTxtCount === 0) {
								$('.tltxt-moreControlContainer').fadeOut(400);
								$('.tltxt-moreControlContainer').css('display','none');
							}

						} // end title match
					} // end array loop
				}
				
			}, time);
		}
		
		// Handle populating text on button clicks
		// Listen for clicks, get the active slide info, adjust text accordingly
		$('.tl-timemarker').bind('keypress click', function(){
			processExtendedText();				
			findActiveSlide(eventCount,titleSlideCount,1001);

		});
		$('.tl-slidenav-next').bind('keypress click', function(){
			processExtendedText();
			findActiveSlide(eventCount,titleSlideCount,1001);
			
		});
		$('.tl-slidenav-previous').bind('keypress click', function(){
			processExtendedText();
			findActiveSlide(eventCount,titleSlideCount,1001);
			
		});
		
		function createMoreInfoButton() {
			var moreInfoControlContainer = $("<div class='tltxt-moreControlContainer' style='display: none;'></div>");
			var moreInfoControl = $("<button class='tltxt-moreControl' type='button'><span class='fas fa-ellipsis-v tltxt-toggleIcon'></span> " + moreString + "</button>");
			moreInfoControlContainer.prepend(moreInfoControl);
			
			var slideTextContainer = $('.tl-text-content');
			moreInfoControlContainer.insertAfter(slideTextContainer);
			
			$(document).on('click', '.tltxt-moreControl', function(){
				$('.tltxt-moreControl .tltxt-toggleIcon').toggleClass('rotateRight');
				$('#tltxt-container').toggleClass('opened collapsed');
			});
		}
		
		function processExtendedText() {
			if ($('#tltxt-container').hasClass('opened')) {
				// Assumes the More button is visible, but that's ok
				// Clear the contents of each extended text container before the next chunk of content populates it
				$('.tltxt-moreControl .tltxt-toggleIcon').toggleClass('rotateRight');
				// Gently fade out the text before removing it
				$('#tltxt-container .tltxt-headline').fadeOut(400);
				$('#tltxt-container .tltxt-body').fadeOut(400);
				$('.tltxt-moreControlContainer .tltxt-moreControl').fadeOut(400);
				$('.tltxt-moreControlContainer').css('display','none');
			}
			// Clear out the containers every time
			setTimeout(function(){
				$('#tltxt-container .tltxt-headline').empty();
				$('#tltxt-container .tltxt-body').empty();
				$('#tltxt-container').removeClass('opened');
				$('#tltxt-container').addClass('collapsed');
			}, 201);
		}
				
		function populateText(a,v) {
			
			switch (a) {
					
				case ('secHed'):
					// Secondary Headline
					// Place content in the appropriate container
					$('#tltxt-secondaryText .tltxt-headline').html(v).fadeIn(1001);
					break;
				case ('secTxt'):
					// Secondary Text
					$('#tltxt-secondaryText .tltxt-body').html(v).fadeIn(1001);
					break;
				case ('terHed'):
					// Tertiary Headline
					$('#tltxt-tertiaryText .tltxt-headline').html(v).fadeIn(1001);
					break;
				case ('terTxt'):
					// Tertiary Text
					$('#tltxt-tertiaryText .tltxt-body').html(v).fadeIn(1001);
					break;
				default:
					break;
					
			}
		}
	
	});
}


