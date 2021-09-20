/*
* Functions related to the vote date located on the trip details page
*/
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { getTripDetails } from  './getTripDetails.service';
import { currentUser } from './getCurrentUserData.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteDateService {

  updateUIDateChanged = new Subject();

  constructor(private getTripDetails: getTripDetails, private currentUser: currentUser) { }

  async voteDate(option:string){
  
    let lastSavedVote;

     // Define user based on the current user
     const user = new Parse.User(); // Create a user object with the loged user
     user.id = this.currentUser.userId;

     // Save user vote
    let Date = Parse.Object.extend('Date');
    let date = new Date(); // Create budget object
    let queryDate = new Parse.Query(Date)

    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id; // set up the trip id to the id of current trip

    //Find date ID
    queryDate.equalTo("tripsPlanId", tripPlan )

    let datetList = await queryDate.find();

    if(!datetList[0]){
      return
    }
    date.id = datetList[0].id;

    // Check if user have voted before in one of the three options
    await datetList[0].relation(`usersVotedOne`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'One'
      }
    });

    await datetList[0].relation(`usersVotedTwo`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'Two'
      }
    });

    await datetList[0].relation(`usersVotedThree`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'Three'
      }
    });

    //Function to save new vote
    let saveNewVote = async ()=>{

      date.relation(`usersVoted${option}`).add(user); // Add the user ID to the relational data

      date.increment(`totalVotes${option}`); // Add +1 to the totalVotes
  
      await date.save() // save into Parse

      //Update interface
      this.updateUIDateChanged.next();
    }

    if(lastSavedVote){
      // Remove last vote
      date.decrement(`totalVotes${lastSavedVote}`);

      // Remove user form the list
      date.relation(`usersVoted${lastSavedVote}`).remove(user)

      //Save new vote
      await saveNewVote();

    } else {
      // Save this user first vote
      await saveNewVote()
    }
  }

  /*
  * Find what date option the user voted
  */
  async findUserDateVote(){
    let lastSavedVote;

    // Define user based on the current user
    const user = new Parse.User(); // Create a user object with the loged user
    user.id = this.currentUser.userId;
   
    // Save user vote
    let Date = Parse.Object.extend('Date');
    let date = new Date(); // Create budget object
    let queryDate = new Parse.Query(Date)

    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id; // set up the trip id to the id of current trip

    //Find budget ID
    queryDate.equalTo("tripsPlanId", tripPlan )

    let dateList = await queryDate.find()
    
    if(!dateList[0]){
      return
    }

    // Check if user have voted before in one of the three options
    await dateList[0].relation(`usersVotedOne`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'One'
      }
    });

    await dateList[0].relation(`usersVotedTwo`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'Two'
      }
    });

    await dateList[0].relation(`usersVotedThree`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'Three'
      }
    });

    return lastSavedVote;

  }

  async findTotalVotes(){
    let totalDateVotes = {
      dateOne: 0,
      dateTwo: 0,
      dateThree: 0
    }
   
    // Save user vote
    let Date = Parse.Object.extend('Date');
    let date = new Date(); // Create date object
    let queryDate = new Parse.Query(Date)

    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id; // set up the trip id to the id of current trip

    //Find date ID
    queryDate.equalTo("tripsPlanId", tripPlan )

    let dateList = await queryDate.find()
    
    if(!dateList[0]){
      return
    }

    totalDateVotes.dateOne = await dateList[0].get('totalVotesOne') | 0 ;
    totalDateVotes.dateTwo = await dateList[0].get('totalVotesTwo') | 0;
    totalDateVotes.dateThree = await dateList[0].get('totalVotesThree') | 0;

    return totalDateVotes;

  }
}
