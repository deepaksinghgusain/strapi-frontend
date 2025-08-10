import { AboutComponent } from './main/module/core/general/about/about.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { MakingDifferenceComponent } from './main/module/core/general/making-difference/making-difference.component';
 
import { ContactComponent } from './main/module/core/general/contact/contact.component';
import { TermUseComponent } from './main/module/core/general/term-use/term-use.component';
import { PolicyComponent } from './main/module/core/general/policy/policy.component';
import { CancellationComponent } from './main/module/core/general/cancellation/cancellation.component';
import { SelfStudyComponent } from './main/module/core/general/self-study/self-study.component';
import { SuccessComponent } from './shared/components/success/success.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { PaymentTermsComponent } from './main/module/core/general/payment-terms/payment-terms.component';
import { ForumsComponent } from './main/module/core/general/forums/forums.component';
 


const routes: Routes = [
  {
    path: '', component: HomeComponent,
  },

  // { path: 'contact-us', component: ContactUsComponent },
  // { path: 'making-difference', component:making },
  // { path: 'about', component: AboutComponent }
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(mod => mod.AuthModule)
  },
  { path: 'about-us', component: AboutComponent, },
  { path: 'self-study', component: SelfStudyComponent },
  { path: 'payment-terms', component: PaymentTermsComponent },
  { path: 'making-difference', component: MakingDifferenceComponent },
  { path: 'contact-us', component: ContactComponent },
  { path: 'privacy-policy', component: PolicyComponent },
  { path: 'term-of-use', component: TermUseComponent },
  { path: 'cancellation-policy', component: CancellationComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'forums', component: ForumsComponent },
 

  // {
  //   path: 'resetpassword',
  //   loadChildren: () => import('./modules/general/resetpassword/resetpassword.module')
  //     .then(mod => mod.ResetpasswordModule)
  // },
  {
    path: 'core',
    loadChildren: () => import('./main/module/core/core.module')
      .then(mod => mod.CoreModule)
  },
  {
    path: 'course',
    loadChildren: () => import('./main/module/courses/courses.module')
      .then(mod => mod.CoursesModule)
  },
  {
    path: 'learner',
    loadChildren: () => import('./main/module/learner/learner.module')
      .then(mod => mod.LearnerModule)
  },
  {
    path: 'instructor',
    loadChildren: () => import('./main/module/instructor/instructor.module')
      .then(mod => mod.InstructorModule)
  },

  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }