import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MoreInfoService } from '../../../services/more-info.service';
import { VoteService } from '../../../services/vote.service';

@Component({
  selector: 'app-sight-card',
  templateUrl: './sight-card.component.html',
  styleUrls: ['./sight-card.component.css']
})
export class SightCardComponent implements OnInit {
  @Input() isTheOwner: boolean = false;
  @Input() hasAcceptedInvitation: boolean = false;
  @Input() sight: {name?:string, xid?: string, urlImage?:string, description?:string, geoPoints?:{lon: number, lat: number}, userVoted?:boolean } = {};
  
  constructor(private route: Router, private activeRoute: ActivatedRoute, private moreInfoService: MoreInfoService, private voteService: VoteService) { }

  ngOnInit(): void {
    console.log('OWNER==> '  +this.isTheOwner);
    console.log('hasaccepet===> ' +this.hasAcceptedInvitation)
  }
  /*
  * the card will open a new page with extra infromation about the sight
  */
  openSightDetail(){
    this.moreInfoService.moreInfoAboutSight({...this.sight, hasAcceptedInvitation: this.hasAcceptedInvitation, isTheOwner: this.isTheOwner}) // save data on a service
    this.route.navigate(['../place/', this.sight.xid], {relativeTo: this.activeRoute}) //open new page
    
  }
  /*
  * Vote will store the user in the Parse
  */
  vote(el:any){
    el.stopPropagation()
    this.voteService.addVote(this.sight);
    this.voteService.getUserVotes();
  }
  /*
  * Add will store the sight information in the Parse
  */
  add(el:any){
    console.log('Add to map')
    el.stopPropagation()
  }

}
