import { TestBed } from '@angular/core/testing';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { PointOfService } from '@spartacus/core';
import { Order, OrderFacade } from '@spartacus/order/root';
import { PickupLocationsSearchFacade } from '@spartacus/pickup-in-store/root';
import { DeliveryPointOfServiceItems } from 'feature-libs/pickup-in-store/root/model';
import { Observable, of } from 'rxjs';
import { DeliveryPointsService } from './delivery-points.service';

class MockActiveCartFacade {
  getActive(): Observable<Cart> {
    const CART: Cart = {
      entries: [
        { deliveryPointOfService: { name: 'A Store' } },
        { deliveryPointOfService: { name: 'B Store' } },
        {},
      ],
    };
    return of(CART);
  }
}
class MockPickupLocationsSearchFacade {
  loadStoreDetails(): void {}
  getStoreDetails(): Observable<PointOfService> {
    const POINT_OF_SERVICE: PointOfService = {};
    return of(POINT_OF_SERVICE);
  }
}
export class DeliveryPointsServiceMock {
  getDeliveryPointsOfServiceFromCart(): Observable<Array<DeliveryPointOfServiceItems>> {
    return of([]);
  }
}

export class MockOrderFacade {
  getOrderDetails(): Observable<Order> {
    const ORDER: Order = {
      entries: [
        { deliveryPointOfService: { name: 'A Store' } },
        { deliveryPointOfService: { name: 'B Store' } },
        {},
      ],
    };
    return of(ORDER);
  }
}
describe('DeliveryPointsService', () => {
  let deliveryPointsService: DeliveryPointsService;
  let activeCartFacade: ActiveCartFacade;
  let pickupLocationsSearchService: PickupLocationsSearchFacade;
  let orderFacade: OrderFacade;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActiveCartFacade, useClass: MockActiveCartFacade },
        { provide: OrderFacade, useClass: MockOrderFacade },
        {
          provide: PickupLocationsSearchFacade,
          useClass: MockPickupLocationsSearchFacade,
        },
      ],
    });

    deliveryPointsService = TestBed.inject(DeliveryPointsService);
    activeCartFacade = TestBed.inject(ActiveCartFacade);
    pickupLocationsSearchService = TestBed.inject(PickupLocationsSearchFacade);
    orderFacade = TestBed.inject(OrderFacade);

    spyOn(activeCartFacade, 'getActive').and.callThrough();
    spyOn(pickupLocationsSearchService, 'loadStoreDetails').and.callThrough();
    spyOn(pickupLocationsSearchService, 'getStoreDetails').and.callThrough();
    spyOn(orderFacade, 'getOrderDetails').and.callThrough();
  });

  it('should be created', () => {
    expect(deliveryPointsService).toBeDefined();
  });

  it('getDeliveryPointsOfServiceFromCart should return: Observable<Array<DeliveryPointOfServiceItems>> ', () => {
    deliveryPointsService.getDeliveryPointsOfServiceFromCart().subscribe();

    expect(activeCartFacade.getActive).toHaveBeenCalled();
    expect(pickupLocationsSearchService.loadStoreDetails).toHaveBeenCalledTimes(
      2
    );
    expect(pickupLocationsSearchService.loadStoreDetails).toHaveBeenCalledWith(
      'A Store'
    );

    expect(pickupLocationsSearchService.loadStoreDetails).toHaveBeenCalledWith(
      'B Store'
    );
    expect(pickupLocationsSearchService.getStoreDetails).toHaveBeenCalledTimes(
      2
    );
    expect(pickupLocationsSearchService.getStoreDetails).toHaveBeenCalledWith(
      'A Store'
    );
    expect(pickupLocationsSearchService.getStoreDetails).toHaveBeenCalledWith(
      'B Store'
    );
  });

  it('getDeliveryPointsOfServiceFromCart should return: Observable<Array<DeliveryPointOfServiceItems>> ', () => {
    deliveryPointsService.getDeliveryPointsOfServiceFromOrder().subscribe();

    expect(orderFacade.getOrderDetails).toHaveBeenCalled();
    expect(pickupLocationsSearchService.loadStoreDetails).toHaveBeenCalledTimes(
      2
    );
    expect(pickupLocationsSearchService.loadStoreDetails).toHaveBeenCalledWith(
      'A Store'
    );

    expect(pickupLocationsSearchService.loadStoreDetails).toHaveBeenCalledWith(
      'B Store'
    );
    expect(pickupLocationsSearchService.getStoreDetails).toHaveBeenCalledTimes(
      2
    );
    expect(pickupLocationsSearchService.getStoreDetails).toHaveBeenCalledWith(
      'A Store'
    );
    expect(pickupLocationsSearchService.getStoreDetails).toHaveBeenCalledWith(
      'B Store'
    );
  });
});