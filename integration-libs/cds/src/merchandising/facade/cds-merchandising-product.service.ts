import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, mergeMap } from 'rxjs/operators';
import { MerchandisingUserContext, StrategyProducts, MerchandisingSiteContext } from '../model';
import { MerchandisingStrategyConnector } from '../connectors';
import { CdsMerchandisingSiteContextService } from './cds-merchandising-site-context.service';
import { CdsMerchandisingUserContextService } from './cds-merchandising-user-context.service';

@Injectable({
  providedIn: 'root',
})
export class CdsMerchandisingProductService {
  constructor(
    protected strategyConnector: MerchandisingStrategyConnector,
    protected merchandisingUserContextService: CdsMerchandisingUserContextService,
    protected merchandisingSiteContextService: CdsMerchandisingSiteContextService,
  ) {}

  loadProductsForStrategy(
    strategyId: string,
    numberToDisplay?: number
  ): Observable<StrategyProducts> {
    return combineLatest([
      this.merchandisingSiteContextService.getSiteContext(),
      this.merchandisingUserContextService.getUserContext(),
    ]).pipe(
      debounceTime(0),
      map((
        [siteContext, userContext,]: [
          MerchandisingSiteContext,
          MerchandisingUserContext,
        ]) => {
          return {
            queryParams: {
              ...siteContext,

              products: userContext.products,
              category: userContext.category,
              facets: userContext.facets,
              searchPhrase: userContext.searchPhrase,

              pageSize: numberToDisplay,
            },
            headers: {
              consentReference: userContext.consentReference,
            },
          };
        }
      ),
      mergeMap((context) => this.strategyConnector.loadProductsForStrategy(strategyId, context))
    );
  }
}
