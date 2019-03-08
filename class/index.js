var modules = {}, map;

function createMap() {
  return new modules.Map('mapDiv', {
    basemap: 'streets-navigation-vector',
    center: [-117.19, 34.055],
    zoom: 15
  });
}

function createAndAddHandlers() {
  map = createMap();
  // instantiate the Seat Geek Search class
  var sg = new modules.SeatGeekSearch({
    distance: '20mi',
    perPage: 10
  });

  // search Seat Geek for events when the map is clicked
  map.on('click', function(e) {
    // Seat Geek expects latitude, longitude
    var geographic = modules.webMercatorUtils.webMercatorToGeographic(e.mapPoint);
    // searchByLoc returns a deferred
    // once the deferred is resolved,
    // pass the results to a callback function
    var sgResults = sg.searchByLoc(geographic);
    sgResults.then(function(returnEvents) {
      console.log(returnEvents);
    }, function(err) {
      console.log('error: ', err);
    });
  });
}

function initialize() {
  require([
    'esri/config',
    'dojo/_base/array',
    'extras/SeatGeekSearch',
    'esri/map',
    'esri/geometry/webMercatorUtils',
    'dojo/domReady!'
  ], function(esriConfig, arrayUtils, SeatGeekSearch, Map, webMercatorUtils) {
    esriConfig.defaults.io.corsEnabledServers.push('http://api.seatgeek.com/2/events');
    modules.arrayUtils = arrayUtils;
    modules.SeatGeekSearch = SeatGeekSearch;
    modules.Map = Map;
    modules.webMercatorUtils = webMercatorUtils;
    createAndAddHandlers();
  });
}

initialize();
