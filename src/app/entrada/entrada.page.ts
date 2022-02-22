import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { app } from '../firebaseConfig';
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';

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
  public doctorList = []
  public providerList = []

  constructor(public router: Router, private fb: FormBuilder, public toastController: ToastController, public alertController: AlertController) { }

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

    this.doctorList = [
      'Marcelo Alonso',
      'Felipe Magno',
      'Marcio Teixeira',
      'Marcio Bistene',
      'Marcio Wallace',
      'Ramon Ramalho',
      'Orido Pinheiro',
      'Orido Felipe',
      'Acrysio Peixoto',
      'Eduardo Sucupira',
      'Fernando Serra',
      'Renata Wanick',
      'Flavia Dantas',
      'Sílvia Baima',
      'Roberta Alvares',
      'Guilherme Miranda',
      'Ricardo Cunha',
      'Adriano Medeiros',
      'José Horácio',
      'Horácio Gomes',
      'Renato Monteiro',
      'Gustavo Merheb',
      'George Soares',
      'George Mofoud',
      'Bruno Herkenhoff',
      'Ruben Bartz',
      'Bruno Anastácio'
    ]

    this.providerList = ['SILIMED', 'POLYTECH', 'MOTIVA', 'MENTOR']
  }

  async noteEntry() {
    let date = new Date()
    let day = ('0' + date.getDate()).slice(-2)
    let month = ('0' + date.getMonth() + 1).slice(-2)
    let year = date.getFullYear()

    let storage = parseInt(localStorage.getItem('item'))

    this.confirm = true

    for(let i=1; i<=storage; i++) {
      if((<HTMLSelectElement>document.getElementById('serie'+i.toString())).value == '') {
        this.confirm = false 
      } 
    }

    if(!this.formNote.valid) {
      this.confirm = false
    }

    if(this.confirm) {
      const q = query(collection(db, "NotaFiscal"), where("numNota", "==", this.formNote.value.noteNumber))
      const querySnapshot = await getDocs(q)  

      let serieExist = false

      for(let i=1; i<=storage; i++) {
        const q2 = query(collection(db, "Estoque"), where("serie", "==", (<HTMLSelectElement>document.getElementById('serie'+i.toString())).value))
        const querySnapshot2 = await getDocs(q2)

        console.log(querySnapshot2.size)

        if(querySnapshot2.size != 0) {
          serieExist = true
        }
      }

      if(querySnapshot.size != 0) {
        this.presentAlert('Nota já cadastrada')
      } else if(serieExist) {
          this.presentAlert('Número de série de um ou mais produtos já exixtem no estoque')
        } else {
            for(let j=0, i=1; i<=storage; i++, j++) {
              let serie = (<HTMLSelectElement>document.getElementById('serie'+i.toString())).value
              let volume = (<HTMLSelectElement>document.getElementById('volume'+i.toString())).value

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

            this.presentAlert('Entrada confirmada!')
            this.router.navigateByUrl('/home')
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
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}