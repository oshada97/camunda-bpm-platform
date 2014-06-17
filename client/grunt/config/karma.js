module.exports = function() {
  return {
    options: {
      singleRun: true,
      autoWatch: false,

      frameworks: ['jasmine', 'requirejs'],

      files: [
        'node_modules/karma-requirejs/lib/adapter.js',
        'node_modules/karma-jasmine/lib/jasmine.js',
        'node_modules/karma-jasmine/lib/adapter.js',

        {pattern: 'test/integration/**/*Spec.js', included: true},
        {pattern: 'client/bower_components/**/*.js', included: false},
        {pattern: 'client/scripts/**/*.js', included: false},

        'test/integration/main.js'
      ],
      browsers: [
        // 'Chrome',
        // 'Firefox',
        'PhantomJS'
      ]
    },

    integration: {
      options: {}
    },

    dev: {
      options: {
        singleRun: false,
        autoWatch: true
      }
    }
  }
};
