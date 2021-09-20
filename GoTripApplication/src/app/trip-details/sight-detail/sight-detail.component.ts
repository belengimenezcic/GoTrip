import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MoreInfoService } from '../../services/more-info.service';
import { VoteService } from '../../services/vote.service';

@Component({
  selector: 'app-sight-detail',
  templateUrl: './sight-detail.component.html',
  styleUrls: ['./sight-detail.component.css']
})
export class SightDetailComponent implements OnInit, OnDestroy{
  sight: any = {};
  private updateUi: any;

  constructor(private  moreInfoService: MoreInfoService, private voteService: VoteService, private router: Router, private activeRoute: ActivatedRoute) {
    this.sight = this.moreInfoService.knowInfoAboutThisSight;
   }

  ngOnInit(): void {

    /*
    * This will run after the user click on the vote/remove vote button
    */
    this.updateUi = this.voteService.updateUISightVoted.subscribe(()=>{
      this.router.navigate(['../place'],{relativeTo:this.activeRoute})
    })
  }

  voteSight(){
    this.voteService.addVote(this.sight)
  }

  unvoteSight(){
    this.voteService.removeVote(this.sight)
  }

  ngOnDestroy(){
    this.moreInfoService.cleanMoreInfoAboutSight();
    this.updateUi.unsubscribe();
  }
}
