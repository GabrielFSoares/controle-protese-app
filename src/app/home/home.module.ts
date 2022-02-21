import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalEntryNoteComponent } from '../components/modal-entry-note/modal-entry-note.component';


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
  declarations: [HomePage, ModalEntryNoteComponent]
})
export class HomePageModule {}
