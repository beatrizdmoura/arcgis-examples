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
  var widget = new modules.HomeButton({map: map}, 'homeButton');
  widget.startup();
}

function initialize() {
  require([
    'extras/HomeButton',
    'esri/map',
    'dojo/on'
  ], function(HomeButton, Map, on) {
    modules.HomeButton = HomeButton;
    modules.Map = Map;
    modules.on = on;
    createAndAddHandlers();
  });
}

initialize();
