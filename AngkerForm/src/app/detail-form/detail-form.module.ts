import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailFormPageRoutingModule } from './detail-form-routing.module';

import { DetailFormPage } from './detail-form.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailFormPageRoutingModule,
    SharedModule
  ],
  declarations: [DetailFormPage]
})
export class DetailFormPageModule {}
