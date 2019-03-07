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
  var search = new modules.Search({
    map: map
  }, modules.dom.byId('search'));
  var sources = search.get("sources");

  sources.push({
    featureLayer: new modules.FeatureLayer('http://sampleserver6.arcgisonline.com/arcgis/rest/services/PhoneIncidents/MapServer/0'),
    searchFields: ['pocname'],
    suggestionTemplate: '${pocname}: ${synopsis}',
    exactMatch: false,
    name: 'Redlands incidents',
    outFields: ['*'],
    placeholder: 'Search for incidents',
    maxResults: 4,
    maxSuggestions: 3,
    enableSuggestions: true,
    minCharacters: 2
  });

  //Set the sources above to the search widget
  search.set('sources', sources);
  //Create extent to limit search
  var extent = new modules.Extent({
    'spatialReference': {
      'wkid': 102100
    },
    'xmin': -13063280,
    'xmax': -13033928,
    'ymin': 4028345,
    'ymax': 4042715
  });

  //set the source's searchExtent to the extent specified above
  search.sources[0].searchExtent = extent;
  search.startup();
  map.on('load', enableSpotlight);
  search.on('select-result', showLocation);
  search.on('clear-search', removeSpotlight);
}

function enableSpotlight() {
  var html = "<div id='spotlight' class='spotlight'></div>";
  modules.domConstruct.place(html, modules.dom.byId('mapDiv'), 'first');
}

function removeSpotlight() {
  modules.query('.spotlight').removeClass('spotlight-active');
  map.infoWindow.hide();
  map.graphics.clear();
}

function showLocation(e) {
  map.graphics.clear();
  var point = e.result.feature.geometry;
  var symbol = new modules.SimpleMarkerSymbol().setStyle(
    modules.SimpleMarkerSymbol.STYLE_SQUARE).setColor(
    new modules.Color([255,0,0,0.5])
  );
  var graphic = new modules.Graphic(point, symbol);
  map.graphics.add(graphic);

  map.infoWindow.setTitle('Search Result');
  map.infoWindow.setContent(e.result.name);
  map.infoWindow.show(e.result.feature.geometry);

  var spotlight = map.on('extent-change', function() {
    var geom = modules.screenUtils.toScreenGeometry(map.extent, map.width,    map.height, e.result.extent);
    var width = geom.xmax - geom.xmin;
    var height = geom.ymin - geom.ymax;
    var max = height;
    if ( width > height ) {
      max = width;
    }
    var margin = '-' + Math.floor(max/2) + 'px 0 0 -' + Math.floor(max/2) + 'px';

    modules.query('.spotlight').addClass('spotlight-active').style({
      width: max + 'px',
      height: max + 'px',
      margin: margin
    });
    spotlight.remove();
  });
}

function initialize() {
  require([
    'esri/map',
    'esri/dijit/Search',
    'esri/geometry/Extent',
    'esri/graphic',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/geometry/screenUtils',
    'esri/layers/FeatureLayer',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/_base/Color',
    'dojo/domReady!search'
  ], function (Map, Search, Extent, Graphic, SimpleMarkerSymbol, screenUtils, FeatureLayer, dom, domConstruct, query, Color) {
    modules.Map = Map;
    modules.Search = Search;
    modules.Extent = Extent;
    modules.Graphic = Graphic;
    modules.SimpleMarkerSymbol = SimpleMarkerSymbol;
    modules.screenUtils = screenUtils;
    modules.FeatureLayer = FeatureLayer;
    modules.dom = dom;
    modules.domConstruct = domConstruct;
    modules.query = query;
    modules.Color = Color;
    createAndAddHandlers();
  });
}

initialize();
