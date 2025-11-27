import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DontBeShyComponent } from 'src/app/shared/components/dont-be-shy/dont-be-shy.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { environment } from 'src/environments/environment';
import { CourseService } from '../../core/services/course.service';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-self-study',
  templateUrl: './self-study.component.html',
  styleUrls: ['./self-study.component.css']
})
export class SelfStudyComponent implements OnInit {

  modalService: any;
  p:number=1;
  username: any;
  certificatehtml: any;
  IDarray: any = []
  upcomingEvents: any = []
  selectedFile?: ImageSnippet;
  profileData: any = {
    firstName: '',
    company: '',
    ptin: '',
    state: '',
    country: '',
    phone: '',
    profileImage: '',
    lastName:'',
  };
  imgUrl: any = '';
  greeting = '';
  userId: any;
  eventList: any;
  ID: any;
  recEvent: any;
  certificates: any;
  isShow: boolean | undefined;
  timezone: any;

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const timezone = moment.tz.guess();
    const offset = new Date().getTimezoneOffset();
    console.log('timezone',timezone)
    const timezoneAbbrv =  moment().tz(timezone).format('z');
    this.timezone=timezoneAbbrv
    this.profileInfo();
    this.getRecordingEvents();
  
    
    this.userId = localStorage.getItem('userId')
    this.username = localStorage.getItem('username')
    var time = new Date().getHours();
    if (time < 12) {
      // document.write("<b>Good morning!</b>");
      this.greeting = 'Good morning';
    }
    else if (time >= 12 && time < 18) {
      // document.write("<b>Good afternoon!</b>");
      this.greeting = 'Good afternoon';
    }
    else {
      this.greeting = 'Good evening';
    }

  }

  modalRef: BsModalRef | undefined;

  profileInfo() {
    this.authService.userInfo().subscribe((res: any) => {
      this.profileData.firstName = res.firstName;
      this.profileData.lastName = res.lastName;
      this.profileData.company = res.companyName;
      this.profileData.ptin = res.PTIN;
      this.profileData.state = res.state;
      this.profileData.country = res.country;

      this.profileData.phone = res.phone;

      // if (res.profileImage.url) {
      //   this.imgUrl = environment.apibaseurl + res.profileImage.url;
      // }

    })

  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.authService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          this.imgUrl = environment.apibaseurl + res.data.profileImage.url
        },
        (err) => {

        })
    });

    reader.readAsDataURL(file);
  }

  openModalWithClass2() {
    this.modalRef = this.modalService.show(
      DontBeShyComponent,
      Object.assign({}, { class: 'modal-popupemail modal-lg' })
    );
    // Object.assign({}, { class: 'custom-video modal-lg' })  
  }

  getRecordingEvents() {

    const email = localStorage.getItem('email')?.toString() || '';
    this.courseService.GetUserSubscribedCourses(email).subscribe((res: any) => {
      this.eventList = []
      // console.log(res.data.userCourses.data)
      const coursesPurchased: any = []
      let instructor:any
      let name:any=[];
      res.data.userCourses.data.forEach((element: any) => {
        let course = element?.attributes?.course?.data?.attributes;

        let usercourse = element?.attributes;

        if(course?.instructors?.data.length>1){
          course.instructors.data.forEach((element: any) => {
        let instructname= element.attributes.firstName + " " + element.attributes.lastName
         name.push(instructname)
          });
        instructor=name.join(',')
        }
        else if(course?.instructors?.data.length==0){
          instructor =''
        }
        else{
         instructor=course?.instructors?.data[0]?.attributes?.firstName + " " + course?.instructors?.data[0]?.attributes?.lastName
        }


        if (course != undefined) {
          coursesPurchased.push({
            'course': course,
            'startDate': course?.startDate,
            'category': course?.category?.data?.attributes?.title,
            'webinarId': course?.webinarId || '',
            'videoUrl': course?.videoUrl,
            'status': usercourse?.status,
            'completedOn': usercourse?.completedOn,
            'purchasedOn': usercourse?.purchasedOn,
            'instructor' : instructor

          })
        }

      })
      this.recEvent = coursesPurchased.filter((item: any) => (item?.category.toLowerCase() === "recorded"));
      this.certificates = coursesPurchased.filter((item: any) => (item?.status.toLowerCase() === "completed" && item?.category.toLowerCase() === "recorded"));
      //this.recEvent = this.recEvent.sort((a: any, b: any) => (Date.parse(a.startDate) < Date.parse(b.startDate)) ? 1 : -1);
       this.recEvent = this.recEvent.sort((a: any, b: any) => (Date.parse(a.purchasedOn) < Date.parse(b.purchasedOn)) ? 1 : -1);
      this.certificates = this.certificates.sort((a: any, b: any) => (Date.parse(a.startDate) < Date.parse(b.startDate)) ? 1 : -1);

      if (this.certificates.length > 0)
        this.isShow = true

      res.data.userCourses.data.forEach((element: any) => {
        if (element?.attributes?.course?.data?.id)
          this.IDarray.push(parseInt(element?.attributes?.course?.data?.id))
      })

      this.courseService.getSelfStudyUpcomingCourse(this.IDarray).subscribe((res: any) => {
        let courses: any = []

        res.data.courses.data.forEach((element: any) => {
          courses.push(element)
        })

        courses = courses.sort((a: any, b: any) => (Date.parse(a?.attributes.startDate) < Date.parse(b?.attributes?.startDate)) ? 1 : -1);
        this.upcomingEvents = courses

      });

    })
  }


 onPageChange(evt:any) {
    this.p = evt;
  window.scrollTo(0, 770)
}

  downloadCertificate(certificate: any) {
    const course = certificate?.course;
    const url = certificate?.course?.certificateTemplate?.data?.attributes?.url;
    const title = course.title || '';
    const credit = course.credit || '';
    const medium = course.medium || '';
    const fieldStudy = course.fieldOfStudy || '';
    const program = course.programNumber || '';
    let datecompleted = certificate.completedOn || '';
    const lastname = localStorage.getItem('lastname');
    if (datecompleted !== '')
      datecompleted = moment(certificate.completedOn).format('MMMM DD, YYYY')
    console.log('course', course)

    //this function use for Cerficate Download in pdf.
    if (course && url)
      this.http.get(environment.apibaseurl + url, { responseType: 'text' }).subscribe(res => {

        let html = res.replace('{{username}}', this.profileData.firstName + " " + this.profileData.lastName)
          .replace('{{course}}', title)
          .replace("{{credit}}", credit)
          .replace("{{medium}}", medium)
          .replace("{{fieldStudy}}", fieldStudy)
          .replace("{{completedOn}}", datecompleted)
          .replace("{{program}}", program)
        this.certificatehtml = this.sanitizer.bypassSecurityTrustHtml(html);
        this.certificatehtml = html
        let doc = new jsPDF('p', 'pt', [745, 745]);
        doc.html(this.certificatehtml, {
          callback: function (doc: any) {
            doc.save("certificate.pdf");
          },
        });
      })
    else
      console.log('could not find template url of course')
  }

  navigateToVideo(url: any, slug: any) {
   const fullName = (this.profileData.firstName!=null ? this.profileData.firstName : '')+ "-"+(this.profileData.firstName!=null ? this.profileData.lastName : 'null') 

    if (url)
      this.router.navigate(['/learner/view-webinar', url, slug,fullName ])
        .then(() => {
          window.location.reload();
        });
    else
      console.log('could not find url of course')
  }

}



