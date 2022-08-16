/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { PointOfServiceStock } from '@spartacus/core';

export function storeHasStock({ stockInfo }: PointOfServiceStock): boolean {
  return (
    !!stockInfo &&
    stockInfo.stockLevelStatus !== 'outOfStock' &&
    stockInfo.stockLevelStatus !== 'lowStock'
  );
}
