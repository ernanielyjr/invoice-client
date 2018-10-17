import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Pagseguro, Responses } from '../../model';
import { InvoiceService } from '../../services/invoice.service';

declare function PagSeguroLightbox(paymentCode: string): void;
declare function PagSeguroLightbox(options: Pagseguro.Options, callbacks: Pagseguro.Callbacks): void;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  private monthNames = [
    '',
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  public invoice: Responses.Invoice;
  public showHelp = false;
  public loading = false;
  public amountSum = 0;
  public error = '';

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadInvoice();
  }

  private loadInvoice() {
    this.error = '';
    this.loading = true;
    this.route.paramMap
      .pipe(
        switchMap(
          params => this.invoiceService.getInvoice(params.get('invoiceId'))
        ),
        catchError((err) => {
          this.error = (err && err.error && err.error.result) || err.error || err;
          return of(null as Responses.InvoiceResult);
        }),
        tap((res) => {
          if (res) {
            this.invoice = res.result;
            this.amountSum = this.invoice.postings.reduce((sum, posting) => sum + posting.amount, 0);
          }
          this.loading = false;
          this.ref.detectChanges();
        }),
      )
      .subscribe();
  }

  public getMonthYear(invoice: Responses.Invoice): string {
    return `${this.monthNames[invoice.month]}/${invoice.year}`;
  }

  public getDueDate(invoice: Responses.Invoice): string {
    const day = (`0${invoice.day}`).substr(-2);
    const month = (`0${invoice.month + 1}`).substr(-2);
    return `${day}/${month}/${invoice.year}`;
  }

  public pay(paymentCode: string) {
    PagSeguroLightbox({
      code: paymentCode
    }, {
      success: () => {
        this.loadInvoice();
      },
      abort: () => {
        this.showHelp = true;
        this.ref.detectChanges();
      }
    });
  }

}
