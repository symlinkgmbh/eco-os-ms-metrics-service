/**
 * Copyright 2018-2020 Symlink GmbH
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




import { Application } from "express";
import { PkApi } from "@symlinkde/eco-os-pk-models";
import { Heartbeat, MetricsRoutes, MetricsInternalRoute, LicenseBeat, ConfigBeat, StatistisRoute } from "./routes";

export class Router implements PkApi.IRouter {
  protected heartbeat: Heartbeat | undefined;
  protected licenseBeat: LicenseBeat | undefined;
  protected metrics: MetricsRoutes | undefined;
  protected metricsInternal: MetricsInternalRoute | undefined;
  protected configBeat: ConfigBeat | undefined;
  protected statisticsRoute: StatistisRoute | undefined;

  private app: Application;

  constructor(_app: Application) {
    this.app = _app;
  }

  public initRoutes(): void {
    this.heartbeat = new Heartbeat(this.app);
    this.licenseBeat = new LicenseBeat(this.app);
    this.configBeat = new ConfigBeat(this.app);
    this.metrics = new MetricsRoutes(this.app);
    this.metricsInternal = new MetricsInternalRoute(this.app);
    this.statisticsRoute = new StatistisRoute(this.app);
    return;
  }
}
