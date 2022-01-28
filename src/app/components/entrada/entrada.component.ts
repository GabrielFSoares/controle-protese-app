import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface NotaFiscal {
  numNota: number
  lote: string
  fornecedor: string
  medico: string
  paciente: string
  dataEmissao: any 
  dataEntrada: any
}

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.scss'],
})

export class EntradaComponent implements OnInit {

  public noteNumber: number
  public lot: string
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
    this.notaFiscal = {
      numNota: this.noteNumber,
      lote: this.lot,
      fornecedor: this.provider,
      medico: this.doctor,
      paciente: this.patient,
      dataEmissao: this.issueDate,
      dataEntrada: this.entryDate
    }
    console.log(this.notaFiscal)
    console.log(this.noteNumber)
  }

  cancel() {
    this.router.navigateByUrl('/home')
  }

}
