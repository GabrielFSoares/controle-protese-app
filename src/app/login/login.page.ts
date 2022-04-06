import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../services/usuario/autenticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public user: string
  public password: string

  constructor(public autenticacaoService: AutenticacaoService) { }

  ngOnInit() {
    localStorage.removeItem('user')
  }

  login() {
    if(this.user != '' && this.user != undefined && this.password != '' && this.password != undefined) {
      this.user = this.user.toLowerCase().split(" ").join("")
      this.autenticacaoService.loginFirebase(this.user, this.password)
    } else {
      console.log('Preencha os campos')
    }
  }
}
