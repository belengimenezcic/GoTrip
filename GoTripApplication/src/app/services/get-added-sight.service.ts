import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { getTripDetails } from  './getTripDetails.service';

@Injectable({
  providedIn: 'root'
})
export class GetAddedSightService {
  addedSights:{}[] = [];

  constructor(private getTripDetails: getTripDetails) { }

  cleanSightList(){
    this.addedSights = []
  }

  async getSights(){
    let Sight = Parse.Object.extend('Sight');
    const querySights = new Parse.Query(Sight);

    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    tripPlan.id = this.getTripDetails.currentTrip.id;
   
    querySights.equalTo('tripsPlanId', tripPlan);
    querySights.equalTo('addedToTrip', true);

    /*
    * Get the sights that were added to the trip
    */
    await querySights.find()
    .then((results)=>{
      for(let i = 0; i < results.length; i++){
        this.addedSights.push({
          title: results[i].get('name'),
          id: results[i].id,
          lat: results[i].get('geoPoint').latitude,
          lon: results[i].get('geoPoint').longitude,
          votes: results[i].get('totalVotes')
        })
      }
    })
    .catch(function(error) {
      console.log(error)
    });
  }
}
