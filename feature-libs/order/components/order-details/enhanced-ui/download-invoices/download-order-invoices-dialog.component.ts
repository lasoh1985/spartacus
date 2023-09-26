import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { Order, OrderOutlets } from '@spartacus/order/root';
import { InvoicesListComponent } from '@spartacus/pdf-invoices/components';
import { PDFInvoicesFacade } from '@spartacus/pdf-invoices/root';
import { ICON_TYPE, FocusConfig } from '@spartacus/storefront';
import { LaunchDialogService } from '@spartacus/storefront';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cx-download-invoices-dialog',
  templateUrl: './download-order-invoices-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadOrderInvoicesDialogComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  protected subscription = new Subscription();
  @ViewChild(InvoicesListComponent, { static: false })
  public invoiceComponent: InvoicesListComponent;
  readonly OrderOutlets = OrderOutlets;
  invoiceCount: number | undefined = undefined;
  iconTypes = ICON_TYPE;
  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: true,
    focusOnEscape: true,
  };
  order: Order;
  constructor(
    protected launchDialogService: LaunchDialogService,
    protected invoicesFacade: PDFInvoicesFacade,
    protected cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data: Order) => {
        this.order = data;
      })
    );
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
    if (this.invoiceComponent.pagination !== undefined) {
      this.invoiceCount = this.invoiceComponent.pagination.totalResults;
    }
  }

  close(reason?: any, _message?: string): void {
    this.launchDialogService.closeDialog(reason);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}