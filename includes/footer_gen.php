        </div>
        <footer>
            <div class="container">
            	<p>Spring 2019</p>
            </div>
        </footer>
	<script type="text/javascript">
        // The TL.Timeline constructor takes at least two arguments:
        // the id of the Timeline container (no '#'), and
        // the URL to your JSON data file or Google spreadsheet.
        // the id must refer to an element "above" this code,
        // and the element must have CSS styling to give it width and height
        // optionally, a third argument with configuration options can be passed.
        // See below for more about options.
        timeline = new TL.Timeline('timeline-embed',
          'timeline_gen.json');
      </script>
      <!-- this must com after the timeline is rendered -->
       <script src="timeline_filter.js" type="text/javascript"></script>
    </body>
</html>
