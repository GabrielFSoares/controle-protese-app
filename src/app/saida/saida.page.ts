import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { app } from '../firebaseConfig';
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { Observable, Subject, of } from 'rxjs';

const db = getFirestore(app)

interface NotaFiscal {
  numNota: number
  fornecedor: string
  medico: string
  paciente: string
  dataEmissao: any 
  dataSaida: any
  item: any
  movimentacao: string
}

@Component({
  selector: 'app-saida',
  templateUrl: './saida.page.html',
  styleUrls: ['./saida.page.scss'],
})
export class SaidaPage implements OnInit {

  public product: string
  private allInfo: Observable<any>;

  constructor(public router: Router) { }

  ngOnInit() {
    this.product = "PRÓTESE DE MAMA"
    localStorage.setItem('itemSaida', '1')
  }

  async noteOutput() {
    const q = query(collection(db, "Estoque"))
    const querySnapshot = await getDocs(q)
    let itens = []
    let i = 0

    let fs = querySnapshot.docChanges()

    //querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data())
    //itens[i] = doc.data().item[0].serie
    //i++

    //console.log(doc)
    //})

    console.log(fs)
  }

  addItem() {
    let id = parseInt(localStorage.getItem('itemSaida')) + 1
    localStorage.setItem('itemSaida', id.toString())

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

  loadInfo() {
    console.log('TEste')
  }

  cancel() {
    this.router.navigateByUrl('/home')
  }

}
