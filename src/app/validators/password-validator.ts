import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

export const passwordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password === confirmPassword) {
        return null;
    } else {
        return {'passwordmismatch': true}
    }
}
  

