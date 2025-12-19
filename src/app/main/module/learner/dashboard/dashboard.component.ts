import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CourseService } from '../../core/services/course.service';
import xml2js from 'xml2js';

import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { CartService } from '../../core/services/cart.service';
import { AngularIcalendarModule } from 'angular-icalendar';
import { introspectionFromSchema } from 'graphql';
import { elementAt, switchMap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { parseNumbers } from 'xml2js/lib/processors';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  p: number = 1;
  collection: any = [];
  selectedFile?: ImageSnippet;
  imageInput: any;
  isShow = false;
  imgUrl: any = '';
  timezone:any;
  username: any;
  certificatehtml: any;
  Course: any;
  text: any;
  check = false;
  currentDate: any;
  message: any = '';
  ID: any;
  userID: any;
  fromHTML: any;
  rsshtmlData: any;
  unsafeHtml: any;

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
  IDarray: any = []
  upcomingEvents: any = []
  invoices: any = []
  invoicesTem: any= []
  watchRecording = false;
  greeting = '';
  userdata: any;
  userId: any;
  CourseName: any;
  orderStatus: any;
  courseName: any;
  title: any;
  CourseNametitle: any;
  category: any;
  eventList: any;
  rssItems: any = [];
  pastEvents: any = [];
  regEvent: any = [];
  htmltemp: any = [];
  titleAraay: any = [];
  certificates: any;
  certificatesurl: any;
  rssLinks: any;
  xml2js: any;
  xmlItems: any = [];
  rssData: any = [];
  xmlItemsLength: any;
  joinURL: any;
  twoLettertimezone:any;

  htmlContentforInvoiceItems ='';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cartService: CartService,
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');

    this.getCustomerDetail(this.userId);
  }

  getCustomerDetail(userid: any) {
    this.cartService.getCardToken(userid).subscribe((res: any) => {
      res.cid;
      localStorage.setItem('cid', res.cid);
    });
  }

  ngOnInit(): void {
    const timezone = moment.tz.guess();
    const offset = new Date().getTimezoneOffset();
    console.log('timezone',timezone)
    const timezoneAbbrv =  moment().tz(timezone).format('z');
    const firstLetter = timezoneAbbrv.charAt(0);
    const lastLetter = timezoneAbbrv.charAt(timezoneAbbrv.length - 1);
    this.twoLettertimezone  = firstLetter + lastLetter;
    this.timezone=timezoneAbbrv
    console.log('Abbr',timezoneAbbrv)
    this.showSalutation();

    this.profileInfo();
    let email = localStorage.getItem('email');

    this.getEventlist();
    this.getinvoiceList();
    this.taxBytesRssLink();
  }
  taxBytesRssLink() {
    this.courseService.getRssLinks().subscribe((res: any) => {

      this.rssLinks = res.feeds;

      for (let feed = 0; feed < this.rssLinks.length; feed++) {
        this.rssItems.push(this.rssLinks[feed][res.url[feed]].rss.channel.item)
      }
    });
  }


  redirectUrl(val: any) {
    window.open(val, '_blank');
  }



  showSalutation() {
    var time = new Date().getHours();
    if (time < 12) {
      // document.write("<b>Good morning!</b>");
      this.greeting = 'Good morning';
    } else if (time >= 12 && time < 18) {
      // document.write("<b>Good afternoon!</b>");
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

  // getOrderDetails() {
  //   this.courseService.getOrders().subscribe((res: any) => {
  //     if (res.data.orders.data.length === 0) {
  //       this.check = true;
  //       this.message = "You have not purchased any course. Please purchase a course to access this information";
  //     }

  //   })
  // }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.authService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          this.imgUrl = environment.apibaseurl + res.data.profileImage.url;
        },
        (err) => { }
      );
    });

    reader.readAsDataURL(file);
  }
  profileInfo() {
    this.authService.userInfo().subscribe((res: any) => {
      this.profileData.firstName = res.firstName;
      this.profileData.lastName = res.lastName;
      this.profileData.company = res.companyName;
      this.profileData.ptin = res.PTIN;
      this.profileData.state = res.state;
      this.profileData.country = res.country;

      this.profileData.phone = res.phone;

      if (res.profileImage?.url) {
        this.imgUrl = environment.apibaseurl + res.profileImage.url;
      }
    });
  }
getinvoiceList()
{
  const email = localStorage.getItem('email')?.toString() || '';
  this.invoices = []
  this.courseService.getOrderDetailByUserEmail(email).subscribe((res: any) => {
   this.invoices = res.data.orders.data;
    
  });
}


  getEventlist() {
    const email = localStorage.getItem('email')?.toString() || '';
    this.certificates = []
    
    this.pastEvents = []
    this.regEvent = []
    this.courseService.GetUserSubscribedCourses(email).subscribe((res: any) => {
      this.eventList = [];
      this.certificatesurl = [];
      this.certificates = [];
      res.data.userCourses.data.forEach((element: any) => {

        if(element?.attributes?.course?.data!=null){
          this.IDarray.push(parseInt(element?.attributes?.course?.data?.id))
        }
      })
      this.courseService.getUpcomingCourse(this.IDarray).subscribe((res: any) => {
        this.upcomingEvents = res.data.courses.data;
      });

      this.invoicesTem = [];
      this.courseService.getInvoicetemplate().subscribe((res: any) => {
       this.invoicesTem = res.data.global.data;
      });

      if (res?.data?.userCourses.length == 0)
        this.message =
          'You have not purchased any course. Please purchase a course to access this information';
      const coursesPurchased: any = []
      const localTime = moment().format('YYYY-MM-DD') + 'T00:00:00.000Z'; // store localTime

      res.data.userCourses.data.forEach((element: any) => {

        const course = element?.attributes?.course?.data?.attributes;
        const usercourse = element.attributes;

        if (course != undefined) {
          coursesPurchased.push({
            'course': course,
            'startDate': course?.startDate,
            'category': course?.category?.data?.attributes?.title,
            'webinarId': course?.webinarId || '',
            'joinUrl': usercourse?.joinUrl,
            'status': usercourse?.status,
            'completedOn': usercourse?.completedOn,
            'watchRecording': course?.category?.data?.attributes?.title.toLowerCase() == 'recorded',
            'purchasedOn': usercourse?.purchasedOn,
            
          })
        }

      })

      console.log(coursesPurchased);
      

      this.certificates = coursesPurchased.filter((item: any) => item.status.toLowerCase() === 'completed' && item.category.toLowerCase() == "live");

      this.pastEvents = coursesPurchased.filter((element: any) => element.category.toLowerCase() == "live" && new Date(element?.course?.endDate) <= new Date(localTime));
      this.regEvent = coursesPurchased.filter((element: any) => element.category.toLowerCase() == "live" && new Date(element?.course?.endDate) > new Date(localTime));
      
      
      //sorting 
      this.pastEvents = this.pastEvents.sort((a: any, b: any) => (Date.parse(a.startDate) < Date.parse(b.startDate)) ? 1 : -1);

     
       this.regEvent = this.regEvent.sort((a: any, b: any) => (Date.parse(a.startDate) < Date.parse(b.startDate)) ? -1 : 1);
      this.certificates = this.certificates.sort((a: any, b: any) => (Date.parse(a.startDate) < Date.parse(b.startDate)) ? 1 : -1);


    });
  
  }
  async downloadHandout(evt: any) {
    
    if(evt?.course?.handout?.data)
    {
      let handouts = evt?.course?.handout?.data;
      for (let handout of handouts) {
        
        if (handout?.attributes?.url) {

          if (handout?.attributes?.url) {
            const fileUrls = `${environment.apibaseurl}${handout?.attributes?.url}`
    
    
            const image = await fetch(fileUrls)
            const imageBlog = await image.blob()
            const imageURL = URL.createObjectURL(imageBlog)
    
            const link = document.createElement('a')
            link.href = imageURL
            link.download = 'Handout'
            link.target = "_blank"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)    
          }    
        }
      }
    }    
  } 

  gotowebinar(webinarId: any, joinUrl: any) {
    let emailaddress = localStorage.getItem('email');
    if (joinUrl !== null || joinUrl !== undefined) {
      window.open(joinUrl);
    } else {
      window.open(
        'https://global.gotowebinar.com/join/' + webinarId + '&' + emailaddress
      );
    }
  }

onPageChange(evt:any) {
  this.p = evt;
window.scrollTo(0, 830)
}

downloadInvoice(invoice: any) {
  const InvoiceNo = invoice?.id;
 
  const lastname = localStorage.getItem('lastname');
  let invoiceDate = invoice?.attributes?.createdAt || '';
    if (invoiceDate !== '')
    invoiceDate = moment(invoice?.attributes?.createdAt).format('MMMM DD, YYYY')

  const url = this.invoicesTem?.attributes?.invoiceTemplate?.data?.attributes?.url;
  
  const orderItemst = invoice.attributes.OrderItems
  const length = orderItemst.length;
  const totalDiscount = (parseInt( invoice?.attributes?.totalPrice)-parseInt( invoice?.attributes?.finalPrice)).toString();
  this.htmlContentforInvoiceItems = '';
  let totalQty :any = 0; 
  let totalItems:any =0;

  orderItemst.forEach((orderItemH: any, index:number) => {
    const coursePrice = orderItemH.price ?? 0;
    const courseNetPrice = orderItemH.finalPrice ?? 0;
     const discount = (parseInt(coursePrice)-parseInt(courseNetPrice)).toString();
     totalQty = totalQty + orderItemH.qty ?? 0;
    this.htmlContentforInvoiceItems += '<tr height="30px" style="font-weight: bold; font-size: 10px; max-height: 10px;"><td style="text-align: left; ">'+ orderItemH.title +'</td><td>'+orderItemH.qty+'</td><td>$ ' + coursePrice +'</td><td>$ ' + discount +'</td><td>$ '+courseNetPrice +'</td></tr>'; 
    totalItems =totalItems + 1;
  });

  

  //this function use for Cerficate Download in pdf.
  this.http
    .get(environment.apibaseurl + url, { responseType: 'text' })
    .subscribe((res) => {
      
      let html = res.replace(
        "{{userName}}",
        this.profileData.firstName + " " + this.profileData.lastName
      )
      .replace(
        "{{invoiceNo}}",
        invoice?.id
      )
      .replace(
        "{{address}}",
        this.profileData.state + ", "+this.profileData.country
      )
      .replace(
        "{{invoiceDate}}",
        invoiceDate
      ).replace(
          "{{htmlContentforInvoiceItems}}",
          this.htmlContentforInvoiceItems
        ).replace(
          "{{totalQty}}",
          totalQty
        ).replace(
          "{{totalPrice}}",
          invoice?.attributes?.totalPrice ?? 0
        ).replace("{{totalDiscount}}", totalDiscount)
        .replace(
          "{{finalPrice}}",
          invoice?.attributes?.finalPrice ?? 0
        )
        
      this.certificatehtml = this.sanitizer.bypassSecurityTrustHtml(html);
      this.certificatehtml = html;
      const doc = new jsPDF('p', 'pt', [595, 841.89]);

      doc.html(this.certificatehtml, {
        callback: function (doc: any) {
          var rectX = 210, rectYFix = (229+(totalItems*30)), rectY = (267+(totalItems*30)), rectW = 100, rectH = 12;
          //doc.rect(rectX, rectY, rectW, rectH, 'f');                   
          doc.link(rectX, rectY, rectW, rectH, {url: 'https://cmeavenue.com/auth/login'});
          //doc.rect(rectX-168, rectY+153, rectW, rectH, 'f'); 
          doc.link(rectX-168, (rectY+153), rectW, rectH, {url: 'https://cmeavenue.com/auth/login'});
          //doc.rect(rectX+43, rectY+247, rectW, rectH, 'f');
          doc.link(rectX+43, rectY+247, rectW, rectH, {url: 'https://cmeavenue.com/auth/login'});

          //doc.rect(rectX-14, rectYFix+422, rectW+120, rectH+18, 'f');
          doc.link(rectX-14, rectYFix+422, rectW+120, rectH+18, {url: 'https://cmeavenue.com/auth/login'});

         
          //doc.rect(rectX-210, rectYFix+484, rectW+50, rectH+10, 'f'); 
          doc.link(rectX-210, (rectYFix+484), rectW+50, rectH+10, {url: '#'});
          //doc.rect(rectX-40, rectYFix+484, rectW-5, rectH+10, 'f');
          doc.link(rectX-40, rectYFix+484, rectW-5, rectH+10, {url: '#'});
          //doc.rect(rectX+68, rectYFix+484, rectW+45, rectH+10, 'f');
          doc.link(rectX+68, rectYFix+484, rectW+45, rectH+10, {url: '#'});
          //doc.rect(rectX+235, rectYFix+484, rectW+50, rectH+10, 'f');                   
          doc.link(rectX+235, rectYFix+484, rectW+50, rectH+10, {url: '#'});

          doc.save(`invoice_${InvoiceNo}.pdf`);
        },
      });
    });
}

  downloadCertificate(certificate: any) {
    const course = certificate?.course;

    const lastname = localStorage.getItem('lastname');

    const url = certificate?.course?.certificateTemplate?.data?.attributes?.url;
    const title = course.title || '';
    const credit = course.credit || '';
    const medium = course.medium || '';
    const fieldStudy = course.fieldOfStudy || '';
    const program = course.programNumber || '';
    let datecompleted = certificate.completedOn || '';
    if (datecompleted !== '')
      datecompleted = moment(certificate.completedOn).format('MMMM DD, YYYY')



    //this function use for Cerficate Download in pdf.
    this.http
      .get(environment.apibaseurl + url, { responseType: 'text' })
      .subscribe((res) => {
        let html = res.replace('{{username}}', this.profileData.firstName + " " + this.profileData.lastName)
       
          .replace('{{course}}', title)
          .replace("{{credit}}", credit)
          .replace("{{medium}}", medium)
          .replace("{{fieldStudy}}", fieldStudy)
          .replace("{{completedOn}}", datecompleted)
          .replace("{{program}}", program)
        this.certificatehtml = this.sanitizer.bypassSecurityTrustHtml(html);
        this.certificatehtml = html;
        let doc = new jsPDF('l', 'mm', [580, 800]);
        doc.html(this.certificatehtml, {
          callback: function (doc: any) {
            doc.save(`certificate_${title}.pdf`);
          },
        });
      });
  }
}

function GetCoursename() {
  throw new Error('Function not implemented.');
}
