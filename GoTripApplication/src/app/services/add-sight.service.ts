/*
* Here is the code activated when the trip owner clicks on the add button located
* on the cards sight. It will go to the sight class and turn addedToTrip into true
*/

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as Parse from 'parse';

import { getTripDetails } from  './getTripDetails.service';
import { currentUser } from './getCurrentUserData.service';

@Injectable({
  providedIn: 'root'
})
export class AddSightService {

  updateUISightVoted = new Subject();

  constructor(private getTripDetails: getTripDetails, private currentUser: currentUser) { }

  async addSight(place:any){
    
    let Sight = Parse.Object.extend('Sight');
    let sight = new Sight();
    sight.id = place.sightServerId;

    sight.set('addedToTrip', true)
    
    /*
    * Save the update in Parse
    */
    await sight.save().then((res:any)=>{
        this.updateUISightVoted.next(); // Update the UI
      }, (err:any)=>{
        console.log(err)
      })
    }

    async removeSight(place:any){
      let Sight = Parse.Object.extend('Sight');
      let sight = new Sight();
      sight.id = place.sightServerId;
  
      sight.set('addedToTrip', false)
      
      /*
      * Save the update in Parse
      */
      await sight.save().then((res:any)=>{
          this.updateUISightVoted.next(); // Update the UI
        }, (err:any)=>{
          console.log(err)
        })
      }

      async getSightsAdded(){
        let listSightsAdded = [];

        let Sight = Parse.Object.extend('Sight');
        let sightAdded = new Parse.Query(Sight);

        let TripPlan = Parse.Object.extend('TripsPlan');
        let tripPlan = new TripPlan();
        tripPlan.id = this.getTripDetails.currentTrip.id;

        sightAdded.equalTo('tripsPlanId', tripPlan) // find all sights that have this tripId
        let result = await sightAdded.find();

        // Get the list of sights added to the final trip

        for(let i=0; i < result.length; i++){
          let XID = result[i].get('XID');
          let wasAddedToTrip = result[i].get('addedToTrip');
          
          wasAddedToTrip = wasAddedToTrip == true ? true : false; //If return undefined it turn false
          
          listSightsAdded.push({XID: XID, wasAddedToTrip: wasAddedToTrip});
        }
        return listSightsAdded // Return a array witht eh XID and total votes
      }
}
