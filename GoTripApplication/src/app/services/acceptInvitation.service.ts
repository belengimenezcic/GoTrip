/*
* There are 2 places where the user can accept invitation: 
* 1 - in the dashboard
* 2 - In the detail page
*/

import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { currentUser } from './getCurrentUserData.service';
import { getTrip } from './getTrip.service';

@Injectable()
export class acceptInvitation {

    constructor(private currentUser: currentUser, private getTrip: getTrip){ }

    async accept(id:any){
        let tripsPlan = new Parse.Object('TripsPlan');
        tripsPlan.id = id;  

        const user = new Parse.User();
        user.id = this.currentUser.userId;

        tripsPlan.relation('listUsersPending2').remove(user); //Remover user from listUsersPending2
        
        tripsPlan.relation('listUsersConfirmed2').add(user); //Add user to listUsersConfirmed2

        await tripsPlan.save() // Request to save in Parse

        await this.getTrip.fetchParseData(); // Ask to get the new data
    }
}