import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';

const routes: Routes = [{
  path: 'invoice/:invoiceId',
  component: InvoiceComponent
}, {
  path: '',
  component: ForbiddenComponent,
}, {
  path: '**',
  redirectTo: '/',
  pathMatch: 'prefix',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
