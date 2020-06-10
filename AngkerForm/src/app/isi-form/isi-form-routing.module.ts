import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsiFormPage } from './isi-form.page';

const routes: Routes = [
  {
    path: '',
    component: IsiFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IsiFormPageRoutingModule {}
