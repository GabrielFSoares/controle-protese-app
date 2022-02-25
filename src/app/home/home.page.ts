import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { app } from '../firebaseConfig';
import { getFirestore, collection, query, getDocs, where } from "firebase/firestore";
import { ModalController } from '@ionic/angular';
import { ModalNoteComponent } from '../components/modal-note/modal-note.component';

const db = getFirestore(app)

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public modalRef: BsModalRef
  public noteNumber: number
  public patient: string
  public doctor: string
  public provider: string
  public serie: number
  public date: string
  public issueDate: string
  public movements =[]
  public movement: string
  public docId = []
  public itens = []
  public doctorList = []
  public providerList = []
  public loadNote = false

  constructor(private modalService: BsModalService, public router: Router, public modalController: ModalController) { }

  ngOnInit() {
    this.movementsLoad()

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

  openModal(template: TemplateRef<any>, i: number) {
    this.modalRef = this.modalService.show(template, 
      { 
        class: 'm-0 modal-xl',
        backdrop: 'static',
      })

    console.log(this.docId[i])
  }

  navigate(route:string) {
    this.router.navigateByUrl(`/${route}`)
  }

  consulta() {
    console.log(this.noteNumber)
    console.log(this.patient)
    console.log(this.doctor)
    console.log(this.provider)
    console.log(this.date)
  }

  async movementsLoad() {
    const q = query(collection(db, "NotaFiscal"))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      this.movements.push(doc.data()) 
      this.docId.push(doc.id)
     
      let obj = doc.data().item
      let index = Object.keys(obj)
      let arr = []

      for(let i=0; i<index.length; i++) {
        arr.push(doc.data().item[i].serie)
      }

      this.itens.push(arr)
    })

    if(this.movements.length != 0) {
      this.loadNote = true 
    }
  }

  async presentModal(i: number) {
    const modal = await this.modalController.create({
      component: ModalNoteComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'idNota': this.docId[i]
      }
    });
    return await modal.present();
  }

  async test() {
    const notesRef = collection(db, "NotaFiscal")

    let filter = query(notesRef)

    if(this.noteNumber != undefined && this.noteNumber != null) {
      filter = query(filter, where("numNota", "==", this.noteNumber))
    }

    if(this.provider != undefined && this.provider != '') {
      filter = query(filter, where("fornecedor", "==", this.provider))
    }

    if(this.patient != undefined && this.patient != '') {
      filter = query(filter, where("paciente", "==", this.patient))
    }

    if(this.doctor != undefined && this.doctor != '') {
      filter = query(filter, where("medico", "==", this.doctor))
    }

    if(this.movement != undefined && this.movement != '') {
      filter = query(filter, where("movimentacao", "==", this.movement))
    }

    /*if(this.serie != undefined && this.serie != null) {
      filter = query(filter, where("item.0.serie", "==", this.serie))
    }*/

    const querySnapshot = await getDocs(filter)

    querySnapshot.forEach((doc) => {
      console.log(doc.data())
    })
  }
}
