import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ToastyService } from 'ng2-toasty';
import { PessoaService } from './../pessoa.service';

import { Pessoa } from './../../core/model';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();

  constructor(
    private pessoaService: PessoaService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Nova Pessoa');

    const idPessoa = this.route.snapshot.params['id'];
    if (idPessoa) {
      this.carregarPessoa(idPessoa);
    }
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(id: number) {
    this.pessoaService.buscarPorCodigo(id)
      .then(pessoa => {
        this.pessoa = pessoa;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: NgForm){
    if (this.editando){
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: NgForm) {
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoaAdicionada => {
        this.toasty.success('Pessoa adicionada com sucesso!');

        //form.reset();
        //this.pessoa = new Pessoa();
        this.router.navigate(['/pessoas/', pessoaAdicionada.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarPessoa(form: NgForm) {
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa;
        this.toasty.success('Pessoa atualizada com sucesso!');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: NgForm){
    form.reset();
    setTimeout( function() {
      this.pessoa = new Pessoa();
    }.bind(this), 1);

    this.router.navigate(['/pessoas/novo']);
  }

  atualizarTituloEdicao(){
    this.title.setTitle(`Edição de Pessoa: ${this.pessoa.nome}`);
  }

}
