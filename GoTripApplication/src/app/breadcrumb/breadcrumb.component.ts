import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { createNewTrip } from '../services/newTripForm.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent{
  @Input('origin') origin:any; // Receive data about from where the breadcrumb is being loading

  constructor(private router: Router, private route: ActivatedRoute, private createNewTrip: createNewTrip ) { }

  /*
  * Function to send the user to the previous page. It uses the origin variable to
  * decide to whenre they shoudl go back.
  */
  goBack(){
    if(this.origin == 'newTripForm' || this.origin == 'tripDetails'){

      this.createNewTrip.cleanInvitationList(); // Clean the email list
      this.router.navigate(['../dashboard'])

    } else if (this.origin == 'moreInfo'){

      // If came from moreInfo will go back to the grid of sights to visit
      this.router.navigate(['../sights'], {relativeTo: this.route})

    } else if (this.origin == 'profile'){
      
       // If came from profile page move the user to the dashboard
       this.router.navigate(['/dashboard'])
    } 
  }
}
