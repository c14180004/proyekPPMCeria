import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewFormPage } from './new-form.page';

const routes: Routes = [
  {
    path: '',
    component: NewFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewFormPageRoutingModule {}
