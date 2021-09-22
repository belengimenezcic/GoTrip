/*
* This service stores all function related to the friends cards
*/
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { getTripDetails } from  './getTripDetails.service';
import { currentUser } from './getCurrentUserData.service';

@Injectable({
  providedIn: 'root'
})
export class GetFriendsService {

  constructor(private getTripDetails: getTripDetails, private currentUser: currentUser) { }

  async getFrieds(){
    let listFriends:{}[] = [];

    let user = new Parse.User();
    user.id = this.currentUser.userId;
    
    let TripPlan = Parse.Object.extend('TripsPlan');
    let tripPlan = new TripPlan();
    let id = this.getTripDetails.currentTrip.id; // set up the trip id to the id of current trip
    let queryTrip = new Parse.Query(TripPlan);

    //Find trip ID
    queryTrip.equalTo("objectId", id )

    let tripList = await queryTrip.find();

    if(!tripList[0]){
      return
    }

    // Get list of pedding friends
    await tripList[0].relation(`listUsersPending2`).query().each(friend=>{
      listFriends.push({
        name: friend.get('username') ,
        photo: friend.get('photo') ? friend.get('photo').url() : null ,
        status: 'pending',
      })
    });

    // Get list of confirmed friends
    await tripList[0].relation(`listUsersConfirmed2`).query().each(friend=>{
      listFriends.push({
        name: friend.get('username') ,
        photo: friend.get('photo') ? friend.get('photo').url() : null ,
        status: 'confirmed',
      })
    });

    //Add the trip owner
    let tripOwner = await tripList[0].get('owner'); //Getting owner ID
    let queryOwner =  new Parse.Query(Parse.User);
    queryOwner.equalTo('objectId', tripOwner.id);

    let ownerData = await queryOwner.find(); // Search data about the user on Parse
    
    let userNameOwner = await ownerData[0].get('username');
    let photoOwner = await ownerData[0].get('photo')._url;

    //Saing the owner's data on the friends array
    listFriends.push({
      name: userNameOwner,
      photo: photoOwner,
      status: 'organizer'
    })
    return listFriends
  }
}
