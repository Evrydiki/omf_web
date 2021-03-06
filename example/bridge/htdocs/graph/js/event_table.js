
define(["graph/table2",
         'vendor/slickgrid/plugins/slick.checkboxselectcolumn',
         'css!/resource/css/bridge.css'], function(table2) {

  var event_table = table2.extend({
    decl_properties: [
    ],

    defaults: function() {
      return this.deep_defaults({
      }, event_table.__super__.defaults.call(this));
    },

    base_css_class: 'oml-event-table',

    init_grid: function() {
      event_table.__super__.init_grid.call(this);

      var grid = this.grid;
      var self = this;

      grid.setSelectionModel(new Slick.RowSelectionModel());
      grid.onSelectedRowsChanged.subscribe(function(e, args) {
        var rindex = args.rows[0];
        var row = self.data[rindex];
        var event_id = row[self.schema.eventID.index];
        if (event_id) {
          OHUB.trigger("bridge.event_selected", {datum: row, schema: self.schema});
        }
      });
    },

    init_columns: function() {
      var columns = event_table.__super__.init_columns.call(this);

      // var checkboxSelector = new Slick.CheckboxSelectColumn({
        // cssClass: "slick-cell-checkboxsel"
      // });
      // columns.splice(0, 0, checkboxSelector.getColumnDefinition());

      function health_formatter(row, cell, value, columnDef, dataContext) {
        if (value == null || value === "") {
          return "";
        }
        var value = Math.round(100 * (1 - value));
        var color;

        if (value < 30) {
          color = "silver";
        } else if (value < 50) {
          color = "orange";
        } else {
          color = "red";
        }
        var width = value * (columnDef.width - 50) / 100; // 50 size of text
        var text = "<span class'percent-complete-text'>" + value + "%</span>";
        var bar = "<span class='percent-complete-bar' style='background:" + color + ";width:" + width + "px'></span>";
        return text + bar;
      }
      var hc = columns[2];
      hc.formatter = health_formatter;
      hc.name = 'Attention';
      return columns;
    },


  }); // end of event-table

  return event_table;
});
