var modules = {}, map;

function createMap() {
  // load the map centered on the United States
  var bbox = new modules.Extent({
    'xmin':-1940058,
    'ymin':-814715,
    'xmax':1683105,
    'ymax':1446096,
    'spatialReference': {'wkid':102003}
  });
  map = new modules.Map('mapDiv', {
    extent: bbox,
    showLabels : true //very important that this must be set to true!
  });
}

function createAndAddHandlers() {
  createMap();
  // create a text symbol to define the style of labels
  var statesLabel = new modules.TextSymbol().setColor(statesColor);
  statesLabel.font.setSize('14pt');
  statesLabel.font.setFamily('arial');
  //Create a JSON object which contains the labeling properties. At the very least, specify which field to label using the labelExpressionInfo property. Other properties can also be specified such as whether to work with coded value domains, fieldinfos (if working with dates or number formatted fields, and even symbology if not specified as above)
  var json = {
    'labelExpressionInfo': {'value': '{STATE_NAME}'}
  };
  //create instance of LabelClass (note: multiple LabelClasses can also be passed in as an array)
  var labelClass = new modules.LabelClass(json);
  labelClass.symbol = statesLabel; // symbol also can be set in LabelClass' json

  // create a renderer for the states layer to override default symbology
  var statesColor = new modules.Color('#666');
  var statesLine = new modules.SimpleLineSymbol('solid', statesColor, 1.5);
  var statesSymbol = new modules.SimpleFillSymbol('solid', statesLine, null);
  var statesRenderer = new modules.SimpleRenderer(statesSymbol);
  // create a feature layer to show country boundaries
  var statesUrl = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3';
  var states = new modules.FeatureLayer(statesUrl, {
    id: 'states',
    outFields: ['*']
  });
  states.setRenderer(statesRenderer);
  states.setLabelingInfo([ labelClass ]);
  map.addLayer(states);
}

function initialize() {
  require([
    'esri/map',
    'esri/geometry/Extent',
    'esri/layers/FeatureLayer',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/TextSymbol',
    'esri/renderers/SimpleRenderer',
    'esri/layers/LabelClass',
    'dojo/_base/Color',
    'dojo/domReady!'
  ], function(Map, Extent, FeatureLayer, SimpleLineSymbol, SimpleFillSymbol,
              TextSymbol, SimpleRenderer, LabelClass, Color) {
    modules.Map = Map;
    modules.Extent = Extent;
    modules.FeatureLayer = FeatureLayer;
    modules.SimpleLineSymbol = SimpleLineSymbol;
    modules.SimpleFillSymbol = SimpleFillSymbol;
    modules.TextSymbol = TextSymbol;
    modules.SimpleRenderer = SimpleRenderer;
    modules.LabelClass = LabelClass;
    modules.Color = Color;
    createAndAddHandlers();
  });
}

initialize();
