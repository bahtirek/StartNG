import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  innerWidth: number;

  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.innerWidth = window.innerWidth;
      if (window.innerWidth < 640 ) {
        this.width = window.innerWidth.toString();
        this.height = Math.round(window.innerWidth / 1.77).toString();
      } else {
        this.width = "640";
        this.height = "360";
      }

    }
  constructor() { }

  width = "640";
  height = "360";

  ngOnInit() {
  }

}
