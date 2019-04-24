import { Directive, HostListener} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormat]'
})
export class FormatDirective {

  constructor (private ngControl: NgControl) {
  }

  @HostListener('keypress', ['$event'])
    keyEvent(event: KeyboardEvent) {
    console.log(event.charCode);
    if (!(event.charCode > 47 && event.charCode < 58 || event.charCode == 42)) {
      return false;
    }
  }
  
  @HostListener('change')
    ngOnChanges(){
      this.formatPhoneNumber();
    }

  @HostListener('keyup')
  keyUp() {
    this.formatPhoneNumber();
  }

  formatPhoneNumber(): any {
    let inputString = this.ngControl.control.value.replace(/\D/g, '');
    const phoneNumber = inputString.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    this.ngControl.control.setValue(phoneNumber)
  }
}
