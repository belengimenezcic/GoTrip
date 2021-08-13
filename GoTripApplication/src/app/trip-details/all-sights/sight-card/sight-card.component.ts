import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sight-card',
  templateUrl: './sight-card.component.html',
  styleUrls: ['./sight-card.component.css']
})
export class SightCardComponent implements OnInit {
  @Input() isTheOwner: boolean = false;
  @Input() sight: {name?:string, xid?: string, urlImage?:string, description?:string, geoPoints?:{lon: number, lat: number} } = {};
  constructor(private route: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }
  /*
  * Vote will open a new page with extra infromation about the sight
  */
  openSightDetail(){
    console.log('Open datailpage');
    this.route.navigate(['../place'], {relativeTo: this.activeRoute})
    
  }
  /*
  * Vote will store the user in the Parse
  */
  vote(el:any){
    console.log('vote to visite')
    console.log(el)
    el.stopPropagation()
  }
  /*
  * Vote will store the sight information in the Parse
  */
  add(el:any){
    console.log('Add to map')
    el.stopPropagation()
  }

}
