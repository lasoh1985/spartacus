import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { facadeFactory } from '@spartacus/core';
import { ORGANIZATION_ACCOUNT_SUMMARY_FEATURE } from '../feature-name';
import {
  AccountSummaryDetails,
  AccountSummaryList,
  DocumentQueryParams,
} from '../model/account-summary.model';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: AccountSummaryFacade,
      feature: ORGANIZATION_ACCOUNT_SUMMARY_FEATURE,
      methods: [
        'getAccountSummary',
        'getDocumentList',
        'getDocumentAttachment',
      ],
      async: true,
    }),
})
export abstract class AccountSummaryFacade {
  abstract getAccountSummary(): Observable<AccountSummaryDetails>;

  abstract getDocumentList(
    params: DocumentQueryParams
  ): Observable<AccountSummaryList>;

  abstract getDocumentAttachment(
    orgDocumentId?: string,
    orgDocumentAttachmentId?: string
  ): Observable<any>;
}
