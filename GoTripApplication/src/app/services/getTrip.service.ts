/* 
* This is a service to get data from Parse serve to be shown on the dashboard.
* It will get the trips the user owns as well as the onces whe was invited for 
*/ 
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { currentUser } from './getCurrentUserData.service';

/*
* This is a object constructor to make it easier to create the cards
*/
class TripModel {
    id: String = '';
    title: String = '';
    city: String = '';
    date: String = '';
    owner: String = '';
    acceptedInvitation: Boolean = true;

    constructor(id: String, title: String, city: String, date: String, owner: String, acceptedInvitation: Boolean){
        this.title = title;
        this.city = city;
        this.date = date;
        this.owner = owner;
        this.acceptedInvitation = acceptedInvitation;
        this.id = id;
    }
}

@Injectable()
export class getTrip {
    currentTrips:{}[] = []; // Array to keep the open trips
    oldTrips:{}[] = []; // Array to keep the finshed trips

    constructor(private currentUser: currentUser){ }

    /*
    * This is to clean the currenTrips and oldTrips and avoid duplicated infromation
    */
    dataClen(){
        this.currentTrips = [];
        this.oldTrips = []
    };

    /*
    * This function get information from Parse about the trips the users have access
    */
    async fetchParseData(){
        try{
            this.dataClen(); //Clean data before do new fetch
            
            const user = new Parse.User();
            user.id = this.currentUser.userId; // Creating user based on the current user.
            
            /*
            *Search for the current user's data
            */
            const planOwner = new Parse.Query('TripsPlan');
            planOwner.equalTo("owner", user); // Find trips created by the user

            const planInvited = new Parse.Query('TripsPlan');
            planInvited.equalTo("listUsersPending2", user);  // Find invitations not confirmed yet

            const planInvitationConfirmed = new Parse.Query('TripsPlan');
            planInvitationConfirmed.equalTo("listUsersConfirmed2", user); // Find invitations confirmed

            const mainQuery = Parse.Query.or(planOwner, planInvited, planInvitationConfirmed);

            const results = await mainQuery.find(); // Here it is saved an array with the result with all trips this users have access
            /*
            * Do extra oprations with the returned Parse.Object values found on results
            */
            for (let i = 0; i < results.length; i++) {
                const object = results[i]; // Get individual trip
                
                let status = object.get('finished'); //Check of the trip was finished
                let data = 'TBC'; //Get the date linked to this trip

                /*
                * Get the owner name linked to this trip
                */
                let owner = object.get('owner')

                if(owner.id == user.id){
                    owner = 'You' // the word 'You' will be shown on the cards
                }else{
                    const findOwnerName = new Parse.Query(Parse.User);
                    findOwnerName.equalTo("objectId", owner.id);
                    const ownerResult = await findOwnerName.first();  //Search the owner's name
                    owner = ownerResult?.get('username'); // The owner name wil be shown on the card
                }
                /*
                * Check if the trips the user were invited were accepted by them
                */
                let acceptedInvitation = false;

                await object.relation('listUsersConfirmed2').query().each(function(relatedObject) {
                    if(relatedObject.id == user.id) acceptedInvitation = true;
                })
                /*
                * Create new object
                */ 
                let trip = new TripModel(object.id, object.get('title'), object.get('city'), data, owner, acceptedInvitation);
                /*
                * Check if the trip was finished or not to decid in wich varaible
                * it will be stored
                */
                if(status){
                    this.oldTrips.push(trip); //Trip finished
                }else{
                    this.currentTrips.push(trip)
                }
            }
        }catch(err){
            console.log(err)
        }  
    }
};