/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { ConfiguratorFormComponent } from './configurator-form.component';
import { ConfiguratorDefaultFormModule } from '../default-form/configurator-default-form.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    I18nModule,
    NgSelectModule,
    ConfiguratorDefaultFormModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ConfiguratorForm: {
          component: ConfiguratorFormComponent,
        },
      },
    }),
  ],
  declarations: [ConfiguratorFormComponent],
  exports: [ConfiguratorFormComponent],
})
export class ConfiguratorFormModule {}
