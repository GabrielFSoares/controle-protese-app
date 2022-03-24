import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { app } from '../firebaseConfig';
import { getFirestore, collection, query, getDocs, where, orderBy } from "firebase/firestore";
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
  public filterSerie = false

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

  navigate(route:string) {
    this.router.navigateByUrl(`/${route}`)
  }

  async movementsLoad() {
    const notesRef = query(collection(db, "NotaFiscal"))
    let filter = query(notesRef)

    if(this.issueDate != undefined && this.issueDate != '') {
      filter = query(notesRef, where("dataEmissao", "==", this.issueDate))
    } else {
      filter = query(notesRef, orderBy('dataEmissao', 'desc'))
    }

    if(this.noteNumber != undefined && this.noteNumber != null) {
      filter = query(filter, where("numNota", "==", this.noteNumber))
    }

    if(this.provider != undefined && this.provider != '') {
      filter = query(filter, where("fornecedor", "==", this.provider))
    }

    if(this.doctor != undefined && this.doctor != '') {
      filter = query(filter, where("medico", "==", this.doctor))
    }

    if(this.movement != undefined && this.movement != '') {
      filter = query(filter, where("movimentacao", "==", this.movement))
    }

    if(this.date != undefined && this.date != '') {
      filter = query(filter, where("dataMovimento", "==", this.date))
    }

    if(this.serie != undefined && this.serie != null) {
      this.filterSerie = true
    }

    const querySnapshot = await getDocs(filter)

    this.movements = []
    this.loadNote = false
    this.docId = []
    this.itens = []

    querySnapshot.forEach((doc) => {     
      let obj = doc.data().item
      let index = Object.keys(obj)
      let arr = []

      if(this.filterSerie) {
        for(let i=0; i<index.length; i++) {
          if(doc.data().item[i].serie == this.serie) {
            for(let j=0; j<index.length; j++) {
              arr.push(doc.data().item[j].serie)
            }
            this.movements.push(doc.data()) 
            this.docId.push(doc.id)
            this.itens.push(arr)
          }
        }

      } else {
        for(let i=0; i<index.length; i++) {
          arr.push(doc.data().item[i].serie)
        }

        this.movements.push(doc.data()) 
        this.docId.push(doc.id)
        this.itens.push(arr)
      }
    })

    if(this.patient != undefined && this.patient != '') {
      let filterName = []

      this.patient = this.patient.toLowerCase()
      this.patient = this.patient[0].toUpperCase() + this.patient.substr(1)

      for(let i=0; i<this.movements.length; i++) {
        if(this.movements[i].paciente.indexOf(this.patient) > -1) {
          filterName.push(this.movements[i])
        }
      }

      this.movements = filterName
    }

    this.filterSerie = false

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
}