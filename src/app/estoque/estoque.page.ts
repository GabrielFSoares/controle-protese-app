import { Component, OnInit } from '@angular/core';
import { app } from '../firebaseConfig';
import { getFirestore, collection, query, getDocs, where, orderBy, updateDoc, doc } from "firebase/firestore";

const db = getFirestore(app)

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.page.html',
  styleUrls: ['./estoque.page.scss'],
})
export class EstoquePage implements OnInit {

  public itens = []
  public loadNote: boolean
  public serie: number

  constructor() { }

  ngOnInit() {
    this.itensLoad()
  }

  async itensLoad() {
    const notesRef = query(collection(db, "Estoque"))
    let search = notesRef

    this.itens = []

    if(this.serie != null) {
      search = query(collection(db, "Estoque"), where("serie", "==", this.serie.toString()))
    }

    const querySnapshot = await getDocs(search)

    querySnapshot.forEach((doc) => {  
      this.itens.push(doc.data())
    }) 

    if(this.itens.length == 0) {
      this.loadNote = false
    } else {
      this.loadNote = true
    }
  }
}
