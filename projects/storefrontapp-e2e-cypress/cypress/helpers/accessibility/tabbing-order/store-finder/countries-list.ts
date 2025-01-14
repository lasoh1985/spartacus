/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { verifyTabbingOrder } from '../../tabbing-order';
import { TabElement } from '../../tabbing-order.model';

const containerSelector = '.StoreFinderPageTemplate';

export function countriesListTabbingOrder(config: TabElement[]) {
  cy.visit('/store-finder/view-all');

  cy.intercept({
    method: 'GET',
    path: `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
      'BASE_SITE'
    )}/stores/storescounts*`,
  }).as('storesCounts');

  cy.wait('@storesCounts');
  verifyTabbingOrder(containerSelector, config);
}
