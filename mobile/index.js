var modules = {}, map;

function createAndAddHandlers() {
  map = createMap();
  modules.parser.parse();
  modules.mobile.hideAddressBar();

  // onorientationchange doesn't always fire in a timely manner in Android so check for both orientationchange and resize
  var resizeEvt = (window.onorientationchange !== undefined && !modules.has('android')) ? 'orientationchange' : 'resize';
  modules.on(window, resizeEvt, resizeMap);
  map.on('load', mapLoadHandler);
}

function createMap() {
  return new modules.Map('mapDiv', {
    basemap: 'streets-navigation-vector',
    center: [-8.61024, 41.15],
    zoom: 10,
    slider: false
  });
}

function resizeMap() {
  modules.mobile.hideAddressBar();
  adjustMapHeight();
  map.resize();
  map.reposition();
}

function iphoneAdjustment() {
  var sz = modules.mobile.getScreenSize();
  if (sz.h > sz.w) { //portrait
    //Need to add address bar height back to map because it has not been hidden yet
    /* 44 = height of bottom safari button bar */
    return screen.availHeight - window.innerHeight - 44;
  } else { //landscape
    //Need to react to full screen / bottom button bar visible toggles
    var _conn = modules.on(window, 'resize', function() {
      _conn.remove();
      resizeMap();
    });
    return 0;
  }
}

function mapLoadHandler(evt) {
  resizeMap();
  modules.registry.byId('mapView').on('AfterTransitionIn', resizeMap);
}

function adjustMapHeight() {
  var availHeight = modules.mobile.getScreenSize().h - modules.registry.byId('header').domNode.clientHeight - 1;
  if (modules.has('iphone') || modules.has('ipod')) {
    availHeight += iphoneAdjustment();
  }
  modules.dom.byId('mapDiv').style.height = availHeight + 'px';
}

function initialize() {
  require([
    'esri/map',
    'dojox/mobile',
    'dojox/mobile/parser',
    'esri/sniff',
    'dojox/mobile/deviceTheme',
    'dojo/dom',
    'dijit/registry',
    'dojo/on',
    'dojox/mobile/ToolBarButton',
    'dojox/mobile/View',
    'dojox/mobile/ContentPane'
  ], function (Map, mobile, parser, has, dTheme, dom, registry, on) {
    modules.Map = Map;
    modules.mobile = mobile;
    modules.parser = parser;
    modules.has = has;
    modules.dom = dom;
    modules.registry = registry;
    modules.on = on;
    createAndAddHandlers();
  });
}

initialize();
