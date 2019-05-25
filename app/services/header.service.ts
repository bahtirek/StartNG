import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  componentChanged: boolean = false;

constructor() { }

private isComponentObservableSource = new Subject<boolean>();
isComponentObservable = this.isComponentObservableSource.asObservable();

 setIsComponent(val){
  this.isComponentObservableSource.next(val);
 }


}
