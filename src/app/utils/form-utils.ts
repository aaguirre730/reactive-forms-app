import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

async function sleep() {
  // 1. Crea una Promesa ("te prometo que en un rato te aviso cuando termine")
  return new Promise( resolve => {
    // 2. Programa una alarma para que suene en 2500 milisegundos (2.5 segundos)
    setTimeout(() => {
      // 3. Cuando suena la alarma, aprieta el botón 'resolve(true)'
      // Esto cumple la Promesa y desbloquea a quien estaba esperando con 'await'
      resolve(true)
    },2500);
  });
}

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
        case 'emailTaken':
          return 'El correo electrónico ya está siendo usado por otro usuario';
        case 'noStrider':
          return 'El usuario no puede ser strider';
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

  static isFieldOneEqualFieldTwo(field1: string, field2: string){
    return (formGroup: AbstractControl) => {
      const field1value = formGroup.get(field1)?.value;
      const field2value = formGroup.get(field2)?.value;
      return field1value === field2value ? null : { passwordsNotEqual: true } ;
    }
  }

  static async checkingServerResponse(control: AbstractControl):Promise<ValidationErrors | null> {
    console.log('Validando contra servidor');
    // await sleep()
    // Pausa esta función durante 2.5 segundos para simular el tiempo
    // que tarda internet en ir al servidor y volver.
    // Durante esos 2.5 segundos, Angular pone el campo en un estado intermedio llamado PENDING
    await sleep(); // espera 2 seg y medio
    // una vez pasado el tiempo va a tomar el valor del formulario
    console.log('Termino el tiempo');
    // Una vez que se cumplen los 2.5 segundos y el await suelta el freno,
    // lee el texto exacto que el usuario escribió en ese input.
    const formValue = control.value;

    if ( formValue === 'hola@mundo.com') {
      return {
        emailTaken: true,
      }
    }
    return null;
  }

  static noStrider(control: AbstractControl): ValidationErrors | null {
    return control.value === 'strider' ? {noStrider: true} : null;
  }

}
