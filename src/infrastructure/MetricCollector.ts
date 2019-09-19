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



import { IMetricsCollector } from "./IMetricsCollector";
import { IServiceMemory, IService } from "../models";
import { injectable } from "inversify";
import Axios, { AxiosInstance } from "axios";
import { Log, LogLevel } from "@symlinkde/eco-os-pk-log";

@injectable()
export class MetricCollector implements IMetricsCollector {
  private client: AxiosInstance;

  public constructor() {
    this.client = Axios.create({
      timeout: 3000,
    });
  }

  public async collectMemoryMetric(): Promise<Array<IServiceMemory>> {
    try {
      const services = await this.getServiceList();
      const serviceMemories: Array<IServiceMemory> = [];
      for (const index in services) {
        if (index) {
          const response = await this.client.get(`${services[index].url}/metrics`);
          const indexService = serviceMemories.findIndex((entry) => entry.name === services[index].name);
          if (indexService > -1) {
            serviceMemories[indexService].bytes =
              serviceMemories[indexService].bytes + response.data.metrics.service.serviceMemories.heapTotal;
            serviceMemories[indexService].memoryUsage = this.bytesToSize(serviceMemories[indexService].bytes);
          } else {
            await serviceMemories.push(<IServiceMemory>{
              name: services[index].name,
              memoryUsage: this.bytesToSize(response.data.metrics.service.memory.heapTotal),
              bytes: response.data.metrics.service.memory.heapTotal,
            });
          }
        }
      }

      return serviceMemories;
    } catch (err) {
      Log.log(err, LogLevel.error);
      return [];
    }
  }

  private async getServiceList(): Promise<Array<IService>> {
    const registry = process.env.SECONDLOCK_REGISTRY_URI === undefined ? "" : process.env.SECONDLOCK_REGISTRY_URI;
    const response = await this.client.get(`${registry}/registry`);

    const services: Array<IService> = [];

    for (const index in response.data) {
      if (index) {
        await services.push(<IService>{
          name: response.data[index].name,
          url: response.data[index].url,
        });
      }
    }

    return services;
  }

  private bytesToSize(bytes: number, decimals = 2): string {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
