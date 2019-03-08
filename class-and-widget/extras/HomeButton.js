define([
  'dijit/_WidgetBase',
  'dijit/_OnDijitClickMixin',
  'dijit/_TemplatedMixin',
  'dojo/Evented',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  // load template
  'dojo/text!esri/dijit/templates/HomeButton.html',
  'dojo/i18n!esri/nls/jsapi',
  'dojo/dom-class',
  'dojo/dom-style'
], function (
  _WidgetBase, _OnDijitClickMixin, _TemplatedMixin,
  Evented, declare, lang,
  on,
  dijitTemplate,
  i18n,
  domClass, domStyle
) {
  return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented], {
    declaredClass: 'esri.dijit.HomeButton',
    templateString: dijitTemplate,
    options: {
      theme: 'HomeButton',
      map: null,
      extent: null,
      visible: true
    },
    constructor: function (options, srcRefNode) {
      // mix in settings and defaults
      declare.safeMixin(this.options, options);
      this._i18n = i18n;
      // properties
      this.set('map', this.options.map);
      this.set('theme', this.options.theme);
      this.set('visible', this.options.visible);
      this.set('extent', this.options.extent);
      // listeners
      this.watch('theme', this._updateThemeWatch);
      this.watch('visible', this._visible);
      // classes
      this._css = {
        container: 'homeContainer',
        home: 'home',
        loading: 'loading'
      };
    },
    startup: function () {
      // map not defined
      if (!this.map) {
        this.destroy();
        console.log('HomeButton::map required');
      }
      // when map is loaded
      if (this.map.loaded) {
        this._init();
      } else {
        on(this.map, 'load', lang.hitch(this, function () {
          this._init();
        }));
      }
    },
    // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
    destroy: function () {
      this.inherited(arguments);
    },
    /* ---------------- */
    /* Public Events */
    /* ---------------- */
    // home
    // load
    /* ---------------- */
    /* Public Functions */
    /* ---------------- */
    home: function () {
      var defaultExtent = this.get('extent');
      this._showLoading();
      if (defaultExtent) {
        return this.map.setExtent(defaultExtent)
          .then(lang.hitch(this, function () {
            this._hideLoading();
            this.emit('home', {
              extent: defaultExtent
            });
          }));
      } else {
        this._hideLoading();
        console.log('HomeButton::no home extent');
      }
    },
    show: function () {
      this.set('visible', true);
    },
    hide: function () {
      this.set('visible', false);
    },
    /* ---------------- */
    /* Private Functions */
    /* ---------------- */
    _init: function () {
      this._visible();
      if (!this.get('extent')) {
        this.set('extent', this.map.extent);
      }
      this.set('loaded', true);
      this.emit('load', {});
    },
    _showLoading: function () {
      domClass.add(this._homeNode, this._css.loading);
    },
    _hideLoading: function () {
      domClass.remove(this._homeNode, this._css.loading);
    },
    _updateThemeWatch: function (attr, oldVal, newVal) {
      domClass.remove(this.domNode, oldVal);
      domClass.add(this.domNode, newVal);
    },
    _visible: function () {
      if (this.get('visible')) {
        domStyle.set(this.domNode, 'display', 'block');
      } else {
        domStyle.set(this.domNode, 'display', 'none');
      }
    }
  });
});