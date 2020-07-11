import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { ToastyModule } from 'ng2-toasty';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { LancamentoService } from './../lancamentos/lancamento.service';
import { CategoriaService } from './../categorias/categoria.service';
import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './../seguranca/auth.service';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    ToastyModule.forRoot(),
    ConfirmDialogModule
  ],
  exports: [
    NavbarComponent,
    ToastyModule,
    ConfirmDialogModule
  ],
  providers: [
    LancamentoService,
    ErrorHandlerService,
    CategoriaService,
    AuthService,

    ConfirmationService,
    Title,
    { provide: LOCALE_ID, useValue: 'pt-BR'},
  ]
})
export class CoreModule { }
