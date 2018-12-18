import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import pt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { InvoiceService } from './services/invoice.service';
import { PaymentService } from './services/payment.service';

registerLocaleData(pt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
    InvoiceComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    InvoiceService,
    PaymentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
