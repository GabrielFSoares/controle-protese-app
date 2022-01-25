import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public modalRef: BsModalRef
  public noteNumber: number
  public patient: string
  public doctor: string
  public provider: string
  public date: string

  constructor(private modalService: BsModalService) {}

  openModal(template) {
    this.modalRef = this.modalService.show(template)
  }

  consulta() {
    console.log(this.noteNumber)
    console.log(this.patient)
    console.log(this.doctor)
    console.log(this.provider)
    console.log(this.date)
  }
}
