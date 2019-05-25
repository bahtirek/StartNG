import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneFormat]'
})
export class PhoneFormatDirective {

  constructor (private ngControl: NgControl) {
  }

  @HostListener('keypress', ['$event'])
    keyEvent(event: KeyboardEvent) {
    if (!(event.charCode > 39 && event.charCode < 43 || event.charCode == 45 || event.charCode == 32)) {
      return false;
    }
  }

  @HostListener('change')
  ngOnChanges(){
    this.formatInput();
  }

@HostListener('keyup')
keyUp() {
  this.formatInput();
}

formatInput(): any {
  let inputString = this.ngControl.control.value.replace(/[^\(\)\*\s\-]/g, '');
  this.ngControl.control.setValue(inputString)
}
}
