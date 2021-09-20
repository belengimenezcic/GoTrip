/*
* This is to change the trip to finished. Only
* trip owners can set trips as finished.
*/

import * as Parse from 'parse';

export class finishTrip {

    async markAsFinished(id:string){
        let TripPlan = Parse.Object.extend('TripsPlan');
        let tripPlan = new TripPlan();
        tripPlan.id = id;
        try{
            await tripPlan.save({"finished": true}) // Connect to Parse and change finished to true
        }catch(err){
            console.log(err)
        } 
    }
}