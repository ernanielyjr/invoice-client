import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Responses } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient
  ) { }

  public getCode(invoiceId: string) {
    return this.http.get<Responses.PaymentCodeResult>(`${environment.baseUrl}/v1/payment/${invoiceId}/code`);
  }

  public getSessionId() {
    return this.http.get<Responses.PaymentSessionResult>(`${environment.baseUrl}/v1/payment/session-id`);
  }

  public getBillet(invoiceId: string, senderHash: string) {
    return this.http.post<Responses.PaymentBilletResult>(`${environment.baseUrl}/v1/payment/${invoiceId}/billet`, {
      senderHash
    });
  }

}
