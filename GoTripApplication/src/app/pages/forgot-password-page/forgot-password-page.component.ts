import { Component } from '@angular/core';
import * as Parse from 'parse';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css']
})
export class ForgotPasswordPageComponent {
  email = '';
  showSuccess: boolean = false;

  constructor() { }

  onKey(event: any) { // without type info
    this.email = event.target.value
  }

  onClickMe() {
    // alert(this.email)
    const parse = Parse.User.requestPasswordReset(this.email)
      .then(() => {
        // Password reset request was sent successfully
        // potencial account to mail check
        this.showSuccess = true
      }).catch((error) => {
        // Show the error message somewhere
        alert("Error: " + error.code + " " + error.message);
      });
  }
}
