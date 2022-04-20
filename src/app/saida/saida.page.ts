import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { app } from '../firebaseConfig';
import { getFirestore, collection, addDoc, query, where, getDocs, getDoc, doc, deleteDoc } from "firebase/firestore"
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
  usuario: string
}

@Component({
  selector: 'app-saida',
  templateUrl: './saida.page.html',
  styleUrls: ['./saida.page.scss'],
})
export class SaidaPage implements OnInit {

  public product: string
  public serie: string
  public patient: string
  public doctor: string
  public idNota: string
  public conf: boolean
  public itens
  public movement: string
  public outputDate: any
  public docId: string
  public notaFiscal: NotaFiscal
  public confirm: boolean
  public doctorList = []
  public user: string
  public option: string
  public title: string
  public noteNumber: number

  constructor(
    public router: Router, 
    public toastController: ToastController, 
    public alertController: AlertController, 
    public route:ActivatedRoute
    ) {
    this.route.params.subscribe(params => this.option = params['id'])
  }

  ngOnInit() {
    if(this.option == "saida") {
      this.title = "Nova Saída"
      document.getElementById('formOut').className = 'd-block'
    } else if(this.option == "consumo") {
      this.title = "Consumo"
      document.getElementById('formConsu').className = 'd-block'
    }
    
    this.product = "PRÓTESE DE MAMA"
    localStorage.setItem('itemSaida', '1')
    this.user = localStorage.getItem('user')

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

    this.doctorList.sort()
  }

  async noteOutput() {
    let date = new Date()
    let day = ('0' + date.getDate()).slice(-2)
    let month = ('0' + (date.getMonth() + 1)).slice(-2)
    let year = date.getFullYear()

    this.outputDate = year + '-' + month + '-' + day
    this.itens = []
  
    let storage = parseInt(localStorage.getItem('itemSaida')) 

    this.confirm = true

    if(this.option == 'consumo') {
      for(let i=1; i<=storage; i++) {
        if((<HTMLSelectElement>document.getElementById('serie'+i.toString())).value == '') {
          this.confirm = false 
        } 
      }


      if(this.patient == '' || this.doctor == '') {
        this.confirm = false 
      }
    }

    if(this.option == 'saida') {
      this.movement = 'Saída'
    } else if(this.option == 'consumo') {
      this.movement = 'Consumo'
    }
    
    if(this.confirm) {
      for(let j=0, i=1; i<=storage; i++, j++) {
        let serie 
        let volume

        if(this.option == 'saida' && i == 1) {
          serie = (<HTMLSelectElement>document.getElementById('serie2'+i.toString())).value
          volume = (<HTMLSelectElement>document.getElementById('volume2'+i.toString())).value
        } else {
            serie = (<HTMLSelectElement>document.getElementById('serie'+i.toString())).value
            volume = (<HTMLSelectElement>document.getElementById('volume'+i.toString())).value
          }

        this.itens[j] = {
          'descricao': this.product,
          'serie': serie,
          'volume': volume,
        }
      }
      console.log(this.idNota)

      if(this.idNota !== undefined && this.idNota !== null) {
        const docRef= doc(db, "NotaFiscal", this.idNota)
        const docSnap = await getDoc(docRef)
 
        console.log(docSnap)

        let docId = []
        let compare = 0
    
        this.notaFiscal = {
          numNota: docSnap.data().numNota,
          fornecedor: docSnap.data().fornecedor,
          medico: this.doctor,
          paciente: this.patient,
          dataEmissao: docSnap.data().dataEmissao,
          dataMovimento: this.outputDate,
          item: this.itens,
          movimentacao: this.movement,
          usuario: this.user
        }

        for(let i=0; i<storage; i++) {
          let q = query(collection(db, "Estoque"), where("serie", "==", this.itens[i].serie.toString()))
          let querySnapshot = await getDocs(q)  

          if(querySnapshot.docChanges().length != 0) {
            querySnapshot.forEach((docc) => {
            //deleteDoc(doc(db, "Estoque", docc.id))
            docId[i] = docc.id
            compare++
            })
          }
        }
        console.log(compare, storage)
        if(compare == storage) {
          console.log(this.notaFiscal)
          const docRef2 = await addDoc(collection(db, "NotaFiscal"), this.notaFiscal)

          for(let i=0; i<docId.length; i++) {
            deleteDoc(doc(db, "Estoque", docId[i]))
          }

          this.presentAlert('Saída realizada com sucesso!')
          this.router.navigateByUrl('/home')
        } else {
          this.presentAlert('Um ou mais itens não correspondem ao estoque')
        }
      } else {
        this.presentAlert('Um ou mais itens não correspondem ao estoque')
      }
    } else {
      this.presentAlert('Preencha todos os campos')
    }
  }

  addItem() {    
    let id = parseInt(localStorage.getItem('itemSaida')) + 1
    localStorage.setItem('itemSaida', id.toString())

    let divMom

    if(this.option == 'saida') divMom= document.getElementById('itensOut')
    if(this.option == 'consumo') divMom = document.getElementById('itensConsu')

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
    divRow.className = "row my-3"

    div.appendChild(divRow)

    let divCol1 = document.createElement('div')
    divCol1.className = 'col-4'

    let ionItem1 = document.createElement('ion-item')

    let inputCol1 = document.createElement('ion-input')
    inputCol1.placeholder = 'Número de serie'
    inputCol1.type = 'number'
    if(this.option == 'saida') inputCol1.setAttribute('disabled', '')
    inputCol1.id = 'serie'+id.toString()
    inputCol1.addEventListener("keyup", () => {
      this.loadInfo(id)
    })

    divRow.appendChild(divCol1)
    divCol1.appendChild(ionItem1)
    ionItem1.appendChild(inputCol1)

    let divCol2 = document.createElement('div')
    divCol2.className = 'col-4'

    let ionItem2 = document.createElement('ion-item')

    let inputCol2 = document.createElement('ion-input')
    inputCol2.placeholder = 'Volume'
    inputCol2.type = 'number'
    if(this.option == 'saida') inputCol2.setAttribute('disabled', '')
    inputCol2.id = 'volume'+id.toString()

    divRow.appendChild(divCol2)
    divCol2.appendChild(ionItem2)
    ionItem2.appendChild(inputCol2)

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

  async loadInfo(id) {
    if(this.option == 'consumo') {
      this.serie = (<HTMLSelectElement>document.getElementById('serie'+id.toString())).value
      const q = query(collection(db, "Estoque"), where("serie", "==", this.serie))
      const querySnapshot = await getDocs(q)  
      console.log(querySnapshot.docChanges())
      //this.idNota = null

      querySnapshot.forEach((doc) => {
        this.idNota = doc.data().idNota;
        (<HTMLSelectElement>document.getElementById('volume'+id.toString())).value = doc.data().volume
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

    if(this.option == 'saida') {
      this.itens = []

      this.noteNumber = parseInt((<HTMLSelectElement>document.getElementById('note')).value)

      const q = query(collection(db, "NotaFiscal"), where("numNota", "==", this.noteNumber), where("movimentacao", "==", "Entrada"))
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach(async (doc) => {
        let obj = doc.data().item
        let index = Object.keys(obj)
        let arr = []

        this.idNota = doc.id
        this.patient = doc.data().paciente
        this.doctor = doc.data().medico

        for(let i=0; i<index.length; i++) {
          let q2 = query(collection(db, "Estoque"), where("serie", "==", doc.data().item[i].serie))
          let querySnapshot2 = await getDocs(q2)
          
          arr = []
          if(querySnapshot2.size != 0) {
            arr.push(doc.data().item[i].serie, doc.data().item[i].volume)
            this.itens.push(arr)
          }
        }
        this.loadItens()
      })

      if(querySnapshot.size == 0) this.loadItens()
    }
  }

  loadItens() {
    this.deleteItens();

    if(this.itens != 0) {
      (<HTMLSelectElement>document.getElementById('serie21')).value = this.itens[0][0];
      (<HTMLSelectElement>document.getElementById('volume21')).value = this.itens[0][1];
    }

    for(let i=1; i<this.itens.length; i++) {
      this.addItem();

      if(i != this.itens.length) {
        (<HTMLSelectElement>document.getElementById('serie'+(i+1).toString())).value = this.itens[i][0];
        (<HTMLSelectElement>document.getElementById('volume'+(i+1).toString())).value = this.itens[i][1]
      }
    }
  }

  cancel() {
    //this.deleteItens()
    this.router.navigateByUrl('/home')
  }

  deleteItens() {
    let storage = parseInt(localStorage.getItem('itemSaida'))
    let j = 1

    for(let i=1; i<storage; i++) {
      if(document.getElementById((j+1).toString())) {
        document.getElementById((j+1).toString()).remove()
      } else {
        i--
      }
      j++
    }

    (<HTMLSelectElement>document.getElementById('serie1')).value = null;
    (<HTMLSelectElement>document.getElementById('volume1')).value = null
    
    localStorage.setItem('itemSaida', '1')
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
