ngDefine('cockpit.plugin.base.resources', function(module) {

  var Resource = function ($resource, Uri) {
    return $resource(Uri.appUri('plugin://base/:engine/process-instance'), {}, {});
  };

  module
    .factory('PluginProcessInstanceResource', Resource);

});