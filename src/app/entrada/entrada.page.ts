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
  public itens = {}

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

    let storage = parseInt(localStorage.getItem('item'))

    for(let j=0, i=1; i<=storage; i++, j++) {
      let serie = (<HTMLSelectElement>document.getElementById('serie'+i.toString())).value
      let volume = (<HTMLSelectElement>document.getElementById('volume'+i.toString())).value
      let quantitie = (<HTMLSelectElement>document.getElementById('quantitie'+i.toString())).value

      if(j == null || j == undefined) {
        j = 0
      }

      this.itens[j] = {
        'descricao': this.product,
        'serie': serie,
        'volume': volume,
        'quantidade': quantitie
      }
    }

    console.log(this.itens)

    this.entryDate = day + '-' + month + '-' + year

    this.notaFiscal = {
      numNota: this.noteNumber,
      fornecedor: this.provider,
      medico: this.doctor,
      paciente: this.patient,
      dataEmissao: this.issueDate,
      dataEntrada: this.entryDate,
      item: this.itens
    }

    const docRef = addDoc(collection(db, "NotaFiscal"), this.notaFiscal)
  }

  addItem() {
    let id = parseInt(localStorage.getItem('item')) + 1
    localStorage.setItem('item', id.toString())

    let divMom = document.getElementById('itens')

    let div = document.createElement('div')
    div.id = id.toString()

    divMom.appendChild(div)

    let select = document.createElement('select')
    select.className = 'form-select'

    let option = document.createElement('option')
    option.innerHTML = this.product
    option.selected

    div.appendChild(select)
    select.appendChild(option)

    let divRow = document.createElement('div')
    divRow.className = "row my-2"

    div.appendChild(divRow)

    let divCol1 = document.createElement('div')
    divCol1.className = 'col-4'

    let inputCol1 = document.createElement('input')
    inputCol1.className = 'form-control'
    inputCol1.placeholder = 'Número de série'
    inputCol1.type = 'number'
    inputCol1.id = 'serie'+id.toString()

    divRow.appendChild(divCol1)
    divCol1.appendChild(inputCol1)

    let divCol2 = document.createElement('div')
    divCol2.className = 'col-3'

    let inputCol2 = document.createElement('input')
    inputCol2.className = 'form-control'
    inputCol2.placeholder = 'Volume'
    inputCol2.type = 'number'
    inputCol2.id = 'volume'+id.toString()

    divRow.appendChild(divCol2)
    divCol2.appendChild(inputCol2)

    let divCol3 = document.createElement('div')
    divCol3.className = 'col-3'

    let inputCol3 = document.createElement('input')
    inputCol3.className = 'form-control'
    inputCol3.placeholder = 'Quantidade'
    inputCol3.type = 'number'
    inputCol3.id = 'quantitie'+id.toString()

    divRow.appendChild(divCol3)
    divCol3.appendChild(inputCol3)

    let divCol4 = document.createElement('div')
    divCol4.className = 'col-2 text-end'
    divCol4.id = 'icon' + id.toString()

    let icon = document.createElement('ion-icon')
    icon.id = 'remove' + id.toString()
    icon.className = "text-danger"
    icon.name = "trash"
    icon.size = "large"
    icon.addEventListener("click", () => {
      document.getElementById(id.toString()).remove()
      let storage = parseInt(localStorage.getItem('item'))
      localStorage.setItem('item', (storage-1).toString())
    })

    divRow.appendChild(divCol4)
    divCol4.appendChild(icon)
  }

  cancel() {
    this.router.navigateByUrl('/home')
  }
}