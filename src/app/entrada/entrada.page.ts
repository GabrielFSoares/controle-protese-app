import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { app } from '../firebaseConfig';
import { getFirestore, collection, addDoc } from "firebase/firestore"

const db = getFirestore(app)

interface NotaFiscal {
  numNota: number
  fornecedor: string
  medico: string
  paciente: string
  dataEmissao: any 
  dataEntrada: any
  item: any
}

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
})
export class EntradaPage implements OnInit {

  public noteNumber: number
  public serie: number
  public volume: number
  public product: string
  public quantitie: number
  public provider: string
  public doctor: string
  public patient: string
  public issueDate: any
  public entryDate: any
  public notaFiscal: NotaFiscal

  constructor(public router: Router) { }

  ngOnInit() {
    this.product = "PRÓTESE DE MAMA"
    localStorage.setItem('item', '1')
  }

  noteEntry() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    this.entryDate = day + '-' + month + '-' + year

    this.notaFiscal = {
      numNota: this.noteNumber,
      fornecedor: this.provider,
      medico: this.doctor,
      paciente: this.patient,
      dataEmissao: this.issueDate,
      dataEntrada: this.entryDate,
      item: [{
        serie: this.serie,
        volume: this.volume,
        quantidade: this.quantitie,
        descricao: this.product
      }]
    }

    const docRef = addDoc(collection(db, "NotaFiscal"), this.notaFiscal)
  }

  addItem() {
    /*if(localStorage.getItem('item') == '1') {
      localStorage.setItem('item', '2')
    } else {
      let itens = parseInt(localStorage.getItem('item'))
      localStorage.setItem('item', (itens+1).toString())
    }*/
    
    let id = parseInt(localStorage.getItem('item')) + 1
    let divItem = document.getElementById('itens')
    let innerDiv = '<div id="'+id+'"><select class="form-select"><option selected>'+this.product+'</option></select><div class="row my-2"><div class="col-4"><input class="form-control" type="number" [(ngModel)]="serie" placeholder="Número de série"></div><div class="col-3"><input class="form-control" type="number" [(ngModel)]="volume" placeholder="Volume"></div><div class="col-3"><input class="form-control" type="number" [(ngModel)]="quantitie" placeholder="Quantidade"></div><div class="col-2 text-end"><ion-icon class="text-danger" name="trash" id="remove" size="large"></ion-icon></div></div></div>'

    divItem.innerHTML += innerDiv

    localStorage.setItem('item', id.toString())

    document.getElementById('add').addEventListener("click", () => {
      this.addItem()
    })

    document.getElementById('remove').addEventListener("click", () => {
      this.removeItem(id)
    })
  }

  removeItem(id) {
    document.getElementById(id).remove()
    localStorage.setItem('item', (id-1).toString())

    document.getElementById('add').addEventListener("click", () => {
      this.addItem()
    })

    document.getElementById('remove').addEventListener("click", () => {
      this.removeItem(id)
    })
  }

  cancel() {
    this.router.navigateByUrl('/home')
  }
}
