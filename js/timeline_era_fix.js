// This was a quick attempt to set the color of dates on the time-axis 
// when they fall on top of a dark colored background
// There is a complexity here because it's difficult to know which ticks really do fall on a colored background
// In addition, ticks are added/removed when the zoom controls are used

setTimeout(waitForPageLoad, 1000);

	function waitForPageLoad() {
		$(document).ready(function() {

		var eraInventory = [];
		var eraCount = 0;

		$.ajax({
			url: 'js/timeline.json',
			dataType: 'json',
			type: 'get',
			cache: 'false',
			success: initializeEras,
		});

		function initializeEras(response) {
			parseJSONeras(response);
			eraCount = eraInventory.length;
			findTicks(eraCount);
		}

		function parseJSONeras(response) {
			var result;
			result = response;

			$(result.eras).each(function(index, value) { 
				// Local array
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



			});
		}

		// tl-timeaxis-major tl-timeaxis-tick-text
		function findTicks(x) {
			$('.tl-timeaxis-major .tl-timeaxis-tick-text').each(function() {

				// Maybe just do a check for each one, but also, need to listen for UI changes


				var tickSpan = $(this);
				var dateTxt = tickSpan.html();


				Date.prototype.getJulian = function() {
							return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
						}
				var formattedDate = new Date(dateTxt);
				// Convert to Julian
				var julTickDate = formattedDate.getJulian();

				// if this date falls within an era, check the background color
				for (var i = 0; i < x; i++) {

					var eraHeadline 	= eraInventory[i].headline;			
					var eraStartDate 	= eraInventory[i].start_date_julian;
					var eraEndDate 		= eraInventory[i].end_date_julian;

					// Compare dates to see if the tickmark falls within an era
					if ((julTickDate >= eraStartDate) && (julTickDate <= eraEndDate)) {
						var eraObj;
						// The tickdate falls within an era
						// We need to set the CSS for this tick text
						// but we need to know if the background color is light or dark

						// Get the era markup at this index using the title of the era
						// I don't think we can adequately trust ID matching, given the treatment of special characters by timeline.js

						eraObj = $(".tl-timeera").find("h2.tl-headline:contains('" + eraHeadline + "')").parents('.tl-timeera');
						// We've matched the proper headline to the current index, and then selected its top parent
						// Now we can find out if the background color is light or dark
						// Background is set here .tl-timeera > tl-timeera-background
						var eraColor = eraObj.find('.tl-timeera-background').css('background-color');
						eraObj = eraObj.attr('id');

						var brightness = lightOrDark(eraColor);

						// CSS is defined in iupui_timeline_skin.css
						// But css loads after JS?
						if(brightness == 'dark') {
							tickSpan.addClass('light-text');
							tickSpan.css('color','#FFF');
						} else {
							tickSpan.addClass('dark-text');
							tickSpan.css('color','#191919');
						}		
					}

				}// End for loop


			});

		}

		// Augmented script courtesy of Andreas Wik
		// https://awik.io/determine-color-bright-dark-using-javascript/
		var r, g, b, hsp;

		function lightOrDark(color) {

			// Check the format of the color, HEX or RGB?
			if (color.match(/^rgb/)) {
				// If HEX --> store the red, green, blue values in separate variables
				color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
				r = color[1];
				g = color[2];
				b = color[3];
			} else {

				// If RGB --> Convert it to HEX: http://gist.github.com/983661
				color = +("0x" + color.slice(1).replace( 
					color.length < 5 && /./g, '$&$&'
					)
				);

				r = color >> 16;
				g = color >> 8 & 255;
				b = color & 255;
			}

			// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
			hsp = Math.sqrt(
				0.299 * (r * r) +
				0.587 * (g * g) +
				0.114 * (b * b)
			);

			// Using the HSP value, determine whether the color is light or dark
			if (hsp>127.5) {

				return 'light';

			} else {
				return 'dark';
			}
		}// END lightOrDark()
		
		// Listen for clicks on the zoom controls
		$(".tl-menubar-button").click(function(){
    		findTicks(eraCount);
		});


	});
}