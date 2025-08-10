import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { CertificatesComponent } from './certificates/certificates.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamComponent } from './exam/exam.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { ProfileComponent } from './profile/profile.component';
import { SecureCheckoutComponent } from './secure-checkout/secure-checkout.component';
import { SelfStudyComponent } from './self-study/self-study.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
    { path: 'certificates', component: CertificatesComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'view-webinar/:url/:slug/:fullName', component: ExamComponent, canActivate: [AuthGuard] },
    { path: 'payment-info', component: PaymentInfoComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'secure-checkout', component: SecureCheckoutComponent, canActivate: [AuthGuard] },
    { path: 'self-study', component: SelfStudyComponent, canActivate: [AuthGuard] },
    { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LearnerRoutingModule { }