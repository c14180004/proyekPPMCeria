import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IsiFormPageRoutingModule } from './isi-form-routing.module';

import { IsiFormPage } from './isi-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IsiFormPageRoutingModule
  ],
  declarations: [IsiFormPage]
})
export class IsiFormPageModule {}
