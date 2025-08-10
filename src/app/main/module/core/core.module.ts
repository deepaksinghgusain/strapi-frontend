import { SharedModule } from './../../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './general/about/about.component';
import { PolicyComponent } from './general/policy/policy.component';
import { CancellationComponent } from './general/cancellation/cancellation.component';
import { TermUseComponent } from './general/term-use/term-use.component';
import { HeaderComponent } from './general/header/header.component';
import { FooterComponent } from './general/footer/footer.component';
import { RouterModule } from '@angular/router';
import { CoreRoutingModule } from './core-routing.module';
import { MakingDifferenceComponent } from './general/making-difference/making-difference.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SelfStudyComponent } from './general/self-study/self-study.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ContactComponent } from './general/contact/contact.component';
import { MarkdownModule } from 'ngx-markdown';
import { PaymentTermsComponent } from './general/payment-terms/payment-terms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecaptchaModule } from 'ng-recaptcha';
import { ForumsComponent } from './general/forums/forums.component';

 


@NgModule({
  declarations: [
    AboutComponent,
    PolicyComponent,
    CancellationComponent,
    TermUseComponent,
    HeaderComponent,
    FooterComponent,
    CancellationComponent,
    MakingDifferenceComponent,
    PaymentTermsComponent,
    SelfStudyComponent,
    ContactComponent,
    PaymentTermsComponent,
    ForumsComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,PerfectScrollbarModule, 
    SharedModule,
    CoreRoutingModule,
    AutocompleteLibModule,
    MarkdownModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule

   
    
  ],schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports:[HeaderComponent, FooterComponent,PaymentTermsComponent],
  providers: [
    BsModalService,
     
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ], 
})
export class CoreModule { }
