/** 
* Copyright 2018-2019 Symlink GmbH 
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
* 
*/ 

import { injectMetricsCollector } from "../../infrastructure/__decorators__";
import { IMetricsCollector } from "../../infrastructure/IMetricsCollector";
import { IServiceMemory } from "../../models";
import { CustomRestError } from "@symlinkde/eco-os-pk-api";
import { Log, LogLevel } from "@symlinkde/eco-os-pk-log";

@injectMetricsCollector
export class MetricsController {
  private metricCollector!: IMetricsCollector;

  public async collectiMemoryMetric(): Promise<Array<IServiceMemory>> {
    try {
      return await this.metricCollector.collectMemoryMetric();
    } catch (err) {
      Log.log(err, LogLevel.error);
      throw new CustomRestError(
        {
          code: 500,
          message: "problem in collect memory usage statistics",
        },
        500,
      );
    }
  }
}