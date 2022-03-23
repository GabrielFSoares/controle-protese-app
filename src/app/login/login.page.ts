import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../services/usuario/autenticacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public user: string
  public password: string

  constructor(public autenticacaoService: AutenticacaoService, public router: Router) { }

  ngOnInit() {
  }

  login() {
    this.autenticacaoService.loginFirebase(this.user, this.password)
  }

}
