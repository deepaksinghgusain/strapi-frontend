import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';


import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CoreModule } from './main/module/core/core.module';
import { InstructorModule } from './main/module/instructor/instructor.module';
import { LearnerModule } from './main/module/learner/learner.module';

import { CoursesModule } from './main/module/courses/courses.module';
import { MarkdownModule } from 'ngx-markdown';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderService } from "ngx-ui-loader";

import { ModalModule } from 'ngx-bootstrap/modal';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';
import { gTagService } from './shared/gTagService.service';
import { ServiceWorkerModule } from '@angular/service-worker';


// interface IRecaptchaOption :any ={
//   sitekey: string;
//   theme?: string;
//   type?: string;
//   tabindex?: number;
//   badge?: string;
// }
// const RECAPTCHA_OPTION = {
//   language?: string,
//   invisible?: IRecaptchaOption;
//   normal?: IRecaptchaOption;
// }

const uri = environment.apibaseurl + '/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,

};
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ApolloModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    CoreModule,
    CarouselModule,
    AuthModule,
    BrowserAnimationsModule,
    // PerfectScrollbarModule,
    InstructorModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule,
    CoursesModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    LearnerModule,
    MarkdownModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,



  ],
  providers: [
    gTagService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],

    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }