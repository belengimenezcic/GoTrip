import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import * as Parse from "parse";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm = this.formBuilder.group({
    name: '',
    email: '',
    newPass: ''
  });
  username: string | undefined;
  useremail: string | undefined;
  photoUrl: string;
  fileName: string;
  selectedFile?: File;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.username = '';
    this.photoUrl = '';
    this.fileName = '';
  }

  ngOnInit(): void {
    const user = Parse.User.current();
    if (user) {
      this.username = user.getUsername();
      this.useremail = user.getEmail();
      const photo = user.get('photo');
      this.photoUrl = photo.url();
    }
  }

  onSubmit(): void {
    const user = Parse.User.current();
    if (this.profileForm.value.name != "") {
      user?.setUsername(this.profileForm.value.name);
    }
    if (this.profileForm.value.email != "") {
      user?.setEmail(this.profileForm.value.email);
    }
    if (this.profileForm.value.newPass != "") {
      user?.setPassword(this.profileForm.value.newPass);
    }
    if (this.selectedFile)
    {
      const parseFile = new Parse.File(this.selectedFile.name, this.selectedFile);
      const user = Parse.User.current()
      user?.set('photo', parseFile);
    }
    user?.save()
      .then(() => {
        // Execute any logic that should take place after the object is saved.
        alert('Profile has been updated');
        window.location.reload();
      }, (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to update profile: ' + error.message);
      });
    console.warn('Your profile has been updated', this.profileForm.value);
    this.profileForm.reset();
  }

  onFileSelected(event: any) {
    console.log(event.target.files[0])
    if (event.target) {
      const file: File = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        const parseFile = new Parse.File(this.selectedFile.name, this.selectedFile);
        const user = Parse.User.current()
        user?.set('photoPreview', parseFile);
        user?.save().then(() => {
          // Execute any logic that should take place after the object is saved
          const photo = user.get('photoPreview');
          this.photoUrl = photo.url();
        }, (error) => {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to upload photo ' + error.message);
        });
      }
    }
  }
}
