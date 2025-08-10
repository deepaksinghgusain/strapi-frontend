import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorListingComponent } from './instructor-listing/instructor-listing.component';
import { InstructorComponent } from './instructor/instructor.component';
import { InstructorDetailComponent } from './instructor-detail/instructor-detail.component';
import { InstructorRoutingModule } from './instructor-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MarkdownModule } from 'ngx-markdown';
import {  BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    InstructorListingComponent,
    InstructorComponent,
    InstructorDetailComponent
  ],
  imports: [
    CommonModule,
    InstructorRoutingModule,SharedModule, PerfectScrollbarModule,MarkdownModule
  ],
  providers:[BsModalService]
})
export class InstructorModule { }
