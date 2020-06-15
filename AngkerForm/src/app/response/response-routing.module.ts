import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponsePage } from './response.page';

const routes: Routes = [
  {
    path: '',
    component: ResponsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponsePageRoutingModule {}
