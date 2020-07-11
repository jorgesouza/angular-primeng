import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-message',
  template: `
    <div *ngIf="hasError()" class="ui-messages ui-messages-error">
      {{ text }}
    </div>
  `,
  styles: [`
    .ui-messages-error {
      margin: 0;
      margin-top: 4px;
    }
  `]
})
export class MessageComponent {
  //@Input() define uma propriedade de entrada no component
  @Input() error: string;
  @Input() control: FormControl;
  @Input() text: string;

  hasError(): boolean {
    return this.control.hasError(this.error) && this.control.dirty;
  }

}
