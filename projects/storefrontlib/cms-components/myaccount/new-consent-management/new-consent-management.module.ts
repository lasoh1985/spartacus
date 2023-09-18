/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { IconModule } from '../../misc/icon/icon.module';
import { NewConsentManagementComponent } from './components/new-consent-management.component';
import { NewConsentManagementFormComponent } from './components/consent-form/new-consent-management-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    I18nModule,
    IconModule,
  ],
  declarations: [
    NewConsentManagementComponent,
    NewConsentManagementFormComponent,
  ],
  exports: [NewConsentManagementComponent, NewConsentManagementFormComponent],
})
export class NewConsentManagementModule {}
