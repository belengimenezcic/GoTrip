import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MoreInfoService } from '../../../services/more-info.service';
import { VoteService } from '../../../services/vote.service';
import { AddSightService } from '../../../services/add-sight.service';

@Component({
  selector: 'app-sight-card',
  templateUrl: './sight-card.component.html',
  styleUrls: ['./sight-card.component.css']
})
export class SightCardComponent implements OnInit {
  @Input() isTheOwner: boolean = false;
  @Input() hasAcceptedInvitation: boolean = false;
  @Input() sight: {name?:string, xid?: string, urlImage?:string, description?:string, geoPoints?:{lon: number, lat: number}, userVoted?:boolean, totalVote?:number, sightServerId?:string, wasAdded?: boolean } = {};
  
  constructor(private route: Router, private activeRoute: ActivatedRoute, private moreInfoService: MoreInfoService, private voteService: VoteService, private addSightService: AddSightService) { }

  ngOnInit(): void {
    
  }
  /*
  * the card will open a new page with extra infromation about the sight
  */
  openSightDetail(){
    this.moreInfoService.moreInfoAboutSight({...this.sight, hasAcceptedInvitation: this.hasAcceptedInvitation, isTheOwner: this.isTheOwner}) // save data on a service
    this.route.navigate(['../place/'], {relativeTo: this.activeRoute}) //open new page
  }
  /*
  * Vote will store the user in the Parse
  */
  vote(el:any){
    el.stopPropagation()
    this.voteService.addVote(this.sight);
    this.voteService.getUserVotes();
  }

  removeVote(el:any){
    el.stopPropagation()
    this.voteService.removeVote(this.sight)
  }
  /*
  * Add will go to the sight class and turn the item addedToTrip into true
  */
  add(el:any){
    this.addSightService.addSight(this.sight)
    el.stopPropagation()
  }

  remove(el:any){
    this.addSightService.removeSight(this.sight)
    el.stopPropagation()
  }
}
