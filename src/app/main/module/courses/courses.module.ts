import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListingComponent } from './course-listing/course-listing.component';
import { CourseComponent } from './course/course.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CourseSummaryComponent } from './course-summary/course-summary.component';
import { CourseQuickViewComponent } from './course-quick-view/course-quick-view.component';
import { PackageListingComponent } from './package-listing/package-listing.component';
import { PackageComponent } from './package/package.component';
import { PackageDetailComponent } from './package-detail/package-detail.component';
import { CourseRoutingModule } from './course-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import * as i3 from "@angular/cdk/clipboard";


@NgModule({
  declarations: [
    CourseListingComponent,
    CourseComponent,
    CourseDetailComponent,
    CourseSummaryComponent,
    CourseQuickViewComponent,
    PackageListingComponent,
    PackageComponent,
    PackageDetailComponent
  ],
  imports: [
    CommonModule,RouterModule,
    CourseRoutingModule,
    CarouselModule,
    PerfectScrollbarModule,SharedModule, 
    MarkdownModule.forRoot(),
    FormsModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
   
  
  ], 
  providers: [
    BsModalService,
     
  ],
})
export class CoursesModule { }
