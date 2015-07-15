'use strict';

var fs = require('fs'),
    factory = require('../../setup-factory.js'),
    combine = factory.combine,
    operation = factory.operation;

var fragment1 = combine(
  operation('filter', 'create', [{
    name:         'All',
    query: {},
    resourceType: 'Task',
    properties: {
      variables: [{
        name: 'testVar',
        label: 'Test Variable'
      },
      {
        name: 'testString',
        label:'String Variable'
      }]
    }
  }])
)

var fragment2 = combine(
  operation('task', 'create', [{
    id: '1',
    name: 'Task 1',
    description: 'This task is for testing purpose only!!!'
  }])
)

var fragment3 = combine(
  operation('task', 'assignee', [{
    taskId: '1',
    userId: 'admin'
  }])
)

var fragment4 = combine(
  operation('deployment', 'create', [{
    deploymentName:  'user-tasks',
    files: [{
      name: 'user-tasks.bpmn',
      content: fs.readFileSync(__dirname + '/../../resources/user-tasks.bpmn').toString()
    }]
  }]),

  operation('process-definition', 'start', [{
    key: 'user-tasks',
    businessKey: 'Instance1'
  }])
)

module.exports = {

  setup1: combine(fragment1, fragment2),
  setup2: combine(fragment3),
  setup3: combine(fragment1, fragment4)
};
