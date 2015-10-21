/* global define: false */
define([],
function() {
  'use strict';

  return [ 'ViewsProvider', function(ViewsProvider) {

    ViewsProvider.registerDefaultView('cockpit.decisionInstance.table', {
      id: 'realOutput',
      initialize: function(data) {

        var viewer = data.tableControl.getViewer();

        viewer.get('eventBus').on('cell.render', function(event) {

          var row = event.data.row;
          var ruleIndex = data.decisionInstance.outputs.map(function(output) {
            return output.ruleId;
          }).indexOf(row.id);

          var column = event.data.column;
          var columnIndex = data.decisionInstance.outputs.map(function(output) {
            return output.clauseId;
          }).indexOf(column.id);

          if(ruleIndex !== -1 && columnIndex !== -1) {
            var realOutput = document.createElement('span');
            realOutput.className = 'dmn-output';
            realOutput.textContent = ' = ' + data.decisionInstance.outputs.filter(function(output) {
              return output.ruleId === row.id && output.clauseId === column.id;
            })[0].value;
            event.gfx.appendChild(realOutput);
          }
        });
      }
    });
  }];
});
