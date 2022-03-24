import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../services/usuario/autenticacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
})
export class CadastrarPage implements OnInit {

  public user: string
  public password: string
  public email: string

  constructor(public autenticacaoService: AutenticacaoService, public router: Router) { }

  ngOnInit() {}

  register() {
    this.autenticacaoService.createUser(this.email, this.password, this.user)
  }

}