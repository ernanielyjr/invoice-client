import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Pagseguro, Responses } from '../../model';
import { InvoiceService } from '../../services/invoice.service';
import { PaymentService } from '../../services/payment.service';

/* tslint:disable-next-line:function-name */
declare function PagSeguroLightbox(paymentCode: string): void;
/* tslint:disable-next-line:function-name */
declare function PagSeguroLightbox(options: Pagseguro.Options, callbacks: Pagseguro.Callbacks): void;
declare var PagSeguroDirectPayment;

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

  public paymentMode = '';
  public paymentLoading = false;
  public invoice: Responses.Invoice;
  public showHelp = false;
  public loading = false;
  public amountSum = 0;
  public error = '';

  constructor(
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
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

            /* TODO: verificar se é necessário
            if (this.invoice.amount <= 0) {
              this.invoice.amount = 0;
            }

            for (const posting of this.invoice.postings) {
              if (posting.type === 'balance' && posting.amount < 0) {
                posting.amount = 0;
              }
            }
            */

            this.paymentMode = res.result.paymentMode;
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

  public newBillet() {
    const warning = [
      'Atenção: Cuidado para não gerar pagamentos duplicados.',
      'Utilize esta opção somente caso tenha perdido o boleto já gerado ou se o boleto atual estiver vencido.',
      '\n\nDeseja gerar um novo boleto?',
    ];

    if (!confirm(warning.join(' '))) {
      return;
    }
    this.pay();
  }

  public pay() {
    this.paymentLoading = true;

    if (this.paymentMode === 'credit_card') {
      this.paymentService
        .getCode(this.invoice._id)
        .pipe(
          tap((res) => {
            const paymentCode = res.result;

            const isMobile = /Android|iPhone/i.test(window.navigator.userAgent);
            if (isMobile) {
              window.location.href = `https://pagseguro.uol.com.br/v2/checkout/payment.html?code=${paymentCode}`;
              return;
            }

            PagSeguroLightbox({
              code: paymentCode
            }, {
              success: () => {
                this.paymentLoading = false;
                this.loadInvoice();
              },
              abort: () => {
                this.paymentLoading = false;
                this.showHelp = true;
                this.ref.detectChanges();
              }
            });
          }),
          catchError((err) => {
            this.showHelp = true;
            alert('Algo deu errado, tente novamente. Se o problema persistir entre em contato conosco!');
            return of(null);
          }),
          finalize(() => this.paymentLoading = false)
        )
        .subscribe();

    } else {
      this.paymentService
        .getSessionId()
        .pipe(
          mergeMap(res => new Observable<string>((observer) => {
            PagSeguroDirectPayment.setSessionId(res.result);
            PagSeguroDirectPayment.onSenderHashReady((response) => {
              if (response.status === 'error') {
                return observer.error(response);
              }

              observer.next(response.senderHash);
              observer.complete();
            });
          })),
          mergeMap(senderHash => this.paymentService.getBillet(this.invoice._id, senderHash)),
          tap((response) => {
            const billetWin = window.open(response.result);
            if (!billetWin) {
              alert('Certifique-se que seu bloqueador de popup não impediu a abertura do boleto!');
            }
            this.loadInvoice();
          }),
          catchError((err) => {
            this.showHelp = true;
            alert('Algo deu errado, tente novamente. Se o problema persistir entre em contato conosco!');
            return of(null);
          }),
          finalize(() => this.paymentLoading = false)
        )
        .subscribe();
    }
  }

  public setPaymentMode(mode: string) {
    this.paymentMode = mode;
    this.showHelp = false;
  }

}
