// JavaScript Document
setTimeout(waitForPageLoad, 1000);

function waitForPageLoad() {
	$( document ).ready(function() {
		
	// Create global arrays for dealing with data
	var eraInventory 			= []; // Gives us all era information
	var eraHeadlineInventory	= []; // Gives us all era headline information
	var eventInventory 			= []; // Gives us event info on the timeline
	var groupInventory 			= []; // Gives us all of the groups in the timeline
	var filterArrGroups 		= []; // Tells us what the user wants to filter by for groups
	var filterArrEras 			= []; // Tells us what the user wants to filter by for eras

	// On screen text
	// Update text phrases here
	var filterModalLaunchText 	= 'Filter Timeline';
	var filterModalHeadlineText = 'Filter Timeline'; // Use to popualte the headline in the modal, if one exists
	var filterModalApplyText	= 'Apply';
	var filterModalResetText 	= 'Reset';
	var filterModalCancelText 	= 'Close';
	
	// Utility variables for creating the proper identifiers and positioning
	var timemarker 				= 'timemarker';
	var slidemarker				= 'slide'; // Can be used for adding attribtues to slides
		
	// Help handle positioning the filter container
	// Placement of the modal is dependent on several factors, one of which is window fluidity
	var timelineEmbedHeight;		// Used for calculating filter position #timeline-embed
	var timenavHeight;				// Used for calculating filter position .tl-timenav
		
	var filterModalContainer; 		// Defined in placeModalStructure()
	var filterButtonHeight;
	var filterPosition;
	var filterModalHeight;
	var filterModalPadding;			// Used to calculate position, also tuck filter under timeline
	var filterModalState = false;
	var timelineConfig;
	
	
	// Get the data from the JSON file
	$.ajax({
		url: 'js/timeline.json',
		dataType: 'json',
		type: 'get',
		cache: 'false',
		success: initializePage,
	});
	
	function initializePage(response) {
		placeFilterButton();
		parseJSON(response);
		
		// Now that we have our objects populated, get the size of each
		var eventCount 	= eventInventory.length;
		var groupCount 	= groupInventory.length;
		var eraCount 	= eraInventory.length;
		
		setDataAttribute(timemarker,eventCount,eraCount); 	// Set attributes for timeline markers
		// setDataAttribute(slidemarker,eventCount,eraCount); 	// Set attributes for slide markers
		
		placeModalStructure(groupCount,eraCount);
		populateModal(groupCount,eraCount);
		modalControlEvents();
		getFilterOptions();
		maintainModalPosition();
	}
	

	// Look through the JSON and build workable objects and arrays
	function parseJSON(response) {
			var result;
			result = response;
			
			// GATHER AND FORMAT DATA / PAGE ELEMENTS
			// Loop through the data for Eras
			$(result.eras).each(function(index, value) {

				// Make an array specific to this loop
				var eraArr = [];

				// Populate the local array
				eraArr.headline = value.text.headline;

				// Grab date values as variables
				var era_start_year = value.start_date.year; // Only start_date YEAR is required
				var era_start_month = value.start_date.month;
				if (era_start_month === undefined) {
					era_start_month = 0;
				}
				var era_start_day = value.start_date.day;
				if (era_start_day === undefined) {
					era_start_day = 0;
				}
				var era_start_hour = value.start_date.hour;
				if (era_start_hour === undefined) {
					era_start_hour = 0;
				}
				var era_start_minute = value.start_date.minute;
				if (era_start_minute === undefined) {
					era_start_minute = 0;
				}
				var era_start_second = value.start_date.second;
				if (era_start_second === undefined) {
					era_start_second = 0;
				}
				var era_start_millisec = value.start_date.millisecond;
				if (era_start_millisec === undefined) {
					era_start_millisec = 0;
				}

				var era_end_year = value.end_date.year;  // Only end_date YEAR is required
				var era_end_month = value.end_date.month;
				if (era_end_month === undefined) {
					era_end_month = 0;
				}
				var era_end_day = value.end_date.day;
				if (era_end_day === undefined) {
					era_end_day = 0;
				}
				var era_end_hour = value.end_date.hour;
				if (era_end_hour === undefined) {
					era_end_hour = 0;
				}
				var era_end_minute = value.end_date.minute;
				if (era_end_minute === undefined) {
					era_end_minute = 0;
				}
				var era_end_second = value.end_date.second;
				if (era_end_second === undefined) {
					era_end_second = 0;
				}
				var era_end_millisec = value.end_date.millisecond;
				if (era_end_millisec === undefined) {
					era_end_millisec = 0;
				}

				// Start Date - Convert to Julian
				Date.prototype.getJulian = function() {
					return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
				}
				var formattedStartDate = new Date(era_start_year, era_start_month, era_start_day,  era_start_hour, era_start_minute, era_start_second, era_start_millisec); 

				var julianStartDate = formattedStartDate.getJulian(); //get Julian counterpart

				eraArr.start_date_julian = julianStartDate;

				// End Date - Convert to Julian
				var formattedEndDate = new Date(era_end_year, era_end_month, era_end_day,  era_end_hour, era_end_minute, era_end_second, era_end_millisec);

				var julianEndDate = formattedEndDate.getJulian();
				eraArr.end_date_julian = julianEndDate;

				// Push to a master associative multidimensional array
				eraInventory.push(eraArr);
				eraInventory.sort();
				
				eraHeadlineInventory.push(value.text.headline);
				eraHeadlineInventory.sort();

			}); // End ERA Array Build

			// Loop through the data for Events
			$(result.events).each(function(index, value) {

				// For the filter, we need to format the headline to match
				// formatting created by timeline.js IDs
				// We will be matching ID values later on
				var thisHeadline = value.text.headline.toLowerCase().trim();
				// Remove commas
				thisHeadline = thisHeadline.replace(/,/g,"");
				// Remove periods
				thisHeadline = thisHeadline.replace(/\./g, "");
				// Remove apostrophes
				thisHeadline = thisHeadline.replace(/'/g, "");
				// Replace dollar sign with underscore
				thisHeadline = thisHeadline.replace(/\$/g, "_");
				// Replace spaces with dashes
				thisHeadline = thisHeadline.replace(/\s+/g, '-');
				// Replace slash with dash
				thisHeadline = thisHeadline.replace(/\//g,"-");

				// Make an array specific to this loop
				var eventArr = [];

				// Populate the local array
				eventArr.headline = thisHeadline;

				// Grab date values as variables
				var event_start_year = value.start_date.year; // Only start_date YEAR is required
				var event_start_month = value.start_date.month;
				if (event_start_month === undefined) {
					event_start_month = 0;
				}
				var event_start_day = value.start_date.day;
				if (event_start_day === undefined) {
					event_start_day = 0;
				}
				var event_start_hour = value.start_date.hour;
				if (event_start_hour === undefined) {
					event_start_hour = 0;
				}
				var event_start_minute = value.start_date.minute;
				if (event_start_minute === undefined) {
					event_start_minute = 0;
				}
				var event_start_second = value.start_date.second;
				if (event_start_second === undefined) {
					event_start_second = 0;
				}
				var event_start_millisec = value.start_date.millisecond;
				if (event_start_millisec === undefined) {
					event_start_millisec = 0;
				}

				// Start Date - Convert to Julian
				Date.prototype.getJulian = function() {
					return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
				}
				var formattedStartDate = new Date(event_start_year, event_start_month, event_start_day,  event_start_hour, event_start_minute, event_start_second, event_start_millisec); 

				var julianStartDate = formattedStartDate.getJulian(); //get Julian counterpart

				eventArr.start_date_julian = julianStartDate;


				// An event may not have an End date
				// See if there's an End Date node

				if (value.end_date) {
					var event_end_year = value.end_date.year;  // Only end_date YEAR is required
					var event_end_month = value.end_date.month;
					if (event_end_month == undefined) {
						event_end_month = 0;
					}
					var event_end_day = value.end_date.day;
					if (event_end_day == undefined) {
						event_end_day = 0;
					}
					var event_end_hour = value.end_date.hour;
					if (event_end_hour == undefined) {
						event_end_hour = 0;
					}
					var event_end_minute = value.end_date.minute;
					if (event_end_minute == undefined) {
						event_end_minute = 0;
					}
					var event_end_second = value.end_date.second;
					if (event_end_second == undefined) {
						event_end_second = 0;
					}
					var event_end_millisec = value.end_date.millisecond;
					if (event_end_millisec == undefined) {
						event_end_millisec = 0;
					}
					// End Date - Convert to Julian
					var formattedEndDate = new Date(event_end_year, event_end_month, event_end_day,  event_end_hour, event_end_minute, event_end_second, event_end_millisec);

					var julianEndDate = formattedEndDate.getJulian();
					eventArr.end_date_julian = julianEndDate;				
				} else {
					// Just set the end date as the start date
					eventArr.end_date_julian = julianStartDate;
				}

				eventArr.group = value.group;

				// Push to a master associative multidimensional array
				eventInventory.push(eventArr);

			}); // End EVENTS Array Build

			// Loop the EVENT data for GROUPS
			$(result.events).each(function(index, value) {
				// GROUPS are a subset of EVENTS
				// but we want an array of unique values
				// to build the filter

				// See if a group exists in the GROUP array
				// If it doesn't, push it into the array
				if (groupInventory.indexOf(value.group) === -1) {
					groupInventory.push(value.group);
					groupInventory.sort();
				}
			}); // End EVENT GROUP Array Build

			// Process Events Array for duplicate headings
			// Timeline.js appends duplicate headings with sequential numbers
			// We need to match timeline.js formatting for the filter
			for (var i = 0; i < eventInventory.length; i++) {

				var thisHeadline = eventInventory[i].headline;
				var k = 2;
				for (var j = i+1; j < eventInventory.length; j++) {

					if (thisHeadline === eventInventory[j].headline) {
						// Get the value of the matched headline
						var matchedHeadline = eventInventory[j].headline;
						// Append with number
						var newHeadline = matchedHeadline + '-' + k;
						// Overwrite the headline value at the matched index

						eventInventory[j].headline = newHeadline;

						k++;	
					} // end IF
				} // end FOR
			} // end FOR}
	}
	
	// Create and place the filter button
	function placeFilterButton() {
		// Create and place the filter container, with its button
		$('#timeline-embed').append('<div class="tlf-filterContainer closed"></div>');
		$('.tlf-filterContainer').append("<button class='tlf-filterControl' id='tlf-filterModalLabel'><span class='fas fa-filter tlf-filterIcon'></span><span class='tlf-filterButtonText' style='display: none;'>" + filterModalLaunchText + "</span></button>");
		
		// timeline-embed and tl-timenav have fixed heights that *should* not change on resize
		// However, tl-timenav might
		filterButtonHeight 		= $('.tlf-filterControl').outerHeight();
		timelineEmbedHeight 	= $('#timeline-embed').outerHeight();
		timenavHeight 			= $('.tl-timenav').outerHeight();
		
		// Get the 'top' value for the filterContainer by finding the 'top' (height) of the timeline
		// Then adjust for the height of the filter button
		filterPosition = timelineEmbedHeight - timenavHeight;
		filterPosition = filterPosition - filterButtonHeight;
		filterPosition = filterPosition + 1; // Make sure the button is tucked in
		
		// Determine if the timeline has been configured to show .tl-timenav on top of the slideshow or on the bottom of the slideshow
		if  ($('.tl-timenav').is(':first-child')) {
			// The timenav is on top of the slideshow. The filter button should sit below the timenav
			$('.tlf-filterContainer').addClass('tlf-configurationTop');
			timelineConfig = 'top';

			// Place the filter button, visually, on the bottom of the timeline
			$('.tlf-filterContainer').css('bottom',filterPosition);
			
		} else {
			// The timenav is on the bottom of the slideshow. The filter button should sit on top of the timenav
			$('.tlf-filterContainer').addClass('tlf-configurationBottom');
			timelineConfig = 'bottom';
			
			// Place the filter button, visually, on the top of the timeline
			$('.tlf-filterContainer').css('top',filterPosition);
		}
		
		filterButtonExpandCollapse();
	}
	// End placeFilterButton()

	// Create and place modal structure
	// Adjust the layout of the interior of the modal here based on the presence of groups, eras or both
	function placeModalStructure(groups,eras) {
			
			var filterModalLayout 	= '';
			var filterModalButtons 	= '';
			
		
			// Create the modal container
			filterModalContainer = "<div class='tlf-filterModalContainer' role='dialog' aria-labelledby='tlf-filterModalLabel'></div>";
			filterModalPadding = timenavHeight  / 2;
		
			// Insert the modal container into the UI
			if (timelineConfig === 'bottom') {
					// The timeline is on the bottom
					$('.tlf-filterContainer').append(filterModalContainer);
					$('.tlf-filterModalContainer').css('padding-bottom',filterModalPadding);
				} else if (timelineConfig === 'top') {
					// The timeline is on the top
					$('.tlf-filterContainer').prepend(filterModalContainer);
					$('.tlf-filterModalContainer').css('padding-top',filterModalPadding);
				}
			// Repurpose the modal container var
			filterModalContainer = $('.tlf-filterModalContainer');	
		
			// Create the modal interior
			filterModalLayout += "<div class='tlf-filterModalBody'></div>";
			filterModalLayout += "<div class='tlf-filterModalFooter'></div>";
			// Create the modal buttons
			filterModalButtons += "<button class='tlf-filterApply tlf-modalButton tlf-modalButtonAction'>" + filterModalApplyText + "</button>";
			filterModalButtons += "<button class='tlf-filterReset tlf-modalButton tlf-modalButtonNuetral'>" + filterModalResetText + "</button>";
			filterModalButtons += "<button class='tlf-filterCancel tlf-modalButton tlf-modalButtonNuetral'>" + filterModalCancelText + "</button>";
			
			// Insert the modal body and footer into the parent container
			$(filterModalContainer ).append(filterModalLayout);
			$('.tlf-filterModalFooter').append(filterModalButtons);
			
			var oneColumnLayout = '';
			var twoColumnLayout = '';
			// Determine column layout
			if ((groups > 0) && (eras > 0)) {
				// Create two columns
				twoColumnLayout = "<div class='tlf-column tlf-column-one tlf-groupColumn'>";
				twoColumnLayout += "<h3 class='tlf-colunHeadline'>Groups</h3>";
				twoColumnLayout += "</div>";
				twoColumnLayout += "<div class='tlf-column tlf-column-two tlf-eraColumn'>";
				twoColumnLayout += "<h3 class='tlf-colunHeadline'>Eras</h3>";
				twoColumnLayout += "</div>";
				$('.tlf-filterModalBody').append(twoColumnLayout);
			} else if ((groups > 0) && (eras === 0)) {
				// Create one column for Groups
				oneColumnLayout = "<div class='tlf-column tlf-groupColumn'>";
				oneColumnLayout += "<h2 class='tlf-colunHeadline'>Groups</h2>";
				oneColumnLayout += "</div>";
				$('.tlf-filterModalBody').append(oneColumnLayout);
			} else if ((groups === 0) && (eras > 0)) {
				// Create one column for Eras
				oneColumnLayout = "<div class='tlf-column tlf-eraColumn'>";
				oneColumnLayout += "<h2 class='tlf-colunHeadline'>Eras</h2>";
				oneColumnLayout += "</div>";
				$('.tlf-filterModalBody').append(oneColumnLayout);
			} else {
				// We should never see this message, but just in case...
				$('.tlf-filterModalBody').text('At least one group or one era must be defined');
			}
		}
	// End placeModalStructure()
	
	// Apply data attributes to timeline markers
	// using their headline, group and era values from JSON
	function setDataAttribute(a,b,c) {	
		a = '.tl-' + a; // Timeline.js classes have a tl- prefix

		// For every class .tl-timemarker or .tl-slidemarker found in the UI, get its information
		$(a).each(function() {
				
			var elID = $(this).attr('id');
			// Loop against groupCount
			for (var i = 0; b > i; i++) {
				
				var eventHeadline 	= eventInventory[i].headline;
				var eventGroup 		= eventInventory[i].group;
				var eventStartDate 	= eventInventory[i].start_date_julian;
				// var eventEndDate 	= eventInventory[i].end_date_julian;
				
				
				if (a === '.tl-timemarker'){
					eventHeadline = eventHeadline + '-marker';
				} // See if we're dealing with a slide or a timeline marker
				
				if (elID === eventHeadline) {
					$('#' + elID).attr('data-group', eventGroup);
					$('#' + elID).attr('data-filter','true'); // Set default filter flag, everything is visible
					
					// See if we actually have Era data
					if (c > 0) {
						// Loop against eraCount
						for (var j = 0; c > j; j++) {
						// Loop through eras
						// Get the headline, start date and end date
						var eraHeadline 	= eraInventory[j].headline;
						var eraStartDate 	= eraInventory[j].start_date_julian;
						var eraEndDate 		= eraInventory[j].end_date_julian;

						// Compare Julian dates to see if the event takes place in a specific era
						// Add data attribute if so
						if ((eventStartDate >= eraStartDate) && (eventStartDate <= eraEndDate)) {
							// The event takes place in this era
							$('#' + elID).attr('data-era', eraHeadline);
						}
					} // End Era check
					}

				}
				
					// Get ERA parameters
			} // end FOR
		}); 
	}
	// End setDataAttribute()
	
	// Populate modal with filter options, checkboxes
	function populateModal(d,e) {
	
		// Build Group list, if groupCount > 0
		if (d > 0) {
			var elGroupItem = '';
			var elGroupItemCollection = '';
			var thisGroup = '';
			var thisGroupID = '';

			for (var i = 0; d > i; i++) {
				thisGroup = groupInventory[i];

				// Create a unique ID for each checkbox
				thisGroupID = thisGroup.toLowerCase().replace(/\s+/g, '-');

				// Build the list item with checkbox and label text
				elGroupItem = '<li class="tlf-listItem tlf-groupItem">' +
					'<label for="'+ thisGroupID +'-filter-control">'+
					'<input type="checkbox" id="'+ thisGroupID +'-filter-control" data-type="group" data-name="'+ thisGroup +'"> '+
					''+ thisGroup +''+
					'</label>';
				elGroupItem += '</li>';
				elGroupItemCollection += elGroupItem;
			}
			// Place list items in <ul>
			var elGroupList = '<ul class="tlf-list tlf-groupCheckList">' + elGroupItemCollection + '</ul>';

			// Append to column? Does this need to move elsewhere?
			$('.tlf-column.tlf-groupColumn').append(elGroupList);

		}
		
		// Build Era list, if eraCount > 0
		if (e > 0) {
			var elEraItem = '';
			var elEraItemCollection = '';
			var thisEra = '';
			var thisEraID = '';

			// console.log(eraHeadlineInventory);
			for (var j = 0; e > j; j++) {
				
				thisEra = eraHeadlineInventory[j];
				
				// Create a unique ID for each checkbox
				thisEraID = thisEra.toLowerCase().replace(/\s+/g, '-');					

				// Build the liste item with checkbox and label text
					elEraItem = '<li class="tlf-listItem tlf-eraItem">';
					elEraItem += '<label for="'+ thisEraID +'-filter-control">';
					elEraItem += '<input type="checkbox" id="'+ thisEraID +'-filter-control" data-type="era" data-name="'+ thisEra +'"> '+ thisEra + '</label>';
					elEraItem += '</li>';
				elEraItemCollection += elEraItem; 
			}
			// Place list items in <ul>
			var elEraList = '<ul class="tlf-list tlf-eraCheckList">' + elEraItemCollection + '</ul>';

			// Append to column
			$('.tlf-column.tlf-eraColumn').append(elEraList);
		}
		// Now that the modal is populated, store its computed height
		filterModalHeight = $('.tlf-filterModalContainer').outerHeight();	
	}
	//End populateModal()
	
	// Animates the filter button on hover/click to expand to the right
	function filterButtonExpandCollapse() {
		var expandedButtonWidth;
		var textWidth;
		var filterButtonPadding = $('.tlf-filterControl').css('padding-left');
		var filterButtonIconWidth = $('.tlf-filterIcon').css('font-size');
		
		filterButtonPadding = parseInt(filterButtonPadding, 10);
		filterButtonPadding = filterButtonPadding * 2;
		
		filterButtonIconWidth = parseInt(filterButtonIconWidth, 10);
		var filterCollapsedButtonWidth = filterButtonIconWidth + filterButtonPadding;
		
		$('.tlf-filterControl').css('width',filterCollapsedButtonWidth);
		
		
		$('.tlf-filterControl').on('mouseenter focus', function() {
			// Expand filter timeline button
			$('.tlf-filterButtonText').css('display','inline');

			textWidth = $('.tlf-filterButtonText').outerWidth();
			expandedButtonWidth = filterButtonPadding + textWidth + filterButtonIconWidth + 10;
			
			$('.tlf-filterControl').css('width',expandedButtonWidth);
			
		});
		

		$('.tlf-filterControl').on('mouseleave focusout', function() {
			// If the filter is closed, collapse the button on mouse out/loss of focus
			if (!(filterModalState)) {
				// collapse filter timeline button
				$('.tlf-filterControl').css('width',filterCollapsedButtonWidth);
				$('.tlf-filterButtonText').css('display','none');
			}
		});
	}
	// End filterButtonExpandCollapse()
			
	// Capture events that should trigger the modal
	// modalAnimate() will toggle the visibility of the modal
	// Reset filters button is handled in getFilterOptions()
	function modalControlEvents() {
		// Animate modal open or closed when filter button is clicked
		$('.tlf-filterControl').on('click keypress', function(event){
			if(a11yClick(event) === true) {
				modalAnimate();
				
			}
		});
		// Trigger modal when Cancel button is clicked
		$('.tlf-filterCancel').on('click keypress', function(event){
			if(a11yClick(event) === true) {
				// Just close the modal
				// Do not change the state of the filters
				modalAnimate();
				filterButtonExpandCollapse();
			}
		});
		// Hide modal on ESC key up
		$(document).on('keyup',function(evt) {
			if (evt.keyCode === 27) {
				// Just close the modal
				// Do not change the state of the filters
				modalAnimate();
				filterButtonExpandCollapse();

			}
		});
		// Apply filters and toggle modal
		$('.tlf-filterApply').on('click keypress', function(event){
			if(a11yClick(event) === true) {
				modalAnimate();
				applyFilter();
				filterButtonExpandCollapse();
			}
		});
		
		
		
	}
	// End modalControlEvents()
		
	function modalAnimate() {
		// Silde the filter up or down to open/close it
		var filterContainer = $('.tlf-filterContainer');
		filterContainer.toggleClass('open closed');
		var x = filterModalPadding / 1.3; // We just want a number, based on the top/bottom padding value
		
		
		if (filterContainer.hasClass('closed')) { 
			// The filter has been closed
			filterModalState = false;
			
			// Close the filter
			if (timelineConfig === 'bottom') { 
				// The filter container needs to slide down
				// position uses 'top'
				filterPosition = filterPosition + filterModalHeight;
				filterPosition = filterPosition - x;
				$(filterContainer).css('top',filterPosition);
				
			} else if (timelineConfig === 'top') {
				// The filter container needs to slide up
				// position uses 'bottom'
				filterPosition = filterPosition + filterModalHeight;
				filterPosition = filterPosition - x;
				$(filterContainer).css('bottom',filterPosition);
				
			}
		
		} else if (filterContainer.hasClass('open')) {
			// The filter container has been opened
			filterModalState = true;
			
			// Open the container
			if (timelineConfig === 'bottom') {
				// The filter container needs to slide up
				filterPosition = filterPosition - filterModalHeight;
				filterPosition = filterPosition + x; // Tuck the modal under the timeline so it doesn't appear to bounce
				$(filterContainer).css('top',filterPosition);
			
			} else if (timelineConfig === 'top') {
				// The filter container needs to slide down
				filterPosition = filterPosition - filterModalHeight;
				filterPosition = filterPosition + x; // Tuck the modal under the timeline so it doesn't appear to bounce
				$(filterContainer).css('bottom',filterPosition);
			}
		}


	}
	// End modalAnimate()
	
	function maintainModalPosition(){
		// timeline.js will have a bug that resizes the timenav in some manner on window resize
		// either the tl-timenav will increase in size or .tl-timegroup will change
		// adjust the placement of the filter when this happens
				
		$(window).resize(function() {
			var newTimenavHeight = $('.tl-timenav').outerHeight();
			var diff = newTimenavHeight - timenavHeight;
			timenavHeight = newTimenavHeight;

			if (timelineConfig === 'top') {
				filterPosition = filterPosition - diff;
				$('.tlf-filterContainer').css('bottom',filterPosition);
			} else if (timelineConfig === 'bottom') {
				filterPosition = filterPosition - diff;
				$('.tlf-filterContainer').css('top',filterPosition);
			}
			
		});

	}
	// End maintainModalPosition()
		
	// Handle selection of filter options
	function getFilterOptions() {
	// Listen for change in checklist
	// On check, add to array
	// On uncheck, remove from array
		var selectedFilter;
		var selectedType;
		
		$('.tlf-filterModalContainer input[type="checkbox"]').change(function() {
			if ($(this).is(':checked')) {
				// Get the data-name of what was checked
				// Push the data-name to the filter array
				selectedFilter = $(this).attr('data-name');
				selectedType = $(this).attr('data-type');
				if (selectedType === 'group') {
					filterArrGroups.push(selectedFilter);
				} else if (selectedType === 'era') {
					filterArrEras.push(selectedFilter);
				}

			} else if (!$(this).is(':checked')) {
				// Get the data-name of what was unchecked
				// Find that name in the filter array
				// Remove it from the array
				selectedFilter = $(this).attr('data-name');
				selectedType = $(this).attr('data-type');
				if (selectedType === 'group') {
					filterArrGroups.splice( $.inArray(selectedFilter, filterArrGroups), 1 );
				} else if (selectedType === 'era') {
					filterArrEras.splice( $.inArray(selectedFilter, filterArrEras), 1 );
				}

			}

		});
		// Reset control unchecks all options and removes them from the array
		$('.tlf-filterReset').on('click keypress', function(event){
			if(a11yClick(event) === true) {
				// Uncheck all checkboxes
				$('.tlf-filterModalContainer input[type="checkbox"]').prop('checked',false);
				// Empty filter arrays
				filterArrGroups.length = 0;
				filterArrEras.length = 0;
			}
		});	
	}
	// End getFilterOptions()
		
	// Handle the application of the filter options
	function applyFilter() {
		
		var filterCountGroups 	= filterArrGroups.length;
		var filterCountEras 	= filterArrEras.length;
		
		if (filterCountGroups > 0 && filterCountEras > 0) {
			// Both group and era filters are set
			// We only want to see markers that have these qualities
			$('.tl-timemarker').each(function() {
				var attrGroup = $(this).attr('data-group');
				var attrEra = $(this).attr('data-era');
					// See if both attributes exist for the marker
					if (filterArrGroups.includes(attrGroup) && filterArrEras.includes(attrEra) ) {
						$(this).attr('data-filter','true').css('display','block');
					} else {
						$(this).attr('data-filter','false').css('display','none');
					}
				});
			} else if (filterCountGroups > 0 && filterCountEras === 0) {
				// Only group filters are set
				findSingleMarker(filterArrGroups,filterCountGroups,'group');
			} else if (filterCountGroups === 0 && filterCountEras > 0) {
				// Only era filters are set
				findSingleMarker(filterArrEras,filterCountEras,'era');
			} else {
				// No filters are set
				// Everything should be visible on the timeline
				$('.tl-timemarker').each(function() {
					$(this).attr('data-filter','true').css('display','block');
				});
			}
			
			function findSingleMarker(array,count,type) {
				var dataType = 'data-' + type;
				// Loop through markers first
				// for each marker, check the array
				$('.tl-timemarker').each(function() {
					var attr = $(this).attr(dataType);
					// Check the array of selected filters for the data- value there
					if ($.inArray(attr, array) !== -1) {
						// Show the timelinemarker
						$(this).attr('data-filter','true').css('display','block');
					} else {
						// Hide the timeline marker
						$(this).attr('data-filter','false').css('display','none');
					}
				});
			}

		} 
	// End applyFilter()
	
	// General utility
	// Handle click or keypress for filter button so that buttons are accessible
	function a11yClick(event) {
		if(event.type === 'click') {
			return true;
		} else if (event.type === 'keypress') {
			var code = event.charCode || event.keyCode;
			if ((code === 32) || (code === 13)) {
				return true;
			} 
		} else{
			return false;
		}
	} // End a11yClick()	
		
	
});
}

