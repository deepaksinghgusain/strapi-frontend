import { CourseService } from '../services/course.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Injectable({
  providedIn: 'root'
})
export class CourseDetailGuard implements CanActivate {
  slug: any = '';
  coursesDetail: any;
  redirectionUrl: any;
  public unsubscribe$ = new SubSink();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  async getCoursePageData(slug: string): Promise<any> {
    try {
      const res: any = await firstValueFrom(this.courseService.getcoursesRedirectionBySlug(slug));
      
        return res?.data?.courses?.data[0]?.attributes?.redirection_Link
      
    } catch (error) {
      // Handle the error if needed
      return null;
    }
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    this.slug = next.paramMap.get('slug');

    const redirectionUrl = await this.getCoursePageData(this.slug);
    console.log(redirectionUrl);
    if (!redirectionUrl) {
      return true; // Allow access to the route
    } else {
      this.router.navigate(['/course/course-detail/' + redirectionUrl]);
      return false; // Deny access to the current route
    }
  }
}
