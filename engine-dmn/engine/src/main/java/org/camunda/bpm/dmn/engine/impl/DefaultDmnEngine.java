/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.camunda.bpm.dmn.engine.impl;

import static org.camunda.commons.utils.EnsureUtil.ensureNotNull;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionTableResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.DmnEngineConfiguration;
import org.camunda.bpm.dmn.engine.impl.spi.transform.DmnTransformer;
import org.camunda.bpm.engine.variable.Variables;
import org.camunda.bpm.engine.variable.context.VariableContext;
import org.camunda.bpm.model.dmn.DmnModelInstance;
import org.camunda.commons.utils.IoUtil;
import org.camunda.commons.utils.IoUtilException;

public class DefaultDmnEngine implements DmnEngine {

  protected static final DmnEngineLogger LOG = DmnLogger.ENGINE_LOGGER;

  protected DefaultDmnEngineConfiguration dmnEngineConfiguration;
  protected DmnTransformer transformer;

  public DefaultDmnEngine(DefaultDmnEngineConfiguration dmnEngineConfiguration) {
    this.dmnEngineConfiguration = dmnEngineConfiguration;
    this.transformer = dmnEngineConfiguration.getTransformer();
  }

  public DmnEngineConfiguration getConfiguration() {
    return dmnEngineConfiguration;
  }

  public List<DmnDecision> parseDecisions(String filename) {
    ensureNotNull("filename", filename);
    try {
      InputStream inputStream = IoUtil.fileAsStream(filename);
      return parseDecisions(inputStream);
    }
    catch (IoUtilException e) {
      throw LOG.unableToReadFile(filename, e);
    }
  }

  public List<DmnDecision> parseDecisions(InputStream inputStream) {
    ensureNotNull("inputStream", inputStream);
    return transformer.createTransform()
      .modelInstance(inputStream)
      .transformDecisions();
  }

  public List<DmnDecision> parseDecisions(DmnModelInstance dmnModelInstance) {
    ensureNotNull("dmnModelInstance", dmnModelInstance);
    return transformer.createTransform()
      .modelInstance(dmnModelInstance)
      .transformDecisions();
  }

  public DmnDecision parseFirstDecision(String filename) {
    List<DmnDecision> decisions = parseDecisions(filename);
    if (!decisions.isEmpty()) {
      return decisions.get(0);
    }
    else {
      throw LOG.unableToFindAnyDecisionInFile(filename);
    }
  }

  public DmnDecision parseFirstDecision(InputStream inputStream) {
    List<DmnDecision> decisions = parseDecisions(inputStream);
    if (!decisions.isEmpty()) {
      return decisions.get(0);
    }
    else {
      throw LOG.unableToFindAnyDecision();
    }
  }

  public DmnDecision parseFirstDecision(DmnModelInstance dmnModelInstance) {
    List<DmnDecision> decisions = parseDecisions(dmnModelInstance);
    if (!decisions.isEmpty()) {
      return decisions.get(0);
    }
    else {
      throw LOG.unableToFindAnyDecision();
    }
  }

  public DmnDecision parseDecision(String decisionKey, String filename) {
    ensureNotNull("decisionKey", decisionKey);
    List<DmnDecision> decisions = parseDecisions(filename);
    for (DmnDecision decision : decisions) {
      if (decisionKey.equals(decision.getKey())) {
        return decision;
      }
    }
    throw LOG.unableToFindDecisionWithKeyInFile(decisionKey, filename);
  }

  public DmnDecision parseDecision(String decisionKey, InputStream inputStream) {
    ensureNotNull("decisionKey", decisionKey);
    List<DmnDecision> decisions = parseDecisions(inputStream);
    for (DmnDecision decision : decisions) {
      if (decisionKey.equals(decision.getKey())) {
        return decision;
      }
    }
    throw LOG.unableToFindDecisionWithKey(decisionKey);
  }

  public DmnDecision parseDecision(String decisionKey, DmnModelInstance dmnModelInstance) {
    ensureNotNull("decisionKey", decisionKey);
    List<DmnDecision> decisions = parseDecisions(dmnModelInstance);
    for (DmnDecision decision : decisions) {
      if (decisionKey.equals(decision.getKey())) {
        return decision;
      }
    }
    throw LOG.unableToFindDecisionWithKey(decisionKey);
  }

  public DmnDecisionTableResult evaluateDecisionTable(DmnDecision decision, Map<String, Object> variables) {
    ensureNotNull("decision", decision);
    ensureNotNull("variables", variables);
    return evaluateDecisionTable(decision, Variables.fromMap(variables).asVariableContext());
  }

  public DmnDecisionTableResult evaluateDecisionTable(DmnDecision decision, VariableContext variableContext) {
    ensureNotNull("decision", decision);
    ensureNotNull("variableContext", variableContext);

    if (decision instanceof DmnDecisionTableImpl) {
      DefaultDmnDecisionContext decisionContext = new DefaultDmnDecisionContext(dmnEngineConfiguration);
      return decisionContext.evaluateDecisionTable((DmnDecisionTableImpl) decision, variableContext);
    }
    else {
      throw LOG.decisionTypeNotSupported(decision);
    }
  }

  public DmnDecisionTableResult evaluateFirstDecisionTable(String filename, Map<String, Object> variables) {
    ensureNotNull("variables", variables);
    return evaluateFirstDecisionTable(filename, Variables.fromMap(variables).asVariableContext());
  }

  public DmnDecisionTableResult evaluateFirstDecisionTable(String filename, VariableContext variableContext) {
    List<DmnDecision> decisions = parseDecisions(filename);
    for (DmnDecision decision : decisions) {
      if (decision.isDecisionTable()) {
        return evaluateDecisionTable(decision, variableContext);
      }
    }
    throw LOG.unableToFindAnyDecisionTableInFile(filename);
  }

  public DmnDecisionTableResult evaluateFirstDecisionTable(InputStream inputStream, Map<String, Object> variables) {
    ensureNotNull("variables", variables);
    return evaluateFirstDecisionTable(inputStream, Variables.fromMap(variables).asVariableContext());
  }

  public DmnDecisionTableResult evaluateFirstDecisionTable(InputStream inputStream, VariableContext variableContext) {
    List<DmnDecision> decisions = parseDecisions(inputStream);
    for (DmnDecision decision : decisions) {
      if (decision.isDecisionTable()) {
        return evaluateDecisionTable(decision, variableContext);
      }
    }
    throw LOG.unableToFindAnyDecisionTable();
  }

  public DmnDecisionTableResult evaluateFirstDecisionTable(DmnModelInstance dmnModelInstance, Map<String, Object> variables) {
    ensureNotNull("variables", variables);
    return evaluateFirstDecisionTable(dmnModelInstance, Variables.fromMap(variables).asVariableContext());
  }

  public DmnDecisionTableResult evaluateFirstDecisionTable(DmnModelInstance dmnModelInstance, VariableContext variableContext) {
    List<DmnDecision> decisions = parseDecisions(dmnModelInstance);
    for (DmnDecision decision : decisions) {
      if (decision.isDecisionTable()) {
        return evaluateDecisionTable(decision, variableContext);
      }
    }
    throw LOG.unableToFindAnyDecisionTable();
  }

  public DmnDecisionTableResult evaluateDecisionTable(String decisionKey, String filename, Map<String, Object> variables) {
    ensureNotNull("variables", variables);
    return evaluateDecisionTable(decisionKey, filename, Variables.fromMap(variables).asVariableContext());
  }

  public DmnDecisionTableResult evaluateDecisionTable(String decisionKey, String filename, VariableContext variableContext) {
    ensureNotNull("decisionKey", decisionKey);
    List<DmnDecision> decisions = parseDecisions(filename);
    for (DmnDecision decision : decisions) {
      if (decisionKey.equals(decision.getKey())) {
        return evaluateDecisionTable(decision, variableContext);
      }
    }
    throw LOG.unableToFindDecisionWithKeyInFile(decisionKey, filename);
  }

  public DmnDecisionTableResult evaluateDecisionTable(String decisionKey, InputStream inputStream, Map<String, Object> variables) {
    ensureNotNull("variables", variables);
    return evaluateDecisionTable(decisionKey, inputStream, Variables.fromMap(variables).asVariableContext());
  }

  public DmnDecisionTableResult evaluateDecisionTable(String decisionKey, InputStream inputStream, VariableContext variableContext) {
    ensureNotNull("decisionKey", decisionKey);
    List<DmnDecision> decisions = parseDecisions(inputStream);
    for (DmnDecision decision : decisions) {
      if (decisionKey.equals(decision.getKey())) {
        return evaluateDecisionTable(decision, variableContext);
      }
    }
    throw LOG.unableToFindDecisionWithKey(decisionKey);
  }

  public DmnDecisionTableResult evaluateDecisionTable(String decisionKey, DmnModelInstance dmnModelInstance, Map<String, Object> variables) {
    ensureNotNull("variables", variables);
    return evaluateDecisionTable(decisionKey, dmnModelInstance, Variables.fromMap(variables).asVariableContext());
  }

  public DmnDecisionTableResult evaluateDecisionTable(String decisionKey, DmnModelInstance dmnModelInstance, VariableContext variableContext) {
    ensureNotNull("decisionKey", decisionKey);
    List<DmnDecision> decisions = parseDecisions(dmnModelInstance);
    for (DmnDecision decision : decisions) {
      if (decisionKey.equals(decision.getKey())) {
        return evaluateDecisionTable(decision, variableContext);
      }
    }
    throw LOG.unableToFindDecisionWithKey(decisionKey);
  }

}
