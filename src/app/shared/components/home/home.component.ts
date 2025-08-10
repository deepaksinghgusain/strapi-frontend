import { InstructorService } from 'src/app/main/module/core/services/instructor.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { SubSink } from 'subsink';
import { environment } from '../../../../environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { LandingPageService } from 'src/app/main/module/core/services/landing-page.service';
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';
import { defaultOwlOptions } from '../../default-Owloptions';
import { Router } from '@angular/router';
import { MetatagsService } from 'src/app/main/module/core/services/metatags.service';
import moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  imageUrl: String;
  customOptions: OwlOptions = defaultOwlOptions;
  custommembers: OwlOptions = defaultOwlOptions;
  testimonialOwl: OwlOptions = defaultOwlOptions;
  features: any;
  homepageCourses: any = [];
  homeCourses: any = [];
  homepagefacultymembers: any;
  partners: any;
  latestnews: any;
  feature: any;
  testimonials: any;
  highlightsimple: any;
  environmentUrl: string = '';
  coursedata: any;
  InstructorData: any;
  rssFeed: any;
  public unsubscribe$ = new SubSink()
  metaData: any = [];
  timezone: any;
  twoLettertimezone:any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private meta: Meta,
    private titleService: Title,
    private _landingPageService: LandingPageService,
    private _instructorService: InstructorService, private sanitizer: DomSanitizer,
    private _commanService: CommanService, private router: Router, private metatagsService: MetatagsService) {
    this.imageUrl = environment.imageEndPoint;

  }

  ngOnInit(): void {
    const timezone = moment.tz.guess();
      const offset = new Date().getTimezoneOffset();
      console.log('timezone', timezone)
      const timezoneAbbrv = moment().tz(timezone).format('z');
      const firstLetter = timezoneAbbrv.charAt(0);
      const lastLetter = timezoneAbbrv.charAt(timezoneAbbrv.length - 1);
      this.twoLettertimezone  = firstLetter + lastLetter;
      
      this.timezone = timezoneAbbrv;

    this.titleService.setTitle('CPE Warehouse');
    this.environmentUrl = environment.apibaseurl
    this.gethomePageSection();
    this.gethomePageCourses();
    this.homePageFacutltyByGql()
  }

  /*  loadScript(name: string): void {
      if (isPlatformBrowser(this.platformId)) {
        const src = document.createElement('script');
        src.type = 'text/javascript';
        src.src = name;
        src.async = false;
        document.getElementsByTagName('head')[0].appendChild(src);
      }
    }*/

  gethomePageSection() {

    this.unsubscribe$.add(this._landingPageService.getHomePageSection().subscribe((res: any) => {
      if (res) {
        this.rssFeed = res?.data?.attributes?.RssFeedUrl;
        this.partners = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.partner-section')[0];
        this.latestnews = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.latest-news')[0];
        this.feature = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.feature-image-bullet-list')[0];
        this.testimonials = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.testimonial')[0];
        this.highlightsimple = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.page-highlight-simple')[0];
        this.coursedata = res?.data?.attributes?.blocks.filter((x: { __component: string, Index: String }) => x.__component === 'blocks.api-section' && x.Index === 'Home>Courses')[0];
        this.InstructorData = res?.data?.attributes?.blocks.filter((x: { __component: string, Index: String }) => x.__component === 'blocks.api-section' && x.Index === 'Home>Instructor')[0];
        this.metatagsService.addSEOTags(res.data.attributes.seo);
        this._commanService.getlandingpageData(res)

      }
    }));
  }
  sanitize(content: any) {
    return this.sanitizer.bypassSecurityTrustHtml(content)
  }

  gethomePageCourses() {
  
    this.unsubscribe$.add(this._landingPageService.getHomePageCoursesByGql().subscribe((res: any) => {

      if (res.data.courses.data) {
        this.homepageCourses = res?.data?.courses?.data

      
        this.homepageCourses.forEach((element: any) => {
          let allInstructor: any = [];
          let name = ''
          if (element?.attributes.instructors.data.length >1) {
            element?.attributes.instructors.data.forEach((instructor: any) => {

              name = instructor?.attributes?.firstName + " " + instructor?.attributes?.lastName
              allInstructor.push(name)
             
            });

            

          }else if(element?.attributes.instructors.data.length==1){
                 name = (  element?.attributes.instructors.data[0].attributes?.firstName || '')  + " " + (element?.attributes.instructors.data[0]?.attributes?.lastName || '')
                 allInstructor.push(name)
          }else{
            name = ''
            allInstructor.push(name)
          }
   

          this.homeCourses.push({
            'title': element?.attributes?.title,
            'startDate': element?.attributes?.startDate,
            'endDate': element?.attributes?.endDate,
            'image': element?.attributes?.image?.data?.attributes?.url,
            'shortDesc': element?.attributes?.shortDesc,
            'slug': element?.attributes?.slug,
            'instructor': allInstructor.join(","),
          });


        });
      }


    }));
  }

  /* HOME PAGE FECULTY BY GRAPH QL */

  homePageFacutltyByGql() {
    this.unsubscribe$.add(this._instructorService.getInstructorsForHome().subscribe((res: any) => {

      if (res) {
        this.homepagefacultymembers = res.data.instructors.data

      }
    }))

  }


  rssFeedSection() {
    window.open(this.rssFeed, '_blank');
  }

  ngOnDestroy() {
    this.unsubscribe$.unsubscribe()


  }
}



