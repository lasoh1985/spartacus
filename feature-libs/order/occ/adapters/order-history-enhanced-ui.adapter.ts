/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConverterService, OccEndpointsService } from '@spartacus/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OrderEntry } from '@spartacus/cart/base/root';
import {
  Order,
  Consignment,
  OrderHistoryList,
  ReturnRequestList,
  OrderHistory,
  ReplenishmentOrder,
} from '@spartacus/order/root';
import { OccOrderHistoryAdapter } from './occ-order-history.adapter';

@Injectable({ providedIn: 'root' })
export class OrderHistoryEnhancedUIAdapter extends OccOrderHistoryAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {
    super(http, occEndpoints, converter);
  }
  completedValues = ['DELIVERY_COMPLETED', 'PICKUP_COMPLETE'];
  cancelledValues = ['CANCELLED'];
  /**
   * fills the tracking information for each consignment in the input order details
   * @param userId user id
   * @param order order details with consignments
   * @returns order details along with tracking information for each of it's consignments
   */
  fillConsignmentTrackingDetails(
    userId: string,
    order: Order
  ): Observable<Order> {
    const requests = order.consignments?.map((consignment: Consignment) => {
      if (consignment.code && consignment.trackingID) {
        return this.getConsignmentTracking(
          order?.code ?? '',
          consignment.code,
          userId
        ).pipe(
          map((trackingInfo) => {
            consignment.tracking = trackingInfo;
            return order;
          })
        );
      } else {
        return of(order);
      }
    });
    if (requests === undefined || requests.length < 1) {
      return of(order);
    }
    return forkJoin(requests).pipe(
      switchMap((requests: Order[] | undefined) => {
        if (requests !== undefined) {
          return of(requests[0]);
        } else {
          return of(order);
        }
      })
    );
  }

  /**
   * This method overrides the load method from OccOrderHistoryAdapter.
   * Returns order details along with tracking information of each of it's consignments for an
   * order code.
   * @param userId user id
   * @param orderCode  order code
   * @returns order details
   */
  public load(userId: string, orderCode: string): Observable<Order> {
    return super.load(userId, orderCode).pipe(
      switchMap((order: Order) => {
        return this.fillConsignmentTrackingDetails(userId, order);
      })
    );
  }

  /**
   * This method overrides the loadHistory method from OccOrderHistoryAdapter.
   * Returns order history list with returns details filled in each order.
   * @param userId user id
   * @param pageSize no.of items in a page
   * @param currentPage current page number
   * @param sort sort order
   * @returns order history list
   */
  public loadHistory(
    userId: string,
    pageSize?: number,
    currentPage?: number,
    sort?: string
  ): Observable<OrderHistoryList> {
    const orderHistoryListRequest = this.loadOrderHistoryWithDetails(
      userId,
      pageSize,
      currentPage,
      sort
    );
    const returnRequestListRequest = this.loadReturnRequestList(userId);
    return forkJoin([orderHistoryListRequest, returnRequestListRequest]).pipe(
      switchMap((responses: [OrderHistoryList, ReturnRequestList]) => {
        var returnRequests = responses[1].returnRequests;
        var orderHistory = responses[0];
        if (returnRequests && orderHistory.orders) {
          return orderHistory.orders.map((order) => {
            const returnItems = returnRequests?.filter(
              (returnItem) => returnItem.order?.code === order.code
            );
            if (returnItems) {
              order.returnRequests = returnItems;
            }
            return orderHistory;
          });
        } else {
          return of(orderHistory);
        }
      })
    );
  }

  /**
   * Returns order history list with more order details filled in each order.
   * @param userId user id
   * @param pageSize no.of items in a page
   * @param currentPage current page number
   * @param sort sort order
   * @returns order history list
   */
  loadOrderHistoryWithDetails(
    userId: string,
    pageSize?: number,
    currentPage?: number,
    sort?: string
  ): Observable<OrderHistoryList> {
    return super.loadHistory(userId, pageSize, currentPage, sort).pipe(
      switchMap((orderList: OrderHistoryList) => {
        const requests = orderList.orders?.map((order: OrderHistory) => {
          return this.load(userId, order?.code ?? '').pipe(
            map((orderDetail) => {
              /** filling extra fields ---> */

              // filling images
              order.thumbnail = [];
              if (orderDetail?.entries) {
                for (let item of orderDetail?.entries) {
                  if (item.product?.images) {
                    order.thumbnail.push(item.product?.images);
                  }
                }
              }

              //filling unconsignedEntries
              order.unconsignedEntries = [];
              if (orderDetail?.unconsignedEntries) {
                for (let entry of orderDetail?.unconsignedEntries) {
                  order.unconsignedEntries.push(entry);
                }
              }

              //filling deliveryConsignments
              order.deliveryConsignments =
                this.getGroupedConsignments(orderDetail, false) ?? [];

              //filling pickupConsignments
              order.pickupConsignments =
                this.getGroupedConsignments(orderDetail, true) ?? [];

              //filling pickupUnconsignedEntries
              order.pickupUnconsignedEntries =
                this.getUnconsignedEntries(order, true) ?? [];

              //filling deliveryUnConsignedEntries
              order.deliveryUnconsignedEntries =
                this.getUnconsignedEntries(order, false) ?? [];

              //filling an empty return request array
              order.returnRequests = [];

              /** filling extra fields <--- */
              return orderList;
            })
          );
        });
        return forkJoin(requests);
      }),
      map((requests: OrderHistoryList[] | undefined) => {
        if (requests !== undefined) {
          return requests[0];
        } else {
          return {};
        }
      })
    );
  }

  /** CHECK WHERE ELSE CAN U PLACE THESE METHODS WITHOUT DUPLICATING AND WITHOUT AFFECTING BUILD */
  getGroupedConsignments(
    order: Order,
    pickup: boolean
  ): Consignment[] | undefined {
    const consignments = pickup
      ? order.consignments?.filter(
          (consignment) => consignment.deliveryPointOfService !== undefined
        )
      : order.consignments?.filter(
          (consignment) => consignment.deliveryPointOfService === undefined
        );

    return this.groupConsignments(consignments);
  }

  getUnconsignedEntries(
    order: Order,
    pickup: boolean
  ): OrderEntry[] | undefined {
    if ((order as ReplenishmentOrder).replenishmentOrderCode) {
      return [];
    }
    return pickup
      ? order.unconsignedEntries?.filter(
          (entry) => entry.deliveryPointOfService !== undefined
        )
      : order.unconsignedEntries?.filter(
          (entry) => entry.deliveryPointOfService === undefined
        );
  }

  protected groupConsignments(
    consignments: Consignment[] | undefined
  ): Consignment[] | undefined {
    const grouped = consignments?.reduce((result, current) => {
      const key = this.getStatusGroupKey(current.status || '');
      result[key] = result[key] || [];
      result[key].push(current);
      return result;
    }, {} as { [key: string]: Consignment[] });

    return grouped
      ? [...(grouped[1] || []), ...(grouped[0] || []), ...(grouped[-1] || [])]
      : undefined;
  }

  /**
   * complete: 0
   * processing: 1
   * cancel: -1
   */
  private getStatusGroupKey(status: string): number {
    if (this.completedValues.includes(status)) {
      return 0;
    }
    if (this.cancelledValues.includes(status)) {
      return -1;
    }
    return 1;
  }
}