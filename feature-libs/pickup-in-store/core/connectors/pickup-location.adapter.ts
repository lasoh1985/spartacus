import { PointOfService } from '@spartacus/core';
import { Observable } from 'rxjs';

/**
 * Adapter for getting store details.
 */
export abstract class PickupLocationAdapter {
  /**
   * Get the store details by store name.
   * @param storeName The store name to get details for
   */
  abstract getStoreDetails(storeName: string): Observable<PointOfService>;
}
