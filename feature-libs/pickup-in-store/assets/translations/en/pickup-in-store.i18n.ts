/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/** Translation keys for the PickupInfoComponent */
export const pickupInfo = {
  inStorePickup: 'In Store Pickup',
  pickupBy: 'Pick up by',
  pickupFrom: 'Pick up from',
};

/** Translation keys for the PickupOptionDialogComponent */
export const pickupOptionDialog = {
  close: 'Close',
  modalHeader: 'Pickup in Store',
};

/** Translation keys for the PickupOptionsComponent */
const pickupOptions = {
  changeStore: 'Change Store',
  delivery: 'Ship It (Free Return)',
  pickup: 'Free Pickup In Store',
  selectStore: 'Select Store',
};

/** Translation keys for the SetPreferredStoreComponent */
export const setPreferredStore = {
  makeThisMyStore: 'Make This My Store',
  myStore: 'My Store',
};

/** Translation keys for the StoreComponent */
export const store = {
  pickupFromHere: 'Pick Up from here',
  stockLevel_inStock: '{{ count }} in Stock',
  stockLevel_outOfStock: 'Out of Stock',
  viewHours: 'View Hours',
};

/** Translation keys for the StoreListComponent */
export const storeList = {
  noStoresMessage: 'No stores found in database...',
};

/** Translation keys for the StoreScheduleComponent */
export const storeSchedule = {
  closed: 'Closed',
  storeHours: 'Store hours',
};

/** Translation keys for the StoreSearchComponent */
export const storeSearch = {
  findAStore: 'Find a Store',
  findStores: 'Find Stores',
  hideOutOfStockOptions: 'Hide out of stock options',
  searchPlaceholder: 'Enter Zip Code, Town or Address',
  useMyLocation: 'Use my location',
  viewAllStores: 'View all stores',
};
/** Translation keys for the AddressBook PickupInStoreComponent */

export const addressBookPickupInStore = {
  heading: 'Pick-Up Store',
};

/** Translation keys for Preferred Store on Store Finder Page */

export const storeFinderPickupInStore = {
  heading: 'My Store',
};

/** Translation keys for Pickup In Store In Checkout */

export const checkoutPickupInStore = {
  heading: 'Items to be Picked Up',
  storeItemHeading: 'Pick Up Store Address',
};

export const cartItems = {
  item: 'Item',
};

/** All the translation chunks for pickup in store. */
export const pickupInStore = {
  pickupInfo,
  pickupOptionDialog,
  pickupOptions,
  setPreferredStore,
  store,
  storeList,
  storeSchedule,
  storeSearch,
  addressBookPickupInStore,
  storeFinderPickupInStore,
  checkoutPickupInStore,
  cartItems,
};