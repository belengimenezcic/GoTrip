import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { getTripDetails } from '../services/getTripDetails.service';
import { VoteBudgetService } from '../services/vote-budget.service';
import { VoteDateService } from '../services/vote-date.service';
import { GetFriendsService } from '../services/get-friends.service';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.css']
})
export class TripDetailsComponent implements OnInit {
  tripId: string='';
  title: string='';
  city: string='';
  isTheOwner = false;
  hasAcceptedInvitation = true;
  hasReceivedData: boolean = false; // This is used to avoid load components with empty data
  currentTripFullData: any = null; // object with all information about the trip
  private updateUIBudget: any; // update UI after some change is made in the budget
  private updateUIDate: any; // update UI after user choose date

  constructor(private router: Router, private activeRoute: ActivatedRoute, private getTripDetails: getTripDetails, private voteBudgetService:VoteBudgetService, private voteDateService: VoteDateService, private getFriendsService: GetFriendsService) { 
    this.activeRoute.params.subscribe(el=> this.tripId = el['id']) // Get id from the URL
  }

  getInfoAboutThisTrip(){
    /*
    * Get information from Parse server to fill the information about the trip
    */
    if(this.tripId !== ''){
      this.getTripDetails.getBasicInfo(this.tripId)
      .then(()=>{
        this.title = this.getTripDetails.currentTrip.title;
        this.city = this.getTripDetails.currentTrip.destination;
        this.isTheOwner = this.getTripDetails.currentTrip.status.isTheOwner;
        this.hasAcceptedInvitation = this.getTripDetails.currentTrip.status.hasAcceptedInvitation;
        this.hasReceivedData = this.getTripDetails.receiveddata;
        this.currentTripFullData = this.getTripDetails.currentTrip;
        //Save the curretn budget user's vote
        this.voteBudgetService.findUserBudgetVote().then(res=>{
          this.currentTripFullData.budget.userVotedOn = res
        })
        //Get all budget votes
        this.voteBudgetService.findTotalVotes().then(res=>{
          this.currentTripFullData.budget.totalVote.one = res?.dateOne;
          this.currentTripFullData.budget.totalVote.two = res?.dateTwo;
          this.currentTripFullData.budget.totalVote.three = res?.dateThree;
          
        })
        //Save the current date user voted
        this.voteDateService.findUserDateVote().then(res=>{
          this.currentTripFullData.date.userVotedOn = res
        })
        //Get all date votes
        this.voteDateService.findTotalVotes().then(res=>{
          this.currentTripFullData.date.totalVote.one = res?.dateOne;
          this.currentTripFullData.date.totalVote.two = res?.dateTwo;
          this.currentTripFullData.date.totalVote.three = res?.dateThree;
        
        })
        // Get info about friends
        this.getFriendsService.getFrieds().then((res:any)=>{
          this.currentTripFullData.invitedFriends = [];
          this.currentTripFullData.invitedFriends = [...this.currentTripFullData.invitedFriends, ...res];
         
        })
      });
    }
  }

  ngOnInit(): void {
    this.getInfoAboutThisTrip() 

    this.updateUIBudget = this.voteBudgetService.updateUIBudgetChanged.subscribe(el=>{
      this.getInfoAboutThisTrip()
    })
    this.updateUIDate = this.voteDateService.updateUIDateChanged.subscribe(el=>{
      this.getInfoAboutThisTrip()
    })
  }

  ngOnDestroy(){
    /*
    * Delete information when user leave the page
    */
    this.tripId = '';
    this.title = '';    
    this.city = '';
    this.currentTripFullData = null;
    this.getTripDetails.cleanCurrentTrip() // Remove stored data on the service
    this.updateUIBudget.unsubscribe(); 
    this.updateUIDate.unsubscribe();
  }
}
