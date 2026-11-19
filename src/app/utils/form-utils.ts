import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';


export class FormUtils {

  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido.';
        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
        case 'min':
          return `Valor mínimo de ${errors['min'].min}.`;
        case 'email':
          return `El correo electrónico es invalido`;
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El correo electrónico no es permitido';
          }
          return 'Error de patrón contra expresión regular';

        break;
        default:
          return 'Error de validación no controlado';
      }
    }
    return null;
  }

  // funcion para validar los campos
  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    // agregamos validación extra para que aparezca solo cuando el input sea tocado
    return !!form.controls[fieldName].errors && form.controls[fieldName].touched;
  };

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    // Con el '!' decimos: si el campo NO existe, devuelve null
    if (!form.controls[fieldName]) return null;
    const errors = form.controls[fieldName].errors ?? {};
    return FormUtils.getTextError(errors);
  };

  static getFieldArrayError(formArray: FormArray, index: number): string | null {
    // Con el '!' decimos: si el campo NO existe, devuelve null
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  };

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

}
