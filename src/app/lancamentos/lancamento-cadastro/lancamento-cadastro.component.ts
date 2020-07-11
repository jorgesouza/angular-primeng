import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LancamentoService } from './../lancamento.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Lancamento } from './../../core/model';

import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' }
  ];

  categorias = [];
  pessoas = [];

  lancamento = new Lancamento();

  constructor(
    private categoriaService: CategoriaService,
    private lancamentoService: LancamentoService,
    private pessoaService: PessoaService,
    private toasty: ToastyService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Novo Lançamento');

    const idLancamento = this.route.snapshot.params['id'];
    if (idLancamento) {
      this.carregarLancamento(idLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLancamento(id: number) {
    this.lancamentoService.buscarPorCodigo(id)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  salvar(form: NgForm){
    if (this.editando){
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: NgForm) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(lancamentoAdicionado => {
        this.toasty.success('Lançamento adicionado com sucesso!');
        //form.reset();
        //this.lancamento = new Lancamento();
        this.router.navigate(['/lancamentos/', lancamentoAdicionado.codigo]);

      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  atualizarLancamento(form: NgForm){
    this.lancamentoService.atualizar(this.lancamento)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.toasty.success('Lançamento atualizado com sucesso!');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map(c => {
          return {label: c.nome, value: c.codigo};
        });
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  carregarPessoas() {
    this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map(p => (
          { label: p.nome, value: p.codigo }
          ));
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  novo(form: NgForm){
    form.reset();
    setTimeout( function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao(){
    this.title.setTitle(`Edição de Lançamento: ${this.lancamento.descricao}`);
  }

}
