import { SessionService } from './services/sessionService';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './components/signup/signup.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';

import {  BsModalService } from 'ngx-bootstrap/modal';
import { AuthRoutingModule } from './auth-routing.module';
import { NewpasswordComponent } from './components/newpassword/newpassword.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
 

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ResetpasswordComponent,
    NewpasswordComponent,
    ChangePasswordComponent
  ],
  providers: [
    BsModalService,
    SessionService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ],
  exports: [SignupComponent, LoginComponent],
})
export class AuthModule { }
