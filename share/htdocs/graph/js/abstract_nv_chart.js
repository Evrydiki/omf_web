
L.provide('d3', ["vendor/d3/d3.js"], function() {
  L.provide('nv_d3', ["vendor/nv_d3/js/nv.d3.js",  "vendor/nv_d3/css/nv.d3.css"]);
})

L.provide('OML.abstract_nv_chart', ["graph/js/abstract_chart", "#OML.abstract_chart", 
                                   //"graph/js/axis", "#OML.axis", "graph/css/graph.css", 
                                   "#nv_d3"], function () {

  OML.abstract_nv_chart = OML.abstract_chart.extend({
    axis_defaults: {
      legend: {
        text: 'DESCRIBE ME',
        offset: 40 
      },
      ticks: {
        // type: 'date',
        // format: '%I:%M', // hour:minutes
        format: ',.s',
        // format: ",.0f" // integers with comma-grouping for thousands.
        //subdivide: 2, // the number of uniform subdivisions to make between major tick marks
        //size: [8, 4, 16], // set the size of major, minor and end ticks
        //padding: 20, // the padding between ticks and tick labels
        //count: 2 // number of ticks to display - this is currently overridden in NV
      },
      margin: {
        top: 0, right: 0, bottom: 0, left: 50 // not sure what impact this really has?
      }    
    },    

    configure_base_layer: function(vis) {
      this.base_layer = vis;
      var chart = this.chart = this._create_model(); //nv.models.lineWithFocusChart();
      this._configure_mapping(this.mapping, chart);
      this._configure_options(this.opts, chart);
    },
    
    _configure_mapping: function(m, chart) {
    },
    
    _configure_options: function(opts, chart) {
      chart.margin(opts.margin);
    },
    
    _configure_xy_axis: function(opts, chart) {
      var oaxis = opts.axis || {};
      var a_defaults = this.axis_defaults;
      
      var xao = _.defaults(oaxis.x || {}, a_defaults);
      this._configure_axis('x', chart.xAxis, xao);
      var yao = _.defaults(oaxis.y || {}, a_defaults);
      this._configure_axis('y', chart.yAxis, yao);
    },
    
    _configure_axis: function(name, axis, opts) {
      // LABEL
      var ol = opts.legend;
      if (ol) {
        var ol = ol ? (typeof(ol) === "string" ? {text: ol} : ol) : {};
        //ol = _.defaults(ol, defaults.axis);
        axis.axisLabel(ol.text);
      }
      
      // TICKS
      var ot = opts.ticks // _.defaults(opts.ticks || {}, defaults.ticks);
      // Check if we need a special formatter for the tick labels
      if (ot.type == 'date' || ot.type == 'dateTime') {
        var d_f = d3.time.format(ot.format || "%X");
        axis.tickFormat(function(d) {
          var date = new Date(1000 * d);  // TODO: Implicitly assuming that value is in seconds is most likely NOT a good idea
          var fs = d_f(date); 
          return fs;
        });
      } else if (ot.type == 'key') {
        var lm = ot.key_map;
        axis.tickFormat(function(d) {
          var l = lm[d] || ('??-' + d);
          return l;
        });
      } else if (ot.format) {
        axis.tickFormat(d3.format(ot.format));
      }
      if (ot.subdivide) axis.tickSubdivide(ot.subdivide);
      if (ot.size) {
        // apply doesn't seem to work here
        if (typeof ot.size === 'number') 
          axis.tickSize(ot.size);
        else {
          var a = ot.size;
          switch (a.length) {
            case 1: axis.tickSize(a[0]); break;
            case 2: axis.tickSize(a[0], a[1]); break;
            case 3: axis.tickSize(a[0], a[1], a[2]); break;
          }
        }
      }
      if (ot.padding) axis.tickPadding(ot.padding);
      if (ot.count) axis.ticks(ot.count);
      
      // MARGIN
      var om = opts.margin //_.defaults(ot.margin || {}, defaults.margin);
      axis.margin(om);

      // MISC
      axis.showMaxMin(false)
    },

    resize: function() {
      var self = this;
      OML.abstract_nv_chart.__super__.resize.call(this);
      if (this.chart) {
        this.chart.width(self.width);
        this.chart.height(self.height);        
        this.chart.update();
      } 
    },
  
    redraw: function(data) {
      this.base_layer//.select(".chart_layer")
        .datum(this._datum(data, this.chart))
        .transition().duration(500)
          .call(this.chart);
    },
    
  })
})

/*
  Local Variables:
  mode: Javascript
  tab-width: 2
  indent-tabs-mode: nil
  End:
*/