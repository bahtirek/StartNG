import { Project } from './../data/project.interface';
import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { Comp } from '../data/comp.interface';
import { ProjectServices } from '../services/project.service';
import { ProjectsServices } from '../services/projects.service';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit, AfterViewInit {

  @Input() componentName: any;
  project: Project;
  component: Comp;
  activeLink = false;

  @ViewChild('line') el: ElementRef;

  constructor(private projectsService: ProjectsServices, private rd: Renderer2) { }
 
  ngOnInit() {
    this.projectsService.projectObservable.subscribe(
      project => this.project = project
    );
    this.project = this.projectsService.currentProject;
    //this.project = this.projectsService.currentProjectFromLoc('');
    let id = parseInt(this.componentName);
    const index = this.project.components.findIndex((component) => { return component.id === id})
    this.component = this.project.components[index];
  }

  
  ngAfterViewInit() {
    //console.log(this.el); 
    if (this.el !== undefined){
      //console.log(this.el.nativeElement.getBoundingClientRect().top);
    } 
  }

  childActive(childLink, parentIndex, childIndex){
    //console.log(child, parentIndex, childIndex)
    /* if (this.activeLink !== undefined){
      //console.log(JSON.parse(JSON.stringify(this.activeLink)))
      this.project.components[this.activeLink.p].children[this.activeLink.c].active = false;
    }
      
    this.activeLink = {p: parentIndex, c: childIndex} */
    
    //console.log(this.activeLink)
    
    if (this.activeLink) {
      for (const component of this.project.components) {
        for (const child of component.children) {
          if (child.active === true) {
            child.active = false;
            childLink.active = true;
          }
        }
      }
    } else {
      this.activeLink = true;
      childLink.active = true;
    }
    

  }

  childrenQuantity(id) {
    //console.log(id)
    const index = this.project.components.findIndex((component) => { return component.id === id})
    return this.project.components[index].children.length;
  }

  getHeight(){
    if (this.el !== undefined){
      //console.log(this.el.nativeElement.classList);
    }
  }

}
