import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { app } from '../firebaseConfig';
import { getFirestore, collection, query, getDocs } from "firebase/firestore";

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
  public date: string
  public movements: any
  public docId: any
  public itens: any

  constructor(private modalService: BsModalService, public router: Router) { }

  ngOnInit() {
    this.movementsLoad()
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, 
      { 
        class: 'modal-dialogue-centered modal-xl',
        backdrop: 'static',
      })
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
    
    this.movements = []
    this.docId = []
    this.itens = []

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
  }

  openNote(id) {
    console.log(this.docId[id])
  }
}
