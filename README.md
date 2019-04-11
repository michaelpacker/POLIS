POLIS Timeline files

Polis Center
Timeline.js Filter Extension

Necessary files:
/css/timeline_filter.css
/js/timeline_filter.js
jQuery: 
https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
FontAwesome: 
https://fontawesome.com/start

About the files here
All HTML, css and js files needed to display the test data and images are here as /css and /js

About GEN.PHP
This file is used to generate a JSON file of dummy data, which can be used for testing purposes. The JSON file will be called timeline_gen.json. gen.php relies on files in includes/ (header_gen.php and footer_gen.php). Either a local server will need to be running or the file should be on a web server to generate the JSON file.


About the extension
The Timeline.js Filter Extension is written as a companion to the Timeline.js product, as created 
by Knightslab from Northwestern University (http://timeline.knightlab.com/). 

The extension creates a filter that utilizes Group and Era methods of categorization, native to 
Timeline.js. The filter allows the user to limit the number of markers that appear on the timeline, for easier navigation. 
No additional data-entry work is required to enable the filter, other than to update the timeline data with group information for each event and era information for the entire timeline.

The filter requires source files, noted above, for functionality and display. Omitting any noted files will negatively impact the filter.

How it works
The extension will read the source data, which is a JSON file, to discover all of the 
groups, eras and events defined for the timeline, creating a relationship between each event 
and its associated group or era.

A JSON file is a text file, containing all of the information that the timeline displays: events with 
their dates, media and group information, as well as information about the eras.
Even though the visual layout that Timeline.js creates appears to make 
an association between events, groups and eras, no true relationship is made “behind the scenes” in the HTML. 

A relationship is key to being able to filter information on screen. When the 
timeline filter extension makes this relationship, it updates the HTML to identify which markers on the 
timeline belong to what groups or eras, or both.

Finally, the extension creates a ‘filter timeline’ control, which allows users to select which 
markers they wish to see based on which group or era the marker falls within.

When selecting a group, era or combination of both, the filter will hide all other markers on the timeline, allowing 
the user a clearer picture of events.


