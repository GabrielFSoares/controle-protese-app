import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { app } from '../firebaseConfig';
import { getFirestore, collection, query, getDocs, where, orderBy, updateDoc, doc } from "firebase/firestore";
import { ModalController } from '@ionic/angular';
import { ModalNoteComponent } from '../components/modal-note/modal-note.component';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential, updateEmail } from "firebase/auth";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastController } from '@ionic/angular';


const db = getFirestore(app)

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

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
  public password: string
  public confirmPassword: string
  public newPassword: string
  public email: string
  public newEmail: string

  constructor( 
    public router: Router, 
    public modalController: ModalController, 
    private modalService: NgbModal,
    public toastController: ToastController
  ) { }

  public user: string

  ngOnInit() {

    this.user = localStorage.getItem('user')
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

  logout() {
    this.router.navigateByUrl('/login')
  }

  open(content) {
    this.modalService.open(content, { centered: true })

    const auth = getAuth()
    const user = auth.currentUser
    this.email = user.email
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

  async openMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  update(i:string) {
    const auth = getAuth()
    const user = auth.currentUser
    const credential = EmailAuthProvider.credential(user.email, this.password)

    reauthenticateWithCredential(user, credential).then(() => {
      console.log('Usuário reautenticado')

      if(i == 'email' && this.newEmail != undefined && this.newEmail != '') {
        updateEmail(user, this.newEmail).then(() => {
          const userRef = doc(db, "Usuarios", user.uid)

          updateDoc(userRef, {
            email: this.newEmail
          })
          
          this.modalService.dismissAll()
          this.newEmail = ""
          this.password = ""
          this.openMessage('Alteração realizada com sucesso!')
        }).catch((error) => {
          console.log(error)
          this.openMessage('Erro ao alterar email.')
        })
      }

      if(i == 'password') {
        if(this.newPassword === this.confirmPassword) {
          updatePassword(user, this.newPassword).then(() => {
          this.password = ""
          this.newPassword = ""
          this.confirmPassword = ""
          this.modalService.dismissAll()
          this.openMessage('Alteração realizada com sucesso!')
        }).catch((erro) => {
          console.log(erro)
          this.openMessage('Erro ao alterar senha')
        })
        } else {
          this.openMessage('Senhas não coincidem')
        }
      }
    }).catch((error) => {
        this.openMessage('Senha incorreta! Tente novamente')
        //this.password = ""
        //throw 'Senha incorreta'
      })    
  }
}