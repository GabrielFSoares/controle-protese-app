import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Input } from '@angular/core';
import { app } from '../../firebaseConfig';
import { getFirestore, getDoc, doc } from "firebase/firestore";

const db = getFirestore(app)

@Component({
  selector: 'app-modal-note',
  templateUrl: './modal-note.component.html',
  styleUrls: ['./modal-note.component.scss']
})

export class ModalNoteComponent implements OnInit {

  @Input() idNota: string

  public serie: number
  public volume: number
  public product: string
  public date: any
  public issueDate: any
  public patient: string
  public doctor: string
  public movement: string
  public provider: string
  public noteNumber: number
  public itens: any

  constructor(public modalController: ModalController) {  }

  ngOnInit() {
    this.loadInfo()
  }

  async loadInfo() {
    const docRef= doc(db, "NotaFiscal", this.idNota)
    const docSnap = await getDoc(docRef);

    this.noteNumber = docSnap.data().numNota,
    this.provider = docSnap.data().fornecedor,
    this.doctor = docSnap.data().medico,
    this.patient = docSnap.data().paciente,
    this.issueDate = docSnap.data().dataEmissao,
    this.date = docSnap.data().dataMovimento,
    this.itens = this.itens,
    this.movement = docSnap.data().movimentacao
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
