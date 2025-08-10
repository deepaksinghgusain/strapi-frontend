import { LandingPageService } from './../../services/landing-page.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CourseService } from '../../services/course.service';
import { InstructorService } from '../../services/instructor.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MetatagsService } from '../../services/metatags.service';
import moment from 'moment';

@Component({
  selector: 'app-self-study',
  templateUrl: './self-study.component.html',
  styleUrls: ['./self-study.component.css']
})
export class SelfStudyComponent implements OnInit {
  imageUrl: string;
  courseListing: any = [];
  LiveCourseListing: any = [];
  FreeCourseListing: any = [];
  instructorData: any;
  title1: any;
  title2: any;
  data: any = [];
  search = "";
  heading: any;
  packageDealSection: any;
  questionsection: any;
  priceCheck: any;
  forTaxLawCheck: any;
  isActiveCheck: any;
  instructorSection: any;
  environmentUrl:any;
  value: any;
  timezone:any;
  twoLettertimezone:any;

  constructor(
    private courseService: CourseService,
    private _instructorService: InstructorService,
    private sanitizer: DomSanitizer,
    private landingpageService: LandingPageService,
    private metaService: MetatagsService,
    private cd: ChangeDetectorRef) { this.imageUrl = environment.imageEndPoint; }

  ngOnInit(): void {
    const timezone = moment.tz.guess();
    const offset = new Date().getTimezoneOffset();
    console.log('timezone', timezone)
    const timezoneAbbrv = moment().tz(timezone).format('z');
    const firstLetter = timezoneAbbrv.charAt(0);
    const lastLetter = timezoneAbbrv.charAt(timezoneAbbrv.length - 1);
    this.twoLettertimezone  = firstLetter + lastLetter;
    
    this.timezone = timezoneAbbrv;

    this.getCourseListing();
    this.getinstructorListing();
    this.getPageContent();
    this.environmentUrl = environment.imageEndPoint;
  }
  getinstructorListing() {
    this._instructorService.getInstructors().subscribe((res: any) => {
      if (res) {
        this.instructorData = res.data.instructors.data || [];

      }

    }, (error: any) => {
      console.log('error in fetching instructor listing', error)
    })
  }

  searchTitle(search: any) {
    this.LiveCourseListing = []
    this.FreeCourseListing = []

    if (search !== '') {
      this.courseService.getSelfStudyCoursesSearch(search).subscribe((res: any) => {

        let courseListing = [];
        this.LiveCourseListing = []
        this.FreeCourseListing = []
        if (res) {
          courseListing = res.data.courses.data
          this.LiveCourseListing = courseListing.filter((elem: any) => elem?.attributes?.forTaxLaw && elem?.attributes?.isActive && elem.attributes?.price > 0);
          this.FreeCourseListing = courseListing.filter((elem: any) => elem?.attributes?.forTaxLaw && elem?.attributes?.isActive && elem.attributes?.price == 0);

        }

      });
    } else {
      this.getCourseListing()
    }


    // if(search){
    //   this.LiveCourseListing.filter((element:any) =>{
    //     return element.attributes.title.includes(search);
    //   });
    // }

    // element?.attributes?.category?.data?.attributes?.title
  }
  getPageContent() {

    this.landingpageService.getHeroSection('page', 'self-study').subscribe((res: any) => {
      if (res) {
        this.metaService.addSEOTags(res?.data[0]?.attributes?.seo);
        this.questionsection = res?.data[0]?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.page-question-section')[0];
        this.title1 = this.questionsection.title.substring(0, 21)
        this.title2 = this.questionsection.title.substring(22, 25)
        this.heading = res?.data[0]?.attributes?.blocks.filter((x: { __component: string, Index: String }) => x.__component === 'blocks.api-section' && x.Index === 'SelfStudy>Events')[0];
        this.instructorSection = res?.data[0]?.attributes?.blocks.filter((x: { __component: string, Index: String }) => x.__component === 'blocks.api-section' && x.Index === 'SelfStudy>Instructors')[0];
        this.cd.detectChanges();

      }

    })

  }
  sanitize(content: any) {

    return this.sanitizer.bypassSecurityTrustHtml(content)
  }
  getCourseListing() {
    // this._commannService.commanCoursesdata.subscribe((res: any) => {
    this.courseService.getSelfStudyCourses().subscribe((res: any) => {
      if (res) {

        this.courseListing = res.data.courses.data
        this.LiveCourseListing = this.courseListing.filter((element: any) => element.attributes.category.data.attributes.title.toLowerCase() == 'recorded' && element?.attributes?.price != 0);
        this.FreeCourseListing = this.courseListing.filter((element: any) => element?.attributes?.price === 0);
      }
    }, (error: any) => {
      console.log('error in fetching course listing', error)
    })
  }

  convertIntoFloat(n: any) {
    if (n !== null) {
      let x = parseFloat(n);
      let res = x.toFixed(2);
      return res;
    } else {
      return '0.00';
    }
  }

}
