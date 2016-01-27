'use strict';

var testHelper = require('../../test-helper');
var setupFile = require('./task-detail-view-setup');

var dashboardPage = require('../pages/dashboard');
var taskListPage = dashboardPage.taskList;
var taskViewPage = dashboardPage.currentTask;


describe('Tasklist Detail View Spec', function() {

  before(function() {
    return testHelper(setupFile.setup1, function() {

      dashboardPage.navigateToWebapp('Tasklist');
      dashboardPage.authentication.userLogin('admin', 'admin');
    });
  });

  describe('the task detail view', function() {

    it('should display info text when no task is selected', function() {

      // then
      expect(taskViewPage.noTaskInfoText()).to.eventually.eql('Select a task in the list.');
    });


    it('should appear when a task is selected', function() {

      // when
      taskListPage.selectTask('Task 1');
      dashboardPage.waitForElementToBeVisible(taskViewPage.taskName());

      // then
      expect(taskViewPage.taskName()).to.eventually.eql('Task 1');
    });

  });


  describe('description tab', function() {

    before(function() {
      taskListPage.selectTask('Task 1');
    });

    it('should display description of a task', function() {

      // given
      dashboardPage.waitForElementToBeVisible(taskViewPage.taskName());

      // when
      taskViewPage.description.selectTab();

      // then
      expect(taskViewPage.description.descriptionField()).to.eventually.eql(setupFile.setup1[1].params.description);
    });

  });


  describe('add a comment', function() {

    before(function() {
      taskListPage.selectTask('Task 1');
    });

    it('should display comment in the history tab', function() {

      // given
      var commentText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.' +
                         'Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor.' +
                         'Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim,' +
                         'ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor.' +
                         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis,' +
                         'pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis.' +
                         'Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero' +
                         'in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar ...';

      dashboardPage.waitForElementToBeVisible(taskViewPage.taskName(), 5000);

      // when
      taskViewPage.addComment(commentText);

      // then
      taskViewPage.history.selectTab();
      expect(taskViewPage.history.eventType(0)).to.eventually.eql('Comment');
      expect(taskViewPage.history.commentMessage(0)).to.eventually.eql(commentText);
      expect(taskViewPage.history.operationUser(0)).to.eventually.eql('admin');
    });

  });


  describe('form tab', function() {

    before(function() {
      return testHelper(setupFile.setup1, function() {

        dashboardPage.navigateToWebapp('Tasklist');
        dashboardPage.authentication.userLogin('admin', 'admin');
      });
    });

    describe('with generic form and unclaimed task', function() {

      it('should disable form elements', function() {

        // given
        taskListPage.selectTask('Task 1');
        dashboardPage.waitForElementToBeVisible(taskViewPage.taskName());

        // when
        taskViewPage.form.selectTab();

        // then
        expect(taskViewPage.form.completeButton().isEnabled()).to.eventually.be.false;
      });

    });


    describe('with generic form and claimed task', function() {

      before(function() {
        return testHelper(setupFile.setup2, true);
      });

      it('should enable form elements', function() {

        // given
        taskListPage.selectTask('Task 1');
        dashboardPage.waitForElementToBeVisible(taskViewPage.taskName());

        // when
        taskViewPage.form.selectTab();

        // then
        expect(taskViewPage.form.completeButton().isEnabled()).to.eventually.be.true;
      });

    });

  });


  describe('diagram tab', function() {

    before(function() {
      return testHelper(setupFile.setup3, function() {

        dashboardPage.navigateToWebapp('Tasklist');
        dashboardPage.authentication.userLogin('admin', 'admin');
      });
    });

    it('should display the process and highlight current task', function() {

      // given
      taskListPage.selectTask('User Task 1');
      dashboardPage.waitForElementToBeVisible(taskViewPage.taskName());

      // when
      taskViewPage.diagram.selectTab();

      // then
      expect(taskViewPage.diagram.isActivitySelected('UserTask_1')).to.eventually.be.true;
    });

  });

});
