import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../services/usuario/autenticacao.service';
import { Router } from '@angular/router';
import { app } from '../firebaseConfig';
import { getFirestore, collection, query, where, getDocs, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { AlertController } from '@ionic/angular';

const db = getFirestore(app)
const auth = getAuth()

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public user: string
  public password: string

  constructor(public autenticacaoService: AutenticacaoService, public router: Router, public alertController: AlertController) { }

  ngOnInit() {
    localStorage.removeItem('user')
  }

  async login() {
    if(this.user != '' && this.user != undefined && this.password != '' && this.password != undefined) {
      let email = ''
      let btn = document.getElementById('btnLogin')
      btn.setAttribute('disabled', '')

      this.user = this.user.toLowerCase().split(" ").join("")
      
      const q = query(collection(db, "Usuarios"), where("usuario", "==", this.user))
      const querySnapshot = await getDocs(q)  

      querySnapshot.forEach((doc) => {
        email = doc.data().email
      })

      if(email != '') {
        this.autenticacaoService.loginFirebase(this.user, email, this.password, btn)
      } else {
        this.presentAlert('Usuário não existe')
        btn.removeAttribute('disabled')
      }
    } else {
      console.log('Preencha os campos')
    }
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present()
  }
}
