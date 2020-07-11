import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Table } from 'primeng/table';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  lancamentos = [];
  filtro = new LancamentoFiltro();
  @ViewChild('tabela', {static: true}) grid: Table;

  constructor(
    private service: LancamentoService,
    private errorHandler: ErrorHandlerService,
    private toasty: ToastyService,
    private confirmationService: ConfirmationService,
    private title: Title){}

  ngOnInit(): void {
    this.title.setTitle("Pesquisa de Lançamentos");
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.service.pesquisar(this.filtro)
    .then(resultado => {
      this.totalRegistros = resultado.total;
      this.lancamentos = resultado.lancamentos;
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(lancamento: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {
    this.service.excluir(lancamento.codigo)
    .then(
      () => {
        this.grid.reset();
        this.toasty.success('Lançamento excluido com sucesso!');
      })
    .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

}
