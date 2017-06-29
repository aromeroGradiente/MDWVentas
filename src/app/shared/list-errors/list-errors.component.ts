import { Component, Input } from '@angular/core';

import { Errors } from '../models/error.model';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html'
})
export class ListErrorsComponent {
  formattedErrors: Array<any> = [];

  @Input()
  set errors(errorList: Errors) {
    this.formattedErrors = [];

    if (Object.keys(errorList.error).length !== 0) {
      this.formattedErrors.push(errorList.error);

    }else if (Object.keys(errorList.errors).length !== 0) {

      for (const error in errorList.errors) {
        if (errorList.errors.hasOwnProperty(error)) {
          this.formattedErrors.push(error);
        }
      };

    }
  };

  get errorList() { return this.formattedErrors; }


}
