/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { IconModule, SpinnerModule } from '@spartacus/storefront';
import { StoreScheduleComponent } from './store-schedule/index';
import { StoreComponent } from './store.component';

@NgModule({
  imports: [CommonModule, I18nModule, IconModule, SpinnerModule],
  exports: [StoreComponent, StoreScheduleComponent],
  declarations: [StoreComponent, StoreScheduleComponent],
})
export class StoreModule {}
