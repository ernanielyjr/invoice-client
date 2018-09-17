import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { InvoiceService } from './services/invoice.service';

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
    InvoiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
