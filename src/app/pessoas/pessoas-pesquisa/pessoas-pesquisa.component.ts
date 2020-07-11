import { Component, ViewChild, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Table } from 'primeng/table';
import { ToastyService } from 'ng2-toasty';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';

import { PessoaFiltro, PessoaService } from './../pessoa.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {
  totalRegistros = 0;
  lancamentos = [];
  filtro = new PessoaFiltro();
  @ViewChild('tabela', {static: true}) grid: Table;

  pessoas = [];

  constructor(
    private service: PessoaService,
    private errorHandler: ErrorHandlerService,
    private toasty: ToastyService,
    private confirmationService: ConfirmationService,
    private title: Title){}

  ngOnInit(): void {
    this.title.setTitle("Pesquisa de Pessoas");
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.service.pesquisar(this.filtro)
    .then(resultado => {
      this.totalRegistros = resultado.total;
      this.pessoas = resultado.pessoas;
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(pessoa: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.service.excluir(pessoa.codigo)
    .then(
      () => {
        this.grid.reset();
        this.toasty.success('Pessoa excluida com sucesso!');
      })
    .catch(erro => this.errorHandler.handle(erro));
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    this.service.mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.toasty.success(`Pessoa ${acao} com sucesso!`);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

}
