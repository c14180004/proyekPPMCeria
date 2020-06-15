import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResponsePageRoutingModule } from './response-routing.module';

import { ResponsePage } from './response.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResponsePageRoutingModule
  ],
  declarations: [ResponsePage]
})
export class ResponsePageModule {}
