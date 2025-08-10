import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecureCheckoutComponent } from './secure-checkout/secure-checkout.component';
import { ProfileComponent } from './profile/profile.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SelfStudyComponent } from './self-study/self-study.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { ExamComponent } from './exam/exam.component';
import { LearnerRoutingModule } from './learner-routing.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextEditComponent } from './profile/text-edit/text-edit.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { DatePipe } from '@angular/common';
export const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    SecureCheckoutComponent,
    ProfileComponent,
    PaymentInfoComponent,
    DashboardComponent,
    SelfStudyComponent,
    CertificatesComponent,
    ExamComponent,
    ShoppingCartComponent,
    TextEditComponent,
    
  ],
  imports: [
    CommonModule,
    LearnerRoutingModule,
     SharedModule,FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    NgxPaginationModule

  ],
  providers: [DatePipe]
})
export class LearnerModule { }
