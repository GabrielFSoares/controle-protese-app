import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { app } from '../firebaseConfig';
import { getFirestore, collection, addDoc, query, where, getDocs, getDoc, doc, deleteDoc } from "firebase/firestore"
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
  selector: 'app-saida',
  templateUrl: './saida.page.html',
  styleUrls: ['./saida.page.scss'],
})
export class SaidaPage implements OnInit {

  public product: string
  public serie: number
  public volume: number
  public patient: string
  public doctor: string
  public idNota: string
  public conf: boolean
  public itens = {}
  public movement: string
  public outputDate: any
  public docId: string
  public notaFiscal: NotaFiscal
  public confirm: boolean

  constructor(public router: Router, public toastController: ToastController) { }

  ngOnInit() {
    this.product = "PRÓTESE DE MAMA"
    localStorage.setItem('itemSaida', '1')
  }

  async noteOutput() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    this.outputDate = year + '-' + month + '-' + day
    this.movement = "Saída"

    let storage = parseInt(localStorage.getItem('itemSaida')) 

    this.confirm = true

    for(let i=1; i<=storage; i++) {
      if((<HTMLSelectElement>document.getElementById('serie'+i.toString())).value == '' || (<HTMLSelectElement>document.getElementById('volume'+i.toString())).value == '') {
        this.confirm = false 
      } 
    }

    if((<HTMLSelectElement>document.getElementById('patient')).value == '' || (<HTMLSelectElement>document.getElementById('doctor')).value == '') {
      this.confirm = false 
    }
 
    if(this.confirm) {
      for(let j=0, i=1; i<=storage; i++, j++) {
        let serie = (<HTMLSelectElement>document.getElementById('serie'+i.toString())).value
        let volume = (<HTMLSelectElement>document.getElementById('volume'+i.toString())).value
  
        this.itens[j] = {
          'descricao': this.product,
          'serie': serie,
          'volume': volume,
        }
  
        let q = query(collection(db, "Estoque"), where("serie", "==", this.itens[j].serie.toString()))
        const querySnapshot = await getDocs(q)  
  
        querySnapshot.forEach((docc) => {
          deleteDoc(doc(db, "Estoque", docc.id))
          console.log('chegou')
        })
      }
  
      const docRef= doc(db, "NotaFiscal", this.idNota)
      const docSnap = await getDoc(docRef)
  
      this.notaFiscal = {
        numNota: docSnap.data().numNota,
        fornecedor: docSnap.data().fornecedor,
        medico: docSnap.data().medico,
        paciente: docSnap.data().paciente,
        dataEmissao: docSnap.data().dataEmissao,
        dataMovimento: this.outputDate,
        item: this.itens,
        movimentacao: this.movement
      }
  
      const docRef2 = await addDoc(collection(db, "NotaFiscal"), this.notaFiscal)
    } else {
      this.openMessage('Preencha todos os campos')
    }
  }

  addItem() {
    let id = parseInt(localStorage.getItem('itemSaida')) + 1
    localStorage.setItem('itemSaida', id.toString())

    let divMom = document.getElementById('itensOut')

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
      let storage = parseInt(localStorage.getItem('itemSaida'))
      localStorage.setItem('itemSaida', (storage-1).toString())
    })

    divRow.appendChild(divCol3)
    divCol3.appendChild(icon)
  }

  async loadInfo() {
    const q = query(collection(db, "Estoque"), where("serie", "==", this.serie.toString()))
    const querySnapshot = await getDocs(q)  
    console.log(querySnapshot.docChanges())

    querySnapshot.forEach((doc) => {
      this.idNota = doc.data().idNota
      this.volume = doc.data().volume
      this.conf = true
    })

    if(this.conf) {
      const docRef= doc(db, "NotaFiscal", this.idNota)
      const docSnap = await getDoc(docRef)

      this.patient = docSnap.data().paciente
      this.doctor = docSnap.data().medico
      
      this.conf = false
    }
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
}
