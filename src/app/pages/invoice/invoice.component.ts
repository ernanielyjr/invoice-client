import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  public invoice: Responses.Invoice;

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(
          params => this.invoiceService.getInvoice(params.get('invoiceId'))
        ),
        tap((invoice) => {
          this.invoice = invoice;
        })
      )
      .subscribe();
  }

}
