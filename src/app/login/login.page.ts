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
  }

  login() {
    this.user = this.user.toLowerCase()
    this.autenticacaoService.loginFirebase(this.user, this.password)
  }

}
