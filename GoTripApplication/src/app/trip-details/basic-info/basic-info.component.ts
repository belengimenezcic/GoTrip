import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { finishTrip } from '../../services/finishTrip.service';
import { rejectInvitation } from '../../services/rejectInvitation.service';
import { acceptInvitation } from '../../services/acceptInvitation.service';
import { DeleteTripService } from '../../services/delete-trip.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
  @Input() title: string = '';
  @Input() city: string = '';
  @Input() isTheOwner: boolean = false;
  @Input() hasAcceptedInvitation: boolean = false;
  @Input() tripId = '';
  @Output() updateDetailsData = new EventEmitter;

  constructor(private finishTrip: finishTrip, private router: Router, private rejectInvitation:rejectInvitation, private acceptInvitation: acceptInvitation, private deleteTripService:DeleteTripService ) { }

  ngOnInit(): void {

  }

  async setTripAsFinished(){
    if(this.tripId == '') return // Stops the function if there is no ID saved
    await this.finishTrip.markAsFinished(this.tripId) // Run the Parse function to change finished from true to false
    this.router.navigate(['../../dashboard']) // Go back to dasboard after change to finished
  }

  async deleteTrip(){
    await this.deleteTripService.deleteTrip(this.tripId).then(res=>{
      console.log('Trip deleted')
    })
    this.router.navigate(['../../dashboard']) // Go back to dashboard
  }

  decline(){
    this.rejectInvitation.reject(this.tripId).then(el=>{
      this.router.navigate(['../../dashboard']) // GO back to dashboard
    })
  }

  accept(){
    this.acceptInvitation.accept(this.tripId)
    .then(el=>{
      this.updateDetailsData.emit() // Ask the details to update the page
    })
  }
}
