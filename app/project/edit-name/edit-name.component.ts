import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.css']
})
export class EditNameComponent implements OnInit {

  public newName = '';
  size = 40;
  innerWidth: number;

  @Input() nameToEdit: any;


  constructor() { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 400) {
      this.size = 25;
    }
  }



}
