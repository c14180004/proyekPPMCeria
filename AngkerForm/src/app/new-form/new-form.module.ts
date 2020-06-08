import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewFormPageRoutingModule } from './new-form-routing.module';

import { NewFormPage } from './new-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewFormPageRoutingModule
  ],
  declarations: [NewFormPage]
})
export class NewFormPageModule {}
