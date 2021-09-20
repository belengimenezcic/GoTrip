/*
* Functions related to the vote card located on the trip details page
*/
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { getTripDetails } from  './getTripDetails.service';
import { currentUser } from './getCurrentUserData.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteBudgetService {

  updateUIBudgetChanged = new Subject();

  constructor(private getTripDetails: getTripDetails, private currentUser: currentUser) { }
  
  async voteBudget(option:string){
   
    let lastSavedVote;

    // Define user based on the current user
    const user = new Parse.User(); // Create a user object with the loged user
    user.id = this.currentUser.userId;
   
    // Save user vote
    let Budget = Parse.Object.extend('Budget');
    let budget = new Budget(); // Create budget object
    let queryBudget = new Parse.Query(Budget)

    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id; // set up the trip id to the id of current trip

    //Find budget ID
    queryBudget.equalTo("tripsPlanId", tripPlan )

    let budgetList = await queryBudget.find()
    
    if(!budgetList[0]){
      return
    }
    budget.id = budgetList[0].id;

    // Check if user have voted before in one of the three options
    await budgetList[0].relation(`usersVotedOne`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'One'
      }
    });

    await budgetList[0].relation(`usersVotedTwo`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'Two'
      }
    });

    await budgetList[0].relation(`usersVotedThree`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'Three'
      }
    });

    //Function to save new vote
    let saveNewVote = async ()=>{

      budget.relation(`usersVoted${option}`).add(user); // Add the user ID to the relational data

      budget.increment(`totalVotes${option}`); // Add +1 to the totalVotes
  
      await budget.save() // save into Parse

      //Update interface
      this.updateUIBudgetChanged.next();
    }

    if(lastSavedVote){
      // Remove last vote
      budget.decrement(`totalVotes${lastSavedVote}`);

      // Remove user form the list
      budget.relation(`usersVoted${lastSavedVote}`).remove(user)

      //Save new vote
      await saveNewVote();

    } else {
      // Save this user first vote
      await saveNewVote()
    }
  }

  /*
  * Find what budget option the user voted
  */
  async findUserBudgetVote(){
    let lastSavedVote;

    // Define user based on the current user
    const user = new Parse.User(); // Create a user object with the loged user
    user.id = this.currentUser.userId;
   
    // Save user vote
    let Budget = Parse.Object.extend('Budget');
    let budget = new Budget(); // Create budget object
    let queryBudget = new Parse.Query(Budget)

    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id; // set up the trip id to the id of current trip

    //Find budget ID
    queryBudget.equalTo("tripsPlanId", tripPlan )

    let budgetList = await queryBudget.find()
    
    if(!budgetList[0]){
      return
    }

    // Check if user have voted before in one of the three options
    await budgetList[0].relation(`usersVotedOne`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'One'
      }
    });

    await budgetList[0].relation(`usersVotedTwo`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'Two'
      }
    });

    await budgetList[0].relation(`usersVotedThree`).query().each(voters=>{
      if(voters.id == user.id) {
        lastSavedVote = 'Three'
      }
    });

    return lastSavedVote;

  }

  async findTotalVotes(){
    let totalBudgetVotes = {
      dateOne: 0,
      dateTwo: 0,
      dateThree: 0
    }
   
    // Save user vote
    let Budget = Parse.Object.extend('Budget');
    let budget = new Budget(); // Create budget object
    let queryBudget = new Parse.Query(Budget)

    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id; // set up the trip id to the id of current trip

    //Find budget ID
    queryBudget.equalTo("tripsPlanId", tripPlan )

    let budgetList = await queryBudget.find()
    
    if(!budgetList[0]){
      console.log('No budget row found');
      return
    }

    totalBudgetVotes.dateOne = await budgetList[0].get('totalVotesOne') | 0 ;
    totalBudgetVotes.dateTwo = await budgetList[0].get('totalVotesTwo') | 0;
    totalBudgetVotes.dateThree = await budgetList[0].get('totalVotesThree') | 0;

    return totalBudgetVotes;

  }
}
