/*
* Functions related to the vote sights located on the trip details page
*/
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { getTripDetails } from  './getTripDetails.service';
import { currentUser } from './getCurrentUserData.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  updateUISightVoted = new Subject();

  constructor(private getTripDetails: getTripDetails, private currentUser: currentUser) { }

  /*
  * Fucntion to save the sight the user like in Parse
  */
  async addVote(place: any){    
    let Sight = Parse.Object.extend('Sight');
    let sight = new Sight();

    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id; // Create a new object with the tripPlan ID

   //Check if the sight was alread added
   let sightQuery = new Parse.Query(Sight)
   sightQuery.equalTo('XID', place.xid);
   sightQuery.equalTo('tripsPlanId', tripPlan);

   await sightQuery.find().then(resp=>{
     if(resp[0]){
      sight.id = resp[0].id
     }
   })
   
   const user = new Parse.User(); // Create a user object with the loged user
   user.id = this.currentUser.userId;
   sight.relation('votes').add(user); // Add the user ID to the relational data

   const point = new Parse.GeoPoint({latitude: place.geoPoints.lat, longitude: place.geoPoints.lon}) // Create geopoint in Parse format

   sight.increment('totalVotes'); // Add +1 to the totalVotes
    
    /*
    * Save the sight in Parse
    */
    await sight.save({
      name: place.name,
      tripsPlanId: tripPlan, // pointer
      photoUrl: place.urlImage , 
      XID: place.xid ,
      description: place.description ,
      geoPoint: point, // geopoint
    }).then((res:any)=>{
      this.updateUISightVoted.next(); // Update the UI
    }, (err:any)=>{
      console.log(err)
    })
  }

   /*
   * Fucntion to remove the vote from the current user
   */
   async removeVote(place: any){
    let Sight = Parse.Object.extend('Sight');
    let sight = new Sight();
    sight.id = place.sightServerId;

    const user = new Parse.User(); // Create a user object with the loged user
    user.id = this.currentUser.userId;
    sight.relation('votes').remove(user); // Add the user ID to the relational data

    sight.decrement('totalVotes'); // Add +1 to the totalVotes

    /* If there is only the vote from this user the sight should be completely removed */
    if(place.totalVote <= 1) {
      sight.destroy().then((resp:any)=>{
        this.updateUISightVoted.next(); // Update the UI
      }, (err:any)=>{
        console.log(err)
      })
    } else {
         /*
          * Save the update in Parse
          */
          await sight.save().then((res:any)=>{
            this.updateUISightVoted.next(); // Update the UI
          }, (err:any)=>{
            console.log(err)
          })
    } 
  }

  /*
  * Function to get the sigts id the logged user liked
  */
  async getUserVotes(){
    let userVotes:any = [];
   
    const user = new Parse.User(); // Create a user object with the loged user
    user.id = this.currentUser.userId;

    // Get list of trip has tripId
    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id;

    let Sight = Parse.Object.extend('Sight');
    
    let sightVoted = new Parse.Query(Sight);
    sightVoted.equalTo('votes', user);
    sightVoted.equalTo('tripsPlanId', tripPlan)

    let result = await sightVoted.find(); // Find the sights thsi user voted and are in this trip
    
    for(let i=0; i < result.length; i++){
      let XID = result[i].get('XID');
      let sightId = result[i].id;
      userVotes.push({XID: XID, sightId: sightId}) // search the XID of the trips user voted and store in array
    }
    return userVotes;
  }

  /*
  * Get list of XID and the total number of people who voted on it
  */
  async getTotalVotes(){

    let listWithTotalVotes = [];

    let Sight = Parse.Object.extend('Sight');
    let sightVoted = new Parse.Query(Sight);

    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id;

    sightVoted.equalTo('tripsPlanId', tripPlan) // find all sights that have this tripId
    let result = await sightVoted.find();

    // Get the list of sights voted and count the number of votes

    for(let i=0; i < result.length; i++){
      let XID = result[i].get('XID');
      let totalVotes = result[i].get('totalVotes');
      totalVotes = totalVotes ? totalVotes : 0; //If it returns undefined it save zero votes

      listWithTotalVotes.push({XID: XID, totalVotes: totalVotes});
    }
    return listWithTotalVotes // Return a array witht eh XID and total votes
  }
}
