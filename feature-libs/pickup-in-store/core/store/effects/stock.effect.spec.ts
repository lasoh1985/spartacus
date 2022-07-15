import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { normalizeHttpError } from '@spartacus/core';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { StockConnector } from '../../connectors/index';
import {
  StockLevel,
  StockLevelFail,
  StockLevelSuccess,
} from '../actions/stock.action';
import { StockEffect } from './stock.effect';

class MockStockConnector {
  loadStockLevels = () => of({});
}

describe('StockEffect', () => {
  let stockEffects: StockEffect;
  let actions$: Observable<any>;
  let stockConnector: StockConnector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({})],

      providers: [
        {
          provide: StockConnector,
          useClass: MockStockConnector,
        },
        StockEffect,

        provideMockActions(() => actions$),
      ],
    });

    stockEffects = TestBed.inject(StockEffect);
    stockConnector = TestBed.inject(StockConnector);
  });

  it('should call the connector on the StockLevel action and create success action', () => {
    spyOn(stockConnector, 'loadStockLevels').and.callThrough();
    const action = new StockLevel({ productCode: 'P0001' });
    const actionSuccess = new StockLevelSuccess({
      productCode: 'P0001',
      stockLevels: {},
    });

    actions$ = hot('-a', { a: action });
    const expected = cold('-(b)', { b: actionSuccess });

    expect(stockEffects.loadStockLevels$).toBeObservable(expected);
    expect(stockConnector.loadStockLevels).toHaveBeenCalledWith('P0001', {});
  });

  it('should create a fail action on connector error', () => {
    const error = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: 'Error',
    });
    spyOn(stockConnector, 'loadStockLevels').and.returnValue(throwError(error));
    const action = new StockLevel({ productCode: 'P0001' });
    const actionFail = new StockLevelFail(normalizeHttpError(error));

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: actionFail });

    expect(stockEffects.loadStockLevels$).toBeObservable(expected);
  });
});
