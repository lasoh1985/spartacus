import { TestBed } from '@angular/core/testing';
import { QuoteCoreConfig } from '@spartacus/quote/core';
import {
  OccQuote,
  Quote,
  QuoteActionType,
  QuoteCartService,
  QuoteState,
} from '@spartacus/quote/root';
import {
  createEmptyQuote,
  QUOTE_CODE,
} from '../../core/testing/quote-test-utils';
import { OccQuoteActionNormalizer } from './occ-quote-action-normalizer';
import { of } from 'rxjs';

const SUBMIT_AND_CANCEL_UNORDERED = [
  QuoteActionType.SUBMIT,
  QuoteActionType.CANCEL,
];

const SUBMIT_EDIT_CANCEL_UNORDERED = [
  QuoteActionType.SUBMIT,
  QuoteActionType.EDIT,
  QuoteActionType.CANCEL,
];

let isQuoteCartActive: any;
let quoteId: any;
class MockQuoteCartService {
  isQuoteCartActive() {
    return of(isQuoteCartActive);
  }
  getQuoteId() {
    return of(quoteId);
  }
}

describe('OccQuoteActionNormalizer', () => {
  let service: OccQuoteActionNormalizer;
  let occQuote: OccQuote;
  let expectedQuote: Quote;
  let quoteCoreConfig: QuoteCoreConfig;

  beforeEach(() => {
    initTestData();
    TestBed.configureTestingModule({
      providers: [
        OccQuoteActionNormalizer,
        { provide: QuoteCoreConfig, useValue: quoteCoreConfig },
        { provide: QuoteCartService, useClass: MockQuoteCartService },
      ],
    });

    service = TestBed.inject(OccQuoteActionNormalizer);
    isQuoteCartActive = false;
    quoteId = '';
  });

  function initTestData() {
    occQuote = {
      ...createEmptyQuote(),
      allowedActions: SUBMIT_AND_CANCEL_UNORDERED,
      state: QuoteState.BUYER_DRAFT,
    };
    expectedQuote = {
      ...occQuote,
      allowedActions: [
        { type: QuoteActionType.CANCEL, isPrimary: false },
        { type: QuoteActionType.SUBMIT, isPrimary: true },
      ],
      isEditable: false,
    };
    quoteCoreConfig = {
      quote: {
        actions: {
          actionsOrderByState: {
            BUYER_DRAFT: [
              QuoteActionType.CANCEL,
              QuoteActionType.EDIT,
              QuoteActionType.SUBMIT,
            ],
          },
          primaryActions: [QuoteActionType.SUBMIT],
        },
      },
    };
  }

  it('should inject OccQuoteActionNormalizer', () => {
    expect(service).toBeDefined();
  });

  describe('convert', () => {
    it('should convert OccQuote to Quote', () => {
      const result = service.convert(occQuote);
      expect(result).toEqual(expectedQuote);
    });

    it('should set isEditable to false if edit is allowed by backend but quote cart has not been loaded', () => {
      occQuote.allowedActions = [QuoteActionType.EDIT];
      expect(service.convert(occQuote).isEditable).toBe(false);
    });

    it('should set isEditable to true if edit is allowed by backend and quote cart has been loaded', () => {
      isQuoteCartActive = true;
      quoteId = occQuote.code;
      occQuote.allowedActions = [QuoteActionType.EDIT];
      expect(service.convert(occQuote).isEditable).toBe(true);
    });

    it('should set isEditable to false if edit is allowed by backend, but would require status change', () => {
      occQuote.allowedActions = [QuoteActionType.EDIT];
      (quoteCoreConfig.quote?.actions?.actionsOrderByState ?? {}).BUYER_DRAFT =
        [QuoteActionType.EDIT];
      expect(service.convert(occQuote).isEditable).toBe(false);
    });

    it('should set isEditable to false in case occ does not return allowedActions', () => {
      occQuote.allowedActions = undefined;
      expect(service.convert(occQuote).isEditable).toBe(false);
    });

    it('should set allowedActions in quote to empty array in case occ does not return allowedActions', () => {
      occQuote.allowedActions = undefined;
      expect(service.convert(occQuote).allowedActions).toEqual([]);
    });
  });

  describe('getOrderedActions', () => {
    it('should return sorted list according to config', () => {
      const orderedActions = service['getOrderedActions'](
        QuoteState.BUYER_DRAFT,
        SUBMIT_AND_CANCEL_UNORDERED,
        QUOTE_CODE
      );
      expect(orderedActions).toEqual([
        QuoteActionType.CANCEL,
        QuoteActionType.SUBMIT,
      ]);
    });
    it('should return unsorted list if no quote config is given', () => {
      quoteCoreConfig.quote = undefined;
      const orderedActions = service['getOrderedActions'](
        QuoteState.BUYER_DRAFT,
        SUBMIT_AND_CANCEL_UNORDERED,
        QUOTE_CODE
      );
      expect(orderedActions).toEqual(SUBMIT_AND_CANCEL_UNORDERED);
    });
    it('should return unsorted list if no actions are defined in the config', () => {
      (quoteCoreConfig?.quote ?? {}).actions = undefined;
      const orderedActions = service['getOrderedActions'](
        QuoteState.BUYER_DRAFT,
        SUBMIT_AND_CANCEL_UNORDERED,
        QUOTE_CODE
      );
      expect(orderedActions).toEqual(SUBMIT_AND_CANCEL_UNORDERED);
    });

    it('should return unsorted list if no actions by state are defined in the config', () => {
      (quoteCoreConfig.quote?.actions ?? {}).actionsOrderByState = undefined;
      const orderedActions = service['getOrderedActions'](
        QuoteState.BUYER_DRAFT,
        SUBMIT_AND_CANCEL_UNORDERED,
        QUOTE_CODE
      );
      expect(orderedActions).toEqual(SUBMIT_AND_CANCEL_UNORDERED);
    });

    it('should retain edit action in case no quote cart is present', () => {
      const orderedActions = service['getOrderedActions'](
        QuoteState.BUYER_DRAFT,
        SUBMIT_EDIT_CANCEL_UNORDERED,
        QUOTE_CODE
      );
      expect(orderedActions).toEqual([
        QuoteActionType.CANCEL,
        QuoteActionType.EDIT,
        QuoteActionType.SUBMIT,
      ]);
    });

    it('should remove edit action in case quote cart is linked to current quote', () => {
      isQuoteCartActive = true;
      quoteId = QUOTE_CODE;
      const orderedActions = service['getOrderedActions'](
        QuoteState.BUYER_DRAFT,
        SUBMIT_EDIT_CANCEL_UNORDERED,
        QUOTE_CODE
      );
      expect(orderedActions).toEqual([
        QuoteActionType.CANCEL,
        QuoteActionType.SUBMIT,
      ]);
    });
  });

  describe('getActionCategory', () => {
    const SUBMIT_NOT_PRIMARY_ACTION = {
      type: QuoteActionType.SUBMIT,
      isPrimary: false,
    };
    it('should set isPrimary to true if action is defined as primary in the config', () => {
      const actualResult = service['getActionCategory'](QuoteActionType.SUBMIT);
      expect(actualResult).toEqual({
        type: QuoteActionType.SUBMIT,
        isPrimary: true,
      });
    });
    it('should set isPrimary to false action is not defined as primary in the config', () => {
      const actualResult = service['getActionCategory'](QuoteActionType.CANCEL);
      expect(actualResult).toEqual({
        type: QuoteActionType.CANCEL,
        isPrimary: false,
      });
    });
    it('should set isPrimary to false if no quote config is given', () => {
      quoteCoreConfig.quote = undefined;
      const actualResult = service['getActionCategory'](QuoteActionType.SUBMIT);
      expect(actualResult).toEqual(SUBMIT_NOT_PRIMARY_ACTION);
    });
    it('should set isPrimary to false if no actions are defined in the config', () => {
      (quoteCoreConfig?.quote ?? {}).actions = undefined;
      const actualResult = service['getActionCategory'](QuoteActionType.SUBMIT);
      expect(actualResult).toEqual(SUBMIT_NOT_PRIMARY_ACTION);
    });
    it('should set isPrimary to false if no primaryActions are defined in the config', () => {
      (quoteCoreConfig?.quote?.actions ?? {}).primaryActions = undefined;
      const actualResult = service['getActionCategory'](QuoteActionType.SUBMIT);
      expect(actualResult).toEqual(SUBMIT_NOT_PRIMARY_ACTION);
    });
  });
});