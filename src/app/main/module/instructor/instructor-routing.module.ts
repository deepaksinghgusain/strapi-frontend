import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstructorDetailComponent } from './instructor-detail/instructor-detail.component';
import { InstructorListingComponent } from './instructor-listing/instructor-listing.component';
import { InstructorComponent } from './instructor/instructor.component';





const routes: Routes = [
    { path: '', component: InstructorComponent },
    { path: 'instructor-detail', component: InstructorDetailComponent },
    { path: 'instructor-listing', component: InstructorListingComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class InstructorRoutingModule { }