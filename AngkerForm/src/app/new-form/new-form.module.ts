import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewFormPageRoutingModule } from './new-form-routing.module';

import { NewFormPage } from './new-form.page';

import { FileSizeFormatPipe } from '../file-size-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewFormPageRoutingModule
  ],
  declarations: [NewFormPage,FileSizeFormatPipe]
})
export class NewFormPageModule {}
