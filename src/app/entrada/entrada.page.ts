import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { app } from '../firebaseConfig';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

const db = getFirestore(app)

interface NotaFiscal {
  numNota: number
  fornecedor: string
  medico: string
  paciente: string
  dataEmissao: any 
  dataMovimento: any
  item: any
  movimentacao: string
}

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
})
export class EntradaPage implements OnInit {

  public formNote: FormGroup

  public serie: number
  public volume: number
  public product: string
  public entryDate: any
  public notaFiscal: NotaFiscal
  public itens = {}
  public movement: string
  public confirm: boolean

  constructor(public router: Router, private fb: FormBuilder, public toastController: ToastController,) { }

  ngOnInit() {
    this.product = "PRÓTESE DE MAMA"
    localStorage.setItem('item', '1')

    this.formNote = this.fb.group({
      noteNumber: ['', Validators.required],
      provider: ['', Validators.required],
      issueDate: ['', Validators.required],
      patient: ['', Validators.required],
      doctor: ['', Validators.required],
    })
  }

  async noteEntry() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    let storage = parseInt(localStorage.getItem('item'))

    this.confirm = true

    for(let i=1; i<=storage; i++) {
      if((<HTMLSelectElement>document.getElementById('serie'+i.toString())).value == '' || (<HTMLSelectElement>document.getElementById('volume'+i.toString())).value == '') {
        this.confirm = false 
      } 
    }

    if(!this.formNote.valid) {
      this.confirm = false
    }

    if(this.confirm) {
      for(let j=0, i=1; i<=storage; i++, j++) {
        let serie = (<HTMLSelectElement>document.getElementById('serie'+i.toString())).value
        let volume = (<HTMLSelectElement>document.getElementById('volume'+i.toString())).value
        console.log(serie)
        this.itens[j] = {
          'descricao': this.product,
          'serie': serie,
          'volume': volume,
        }
      }

      this.movement = "Entrada"
      this.entryDate = year + '-' + month + '-' + day 

      this.notaFiscal = {
        numNota: this.formNote.value.noteNumber,
        fornecedor: this.formNote.value.provider,
        medico: this.formNote.value.doctor,
        paciente: this.formNote.value.patient,
        dataEmissao: this.formNote.value.issueDate,
        dataMovimento: this.entryDate,
        item: this.itens,
        movimentacao: this.movement
      }

      const docRef = await addDoc(collection(db, "NotaFiscal"), this.notaFiscal)

      let docRefId = docRef.id

      for(let i=0; i<storage; i++) {
        this.itens[i].idNota = docRefId

        let docRef2 = addDoc(collection(db, "Estoque"), this.itens[i])
      }
    } else {
      this.openMessage('Preencha todos os campos')
    }
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
    divCol2.className = 'col-4'

    let inputCol2 = document.createElement('input')
    inputCol2.className = 'form-control'
    inputCol2.placeholder = 'Volume'
    inputCol2.type = 'number'
    inputCol2.id = 'volume'+id.toString()

    divRow.appendChild(divCol2)
    divCol2.appendChild(inputCol2)

    let divCol3 = document.createElement('div')
    divCol3.className = 'col-4 text-end'
    divCol3.id = 'icon' + id.toString()

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

    divRow.appendChild(divCol3)
    divCol3.appendChild(icon)
  }

  cancel() {
    this.router.navigateByUrl('/home')
  }

  async openMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }
}