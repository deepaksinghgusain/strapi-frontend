import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseDetailGuard } from '../core/guard/course-detail.guard';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CourseListingComponent } from './course-listing/course-listing.component';
import { CourseQuickViewComponent } from './course-quick-view/course-quick-view.component';
import { CourseSummaryComponent } from './course-summary/course-summary.component';
import { PackageDetailComponent } from './package-detail/package-detail.component';
import { PackageListingComponent } from './package-listing/package-listing.component';
import { PackageComponent } from './package/package.component';




const routes: Routes = [
    { path: 'course-listing', component: CourseListingComponent },
    { path: 'course-detail/:slug', component: CourseDetailComponent , canActivate: [CourseDetailGuard]},
  
    { path: 'course-quickView', component: CourseQuickViewComponent },
    { path: 'course-summary', component: CourseSummaryComponent },
    { path: 'package', component: PackageComponent },
    { path: 'package-detail/:slug', component: PackageDetailComponent },
    { path: 'package-listing', component: PackageListingComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CourseRoutingModule { }