/*
 * Copyright © 2014-2018 camunda services GmbH and various authors (info@camunda.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
package org.camunda.bpm.admin.impl;

import org.camunda.bpm.admin.AdminRuntimeDelegate;
import org.camunda.bpm.admin.plugin.spi.AdminPlugin;
import org.camunda.bpm.webapp.impl.AbstractAppRuntimeDelegate;

/**
 * @author Daniel Meyer
 *
 */
public class DefaultAdminRuntimeDelegate extends AbstractAppRuntimeDelegate<AdminPlugin> implements AdminRuntimeDelegate {

  public DefaultAdminRuntimeDelegate() {
    super(AdminPlugin.class);
  }

}
