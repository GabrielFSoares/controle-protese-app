import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { app } from '../firebaseConfig';
import { getFirestore, collection, addDoc } from "firebase/firestore"

const db = getFirestore(app)

interface NotaFiscal {
  numNota: number
  serie: string
  fornecedor: string
  medico: string
  paciente: string
  dataEmissao: any 
  dataEntrada: any
}

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
})
export class EntradaPage implements OnInit {

  public noteNumber: number
  public serie: string
  public provider: string
  public doctor: string
  public patient: string
  public issueDate: any
  public entryDate: any
  public notaFiscal: NotaFiscal

  constructor(public router: Router) { }

  ngOnInit() {
    
  }

  noteEntry() {

    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    this.entryDate = day + '/' + month + '/' + year


    console.log(this.entryDate)

    this.notaFiscal = {
      numNota: this.noteNumber,
      serie: this.serie,
      fornecedor: this.provider,
      medico: this.doctor,
      paciente: this.patient,
      dataEmissao: this.issueDate,
      dataEntrada: this.entryDate
    }

    const docRef = addDoc(collection(db, "NotaFiscal"), this.notaFiscal)
  }

  cancel() {
    this.router.navigateByUrl('/home')
  }
}
