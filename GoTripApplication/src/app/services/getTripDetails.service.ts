/*
* This is to be used on the details page to get data to fill the 
* information about the selected trip plan.
*
*/
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { currentUser } from './getCurrentUserData.service';

@Injectable()
export class getTripDetails {
    receiveddata: boolean = false // this will turn to true when the system finish to fetch data from Parse
    
    constructor(private currentUser: currentUser){ }

    currentTrip = {
        id: '',
        status:{
            isTheOwner: false,
            hasAcceptedInvitation: true,
        }, 
        title: '',
        destination: '',
        geoLocation: {
          lat: 0,
          lon: 0
        },
        budget: {
          one: 0,
          two: 0,
          three: 0,
          userVotedOn: 0,
          totalVote: {
            one: 0,
            two: 0,
            three: 0
          }
        },
        date: {
          one: {
            start: 0,
            end: 0,
          },
          two: {
            start: 0,
            end: 0
          },
          three: {
            start: 0,
            end: 0
          },
          userVotedOn: 0,
          totalVote: {
            one: 0,
            two: 0,
            three: 0
          }
        },
        invitedFriends: [],
      }

      cleanCurrentTrip(){
          this.currentTrip.title = '';
          this.currentTrip.status.isTheOwner = false;
          this.currentTrip.status.hasAcceptedInvitation = true;
          this.currentTrip.destination = '';
          this.currentTrip.budget.one = 0,
          this.currentTrip.budget.two = 0,
          this.currentTrip.budget.three = 0,
          this.currentTrip.invitedFriends = []
      }

      async getBasicInfo(id:string){ 
        if(this.currentUser.userId == ''){
          await this.currentUser.getCurrentUser() // this will run if the detail page is refreshed
        }
        /* 
        * This function is to get the Title, City and Find out if the user is the 
        * owner and if he/she accepted the invitation
        * */
        this.receiveddata = false;
        let tripPlan = Parse.Object.extend('TripsPlan')
        let queryTripPlan = new Parse.Query(tripPlan)
        tripPlan.id = id;
        queryTripPlan.equalTo("objectId", tripPlan.id); // Find the trip plan that has the informed ID

        /*
        * Save ID
        */
        this.currentTrip.id = id;    
        try{
            /*
            * Get information about city and trip title
            */
            let trip = await queryTripPlan.find(); // fetch data from Parse
            this.currentTrip.title = trip[0].get('title'); //Get the title and save in the local object
            this.currentTrip.destination = trip[0].get('city'); // Get the city and save in the local object
            /*
            * Get information about ownership
            */
            let owner = trip[0].get('owner')
            owner.id == this.currentUser.userId ? this.currentTrip.status.isTheOwner = true : this.currentTrip.status.isTheOwner = false;
            
            /*
            * Find if the user has accepted the invitation in case he is not the trip owner.
            */
            if(!this.currentTrip.status.isTheOwner){
                let user = new Parse.User();
                user.id = this.currentUser.userId;
                
                let queryPendingList = new Parse.Query(tripPlan);
                queryPendingList.equalTo('listUsersPending2', user); // First find the trips plan where the user were invited
                queryPendingList.equalTo("objectId", tripPlan.id); // Find specific trip plan

                let allTripUserIsInvited = await queryPendingList.find() // Fetch data from parse
                allTripUserIsInvited.length > 0 ? this.currentTrip.status.hasAcceptedInvitation = false : this.currentTrip.status.hasAcceptedInvitation = true   //If it returns an array it menas the user is in the pending list
            }
            /*
            * Get budget
            */
            let budget = Parse.Object.extend('Budget')
            let queryBudget = new Parse.Query(budget);

            let thisTrip = new tripPlan();
            thisTrip.id = id;

            queryBudget.equalTo('tripsPlanId', thisTrip);

            let budgets = await queryBudget.find();
            this.currentTrip.budget.one = budgets[0].get("budgetOne");
            this.currentTrip.budget.two = budgets[0].get("budgetTwo");
            this.currentTrip.budget.three = budgets[0].get("budgetThree");
            
            /*
            * Get dates
            */
            let Dates = Parse.Object.extend('Date')
            let queryDates = new Parse.Query(Dates);

            queryDates.equalTo('tripsPlanId', thisTrip);

            let dates = await queryDates.find();
            this.currentTrip.date.one.start = dates[0].get("dateOneStart");
            this.currentTrip.date.one.end = dates[0].get("dateOneEnd");
            this.currentTrip.date.two.start = dates[0].get("dateTwoStart");
            this.currentTrip.date.two.end = dates[0].get("dateTwoEnd");
            this.currentTrip.date.three.start = dates[0].get("dateThreeStart");
            this.currentTrip.date.three.end = dates[0].get("dateThreeEnd");
            
            this.receiveddata = true;

        }catch(err){
            console.log(err) // Show error in the console
        }
        
      }

      saveGeoLocation(lat:number, lon:number){
        this.currentTrip.geoLocation.lat = lat;
        this.currentTrip.geoLocation.lon = lon;
      }
}