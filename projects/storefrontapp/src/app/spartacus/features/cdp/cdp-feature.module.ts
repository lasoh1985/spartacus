/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CdpLoginModule } from 'integration-libs/cdp/user-account/cdp-login/cdp-login.module';
// import { CdcConfig, CdcRootModule, CDC_FEATURE } from '@spartacus/cdc/root';
// import { CmsConfig, provideConfig } from '@spartacus/core';

@NgModule({
  imports: [CdpLoginModule],
  // providers: [
  //   provideConfig(<CdcConfig>{
  //     component: [
  //       {
  //         LoginComponent: 'electronics-spa'
  //       }
  //     ]
  //   })
  // ],
})
export class CdpFeatureModule {}
