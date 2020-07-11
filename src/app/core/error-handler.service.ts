import { ToastyService } from 'ng2-toasty';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toasty: ToastyService) { }

  handle(errorResponse: any){
    let msg: string;

    if (typeof errorResponse === 'string'){
      msg = errorResponse;

    } else if (errorResponse instanceof Response && errorResponse.status >= 400 && errorResponse.status <= 499) {
      let errors;

      msg = 'Ocorreu um erro ao processar a sua solicitação';

      try {
        errors = errorResponse;
        msg = errors[0].mensagemUsuario;

      } catch (e) { }

      console.error('Ocorreu um erro', errorResponse);

    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
    }

    this.toasty.error(msg);
  }
}
