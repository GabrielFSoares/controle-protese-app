import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalNoteComponent } from '../components/modal-note/modal-note.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    ModalModule.forRoot()
  ],
  exports: [ModalModule],
  declarations: [HomePage, ModalNoteComponent]
})
export class HomePageModule {}
