/*
* This one if to save function to delete the trip
*/

import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class DeleteTripService {

  constructor() { }

  async deleteTrip(tripId: string){
   
    try{
      let TripPlan = Parse.Object.extend('TripsPlan');
      let tripPlan = new TripPlan()
      tripPlan.id = tripId

      //Find budget and delete it
      let Budget = Parse.Object.extend('Budget')
      let budget = new Budget();
      let queryBudget = new Parse.Query(Budget);

      queryBudget.equalTo('tripsPlanId', tripPlan);
      let findBudget = await queryBudget.find()

      budget.id = findBudget[0].id
      
      await budget.destroy()

      //Find date and delete it
      let Date = Parse.Object.extend('Date')
      let date = new Date();
      let queryDate = new Parse.Query(Date)

      queryDate.equalTo('tripsPlanId', tripPlan);
      let findDate = await queryDate.find()

      date.id = findDate[0].id
      
      await date.destroy()
      
      //Find NonUserInvited and delete it
      let Friends = Parse.Object.extend('NonUserInvited')
      let friends = new Friends();
      let queryFriends = new Parse.Query(friends);

      queryFriends.equalTo('tripsPlanId', tripPlan);
      let findFriends = await queryFriends.find()

      if(findFriends[0]){
        friends.id = findFriends[0].id
        await friends.destroy()
      }
      
      //Find sights and delete it
      let Sight = Parse.Object.extend('Sight')
      let sight = new Sight();
      let querySight = new Parse.Query(Sight);

      querySight.equalTo('tripsPlanId', tripPlan);
      let findSights = await querySight.find()

      if(findSights[0]){
        sight.id = findSights[0].id
        await sight.destroy()
      }
     
      ///Find tripPlan and delete it
      await tripPlan.destroy()
      
    } catch(err){
      console.log(err)
    }
  }
}
