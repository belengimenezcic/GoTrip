/*
* These functions are used in the dashboar and trip details to reject 
* invitations.
*/
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { currentUser } from './getCurrentUserData.service';
import { getTrip } from './getTrip.service';

@Injectable()
export class rejectInvitation {

    constructor(private currentUser: currentUser, private getTrip: getTrip){ }

    async reject(id:any){
        let tripsPlan = new Parse.Object('TripsPlan'); // Get class
        tripsPlan.id = id;  

        const user = new Parse.User();
        user.id = this.currentUser.userId; // Set up user object with the current user
        
        tripsPlan.relation('listUsersPending2').remove(user); //Remover user from listUsersPending2
       
        await tripsPlan.save() // Save the change in Parse

        await this.getTrip.fetchParseData(); //ask to get the new data

    }
}