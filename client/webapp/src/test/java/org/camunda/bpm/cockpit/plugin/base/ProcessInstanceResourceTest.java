/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.camunda.bpm.cockpit.plugin.base;

import static org.fest.assertions.Assertions.assertThat;

import java.util.List;

import org.camunda.bpm.cockpit.impl.plugin.base.dto.CalledProcessInstanceDto;
import org.camunda.bpm.cockpit.impl.plugin.base.dto.ProcessInstanceDto;
import org.camunda.bpm.cockpit.impl.plugin.base.dto.query.ProcessInstanceQueryDto;
import org.camunda.bpm.cockpit.impl.plugin.base.sub.resources.ProcessInstanceResource;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.engine.runtime.ActivityInstance;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.webapp.test.util.JobExecutorHelper;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 * @author roman.smirnov
 */
public class ProcessInstanceResourceTest extends AbstractCockpitPluginTest {

  private ProcessInstanceResource resource;
  private ProcessEngine processEngine;
  private JobExecutorHelper helper;
  private RuntimeService runtimeService;
  private RepositoryService repositoryService;

  @Before
  public void setUp() throws Exception {
    super.before();

    processEngine = getProcessEngine();
    helper = new JobExecutorHelper(processEngine);
    runtimeService = processEngine.getRuntimeService();
    repositoryService = processEngine.getRepositoryService();
  }

  @Test
  @Deployment(resources = {
      "processes/two-parallel-call-activities-calling-different-process.bpmn",
      "processes/user-task-process.bpmn",
      "processes/another-user-task-process.bpmn"
    })
  public void testGetCalledProcessInstancesByParentProcessInstanceId() {
    ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("TwoParallelCallActivitiesCallingDifferentProcess");

    resource = new ProcessInstanceResource(getProcessEngine().getName(), processInstance.getId());

    helper.waitForJobExecutorToProcessAllJobs(15000);

    ProcessDefinition userTaskProcess = repositoryService
        .createProcessDefinitionQuery()
        .processDefinitionKey("userTaskProcess")
        .singleResult();

    ProcessDefinition anotherUserTaskProcess = repositoryService
        .createProcessDefinitionQuery()
        .processDefinitionKey("anotherUserTaskProcess")
        .singleResult();

    ProcessInstanceQueryDto queryParameter = new ProcessInstanceQueryDto();

    List<ProcessInstanceDto> result = resource.queryCalledProcessInstances(queryParameter);
    assertThat(result).isNotEmpty();
    assertThat(result).hasSize(2);

    ProcessDefinition compareWith = null;
    for (ProcessInstanceDto instance : result) {
      CalledProcessInstanceDto dto = (CalledProcessInstanceDto) instance;
      if (dto.getProcessDefinitionId().equals(userTaskProcess.getId())) {
        compareWith = userTaskProcess;
        assertThat(dto.getCallActivityId()).isEqualTo("firstCallActivity");
      } else if (dto.getProcessDefinitionId().equals(anotherUserTaskProcess.getId())) {
        compareWith = anotherUserTaskProcess;
        assertThat(dto.getCallActivityId()).isEqualTo("secondCallActivity");
      } else {
        Assert.fail("Unexpected called process instance: " + dto.getId());
      }

      assertThat(dto.getCallActivityInstanceId()).isNotNull();

      assertThat(dto.getProcessDefinitionId()).isEqualTo(compareWith.getId());
      assertThat(dto.getProcessDefinitionName()).isEqualTo(compareWith.getName());
      assertThat(dto.getProcessDefinitionKey()).isEqualTo(compareWith.getKey());
    }
  }

  @Test
  @Deployment(resources = {
      "processes/two-parallel-call-activities-calling-different-process.bpmn",
      "processes/user-task-process.bpmn",
      "processes/another-user-task-process.bpmn"
    })
  public void testGetCalledProcessInstancesByParentProcessInstanceIdAndActivityInstanceId() {
    ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("TwoParallelCallActivitiesCallingDifferentProcess");

    resource = new ProcessInstanceResource(getProcessEngine().getName(), processInstance.getId());

    ActivityInstance processInstanceActivityInstance = runtimeService.getActivityInstance(processInstance.getId());

    String firstActivityInstanceId = null;
    String secondActivityInstanceId = null;

    for (ActivityInstance child : processInstanceActivityInstance.getChildActivityInstances()) {
      if (child.getActivityId().equals("firstCallActivity")) {
        firstActivityInstanceId = child.getId();
      } else if (child.getActivityId().equals("secondCallActivity")) {
        secondActivityInstanceId = child.getId();
      } else {
        Assert.fail("Unexpected activity instance with activity id: " + child.getActivityId() + " and instance id: " + child.getId());
      }
    }

    helper.waitForJobExecutorToProcessAllJobs(15000);

    ProcessInstanceQueryDto queryParameter1 = new ProcessInstanceQueryDto();

    String[] activityInstanceIds1 = {firstActivityInstanceId};
    queryParameter1.setActivityInstanceIdIn(activityInstanceIds1);

    List<ProcessInstanceDto> result1 = resource.queryCalledProcessInstances(queryParameter1);
    assertThat(result1).isNotEmpty();
    assertThat(result1).hasSize(1);

    ProcessInstanceQueryDto queryParameter2 = new ProcessInstanceQueryDto();
    String[] activityInstanceIds2 = {secondActivityInstanceId};
    queryParameter2.setActivityInstanceIdIn(activityInstanceIds2);

    List<ProcessInstanceDto> result2 = resource.queryCalledProcessInstances(queryParameter2);
    assertThat(result2).isNotEmpty();
    assertThat(result2).hasSize(1);

    ProcessInstanceQueryDto queryParameter3 = new ProcessInstanceQueryDto();
    String[] activityInstanceIds3 = {firstActivityInstanceId, secondActivityInstanceId};
    queryParameter3.setActivityInstanceIdIn(activityInstanceIds3);

    List<ProcessInstanceDto> result3 = resource.queryCalledProcessInstances(queryParameter3);
    assertThat(result3).isNotEmpty();
    assertThat(result3).hasSize(2);
  }
}
