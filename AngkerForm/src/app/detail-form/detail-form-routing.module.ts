import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailFormPage } from './detail-form.page';

const routes: Routes = [
  {
    path: '',
    component: DetailFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailFormPageRoutingModule {}
