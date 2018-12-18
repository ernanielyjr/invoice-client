import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Responses } from '../model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    private http: HttpClient
  ) { }

  public getInvoice(invoiceId: string) {
    return this.http.get<Responses.InvoiceResult>(`${environment.baseUrl}/v1/payment/${invoiceId}`);
  }

}
