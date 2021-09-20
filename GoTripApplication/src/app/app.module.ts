import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatetimerangepickerModule } from "angular-datetimerangepicker";
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { getTrip } from './services/getTrip.service';
import { createNewTrip } from './services/newTripForm.service';
import { currentUser } from './services/getCurrentUserData.service';
import { getTripDetails } from '../app/services/getTripDetails.service';
import { acceptInvitation } from './services/acceptInvitation.service';
import { rejectInvitation } from './services/rejectInvitation.service';
import { finishTrip } from './services/finishTrip.service';
import { NoteService } from './services/getNotesData.service';

import { AuthGuard } from './auth/auth.guard';

import { env } from './env'

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActiveTripCardComponent } from './dashboard/active-trip-card/active-trip-card.component';
import { NewTripFormComponent } from './new-trip-form/new-trip-form.component';
import { CreateNewTripPlanButtonComponent } from './dashboard/create-new-trip-plan-button/create-new-trip-plan-button.component';
import { OldTripCardComponent } from './dashboard/old-trip-card/old-trip-card.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { BackgroundImageComponent } from './pages/background-image/background-image.component';
import { InvitationComponent } from './new-trip-form/invitation/invitation.component';
import { DatetimepickerComponent } from './new-trip-form/datetimepicker/datetimepicker.component';
import { InvitationPageComponent } from './pages/invitation-page/invitation-page.component';
import { TripDetailsComponent } from './trip-details/trip-details.component';
import { AllSightsComponent } from './trip-details/all-sights/all-sights.component';
import { MapComponent } from './trip-details/map/map.component';
import { NotesComponent } from './trip-details/notes/notes.component';
import { BasicInfoComponent } from './trip-details/basic-info/basic-info.component';
import { NotificationBarComponent } from './trip-details/notification-bar/notification-bar.component';
import { SightCardComponent } from './trip-details/all-sights/sight-card/sight-card.component';
import { ShortnerPipe } from './pipe/shortner.pipe';
import { SightDetailComponent } from './trip-details/sight-detail/sight-detail.component';
import { BudgetOptionsComponent } from './trip-details/budget-options/budget-options.component';
import { DateOptionsComponent } from './trip-details/date-options/date-options.component';
import { FriendsCardComponent } from './trip-details/friends-card/friends-card.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


//This is the route array
const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'create', component: NewTripFormComponent, canActivate: [AuthGuard] },
  { path: '', component: LoginPageComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignUpPageComponent },
  { path: 'forgot-password', component: ForgotPasswordPageComponent },
  { path: 'invitation', component: InvitationPageComponent },
  {
    path: 'details/:id', component: TripDetailsComponent, canActivate: [AuthGuard], children: [
      { path: 'sights', component: AllSightsComponent },
      { path: 'map', component: MapComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'place', component: SightDetailComponent },
    ]
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ActiveTripCardComponent,
    NewTripFormComponent,
    CreateNewTripPlanButtonComponent,
    OldTripCardComponent,
    BreadcrumbComponent,
    LoginPageComponent,
    SignUpPageComponent,
    ForgotPasswordPageComponent,
    BackgroundImageComponent,
    InvitationComponent,
    DatetimepickerComponent,
    InvitationPageComponent,
    TripDetailsComponent,
    AllSightsComponent,
    MapComponent,
    NotesComponent,
    BasicInfoComponent,
    NotificationBarComponent,
    SightCardComponent,
    ShortnerPipe,
    SightDetailComponent,
    BudgetOptionsComponent,
    DateOptionsComponent,
    FriendsCardComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgSelectModule,
    DatetimerangepickerModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule,
    CurrencyMaskModule
  ],
  providers: [
    getTrip,
    createNewTrip,
    currentUser,
    acceptInvitation,
    rejectInvitation,
    NoteService,
    getTripDetails,
    finishTrip,
    env,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
