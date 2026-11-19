import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['',[Validators.required, Validators.pattern(FormUtils.namePattern)]],
    email: ['',[Validators.required, Validators.pattern(FormUtils.emailPattern)],[FormUtils.checkingServerResponse]],
    username: ['',[Validators.required, Validators.minLength(6), Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    password: ['',[Validators.required, Validators.minLength(6), Validators.pattern(FormUtils.passwordPattern)]],
    password2: ['',[Validators.required, Validators.pattern(FormUtils.passwordPattern)]],
  }, {
    validators: [
      FormUtils.isFieldOneEqualFieldTwo('password','password2')
    ]
  });


  OnSave() {
    if(this.myForm.invalid || this.myForm.pending) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.myForm.reset();
  }

}
