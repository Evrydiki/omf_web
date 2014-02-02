
define(["graph/abstract_chart"], function(abstract_chart) {

  var graph = abstract_chart.extend({
    // MAKE SURE THIS IS DEFINED IN SUB CLASS
    //data_source_names: ['centers', 'users'],

    // initialize: function(opts) {
      // graph.__super__.initialize.call(this, opts);
//
      // var self = this;
      // // OHUB.bind("bridge.event_selected", function(evt) {
        // // var joint_id = evt.datum[evt.schema.jointID.index];
        // // self.redraw_sensor_locator(joint_id);
      // // });
    // },

    // Find the appropriate data source and bind to it
    //
    init_data_source: function() {
      var self = this;
      var o = self.opts;
      var sources = o.data_sources;
      var ds_names = self.data_source_names;

      if (! (sources instanceof Array)) {
        throw "Expected an array";
      }
      if (sources.length != ds_names.length) {
        throw "Expected '" + ds_names.length + "' data source, but only found '" + sources.length + "'.";
      }

      var dsh = self.data_source = {};
      _.map(sources, function(s) {
        dsh[s.name] = self.init_single_data_source(s);
      });
      _.each(ds_names, function(ds_name) {
        if (dsh[ds_name] == undefined) {
          throw "Missing data source '" + ds_name + "'. Check for spelling of name.";
        }
      });
    },

    process_schema: function() {
      var self = this;
      var ds_names = self.data_source_names;

      var schemas = self.schema = {};
      _.each(ds_names, function(ds_name) {
        schemas[ds_name] = self.process_single_schema(self.data_source[ds_name]);
      });

      var om = self.opts.mapping;
      if (om == undefined) {
        throw "Missing mapping instructions in 'options'.";
      }
      self.mapping = {};
      _.each(ds_names, function(ds_name) {
        var mapping = om[ds_name];
        if (mapping == undefined) {
          throw "Missing mapping instructions in 'options' for '" + ds_name + "'.";
        }
        self.mapping[ds_name] = self.process_single_mapping(ds_name, mapping, self.decl_properties[ds_name]);
      });
    },

    /*
     * Return schema for +stream+.
     */
    schema_for_stream: function(stream) {
      var schema = this.schema[stream];
      return schema;
    },

    update: function() {
      var data = {};
      var self = this;

      _.each(self.data_source_names, function(ds_name) {
        data[ds_name] = self.data_source[ds_name].rows();
      }, self);
      self.redraw(data);
    },

  }); // end of graph

  return graph;
});
