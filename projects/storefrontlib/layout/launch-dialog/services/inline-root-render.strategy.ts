/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  Inject,
  Injectable,
  Injector,
  RendererFactory2,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { LaunchInlineRootDialog, LAUNCH_CALLER } from '../config/launch-config';
import { LaunchRenderStrategy } from './launch-render.strategy';

@Injectable({ providedIn: 'root' })
export class InlineRootRenderStrategy extends LaunchRenderStrategy {
  constructor(
    @Inject(DOCUMENT) protected document: any,
    protected rendererFactory: RendererFactory2,
    protected injector: Injector
  ) {
    super(document, rendererFactory);
  }

  get hostComponent() {
    return this.injector.get(ApplicationRef)?.components?.[0];
  }

  render(
    config: LaunchInlineRootDialog,
    caller: LAUNCH_CALLER | string
  ): Observable<ComponentRef<any>> | void {
    if (this.shouldRender(caller, config)) {
      const contentInjector = Injector.create({
        providers: [],
      });

      const componentRef = createComponent(config.component, {
        environmentInjector: this.injector.get(ApplicationRef).injector,
        elementInjector: contentInjector,
      });

      this.injector.get(ApplicationRef)?.attachView(componentRef.hostView);

      this.renderer.appendChild(
        this.hostComponent?.location.nativeElement,
        componentRef.location.nativeElement
      );

      if (config?.dialogType) {
        this.applyClasses(componentRef, config?.dialogType);
      }

      this.renderedCallers.push({ caller, component: componentRef });

      return of(componentRef);
    }
  }

  hasMatch(config: LaunchInlineRootDialog) {
    return Boolean(config.inlineRoot);
  }
}
