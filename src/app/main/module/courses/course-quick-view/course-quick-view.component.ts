import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CourseService } from '../../core/services/course.service';
import { environment } from 'src/environments/environment';
import { CommanService } from '../../core/sharedServices/comman.service';
import * as moment from 'moment-timezone';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-quick-view',
  templateUrl: './course-quick-view.component.html',
  styleUrls: ['./course-quick-view.component.css']
})
export class CourseQuickViewComponent implements OnInit {
  enrolls: any = [];
  quickViewData: any;
  imageUrl = environment.imageEndPoint
  eventName: any;
  CartItem: any = [];
  totalPrice: any = 0;
  finalPrice: any = 0;
  courseData: any;
  courseId: any;
  checkoutData: any = [];
  cartItems: any = [];
  couponValue: any = '';
  couponValueOFF: any = '';
  couponErrMsg: any = '';
  cartData: any;
  coursesDetail: any;
  array: any;
  timezone: any;
  couponRes: any = false;
  checkoutPage: any = false;
  slug: any;

  cartId = Number(localStorage.getItem('cartId')) || 0;
  agreeTerms: boolean = false;
  private createdTime = new Date().toISOString();
  private startDate = new Date().toISOString();
  private endDate = new Date().toISOString();
  // private id = 1;
  private summary = 'summary123';
  private location = 'location123';
  private description = 'description123';
  calendarData: any | undefined;



  seats = 1;
  markdown: any;
  footerData: any;

  constructor(
    private _commannService: CommanService,
    private modalService: BsModalService,
    public modal: BsModalRef,
    private router: Router,
    private options: ModalOptions,
    private cartService: CartService,
    private courseService: CourseService, private cd: ChangeDetectorRef) {
    this.cartData = {
      "data": {
        "userId": Number(localStorage.getItem('userId')),
        "total": 0,
        "discountCode": "",
        "discountPrice": 0,
        "finalPrice": 0,
        "CartItem": []
      }
    }
  }

  ngOnInit() {
    const timezone = moment.tz.guess();
    const offset = new Date().getTimezoneOffset();
    console.log('timezone', timezone)
    const timezoneAbbrv = moment().tz(timezone).format('z');
    this.timezone = timezoneAbbrv

    if (this.cartId > 0) {
      this.cartService.getCart(this.cartId).subscribe({
        next: (resp: any) => {
          let cartResponseItems = resp.data.attributes;
          console.log(resp);
          //console.log('cartResponseItems',cartResponseItems) 
          this.cartData.data = resp.data.attributes;
          // let cart = this.cartData.data;
          // cart.CartItem = cardtResponseItems.CartItem;
          // cart.finalPrice = cartResponseItems.finalPrice;
          // cart.total = cartResponseItems.total;
          console.log('cart onload: ', this.cartData)
          this._commannService.setCartQtyObs(resp?.data?.attributes?.CartItem.length)
        },
        error: (res: any) => {

          this.cartData.data.CartItem = [];
          this.cartData.data.finalPrice = 0;
          this.cartData.data.total = 0;
          console.log('error occured while fetching cart res');
          localStorage.setItem('cartId', '0');
          localStorage.setItem('cartQty', '0');
        }
      });
    }


    this.quickViewCourse(this.options.id)
    this.getfooterSection();
  }


  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;

        this.cd.detectChanges();
      }
    })
  }
  close() {
    this.modal.hide();
  }
  applyCoupon() {
    this.couponErrMsg = '';
    if (this.couponValue != "") {
      this.cartService.applyCoupon(this.couponValue).subscribe((couponResp: any) => {
        if (couponResp.statusCode == 404) {
          this.couponErrMsg = 'Invalid coupon.'
        } else {
          this.couponValue = couponResp.id;
          // console.log("couponResp = ", couponResp, couponResp.amount_off, couponResp.percent_off, couponResp.id);
          if (couponResp.amount_off != null) {
            // console.log("IN IF")
            this.finalPrice -= couponResp.amount_off
            this.couponValueOFF = couponResp.amount_off
            this.couponRes = true
            localStorage.setItem('couponApplied', this.couponRes)
          } else {
            this.finalPrice = (this.finalPrice * couponResp.percent_off) / 100
            this.couponValueOFF = couponResp.percent_off
            this.couponRes = true
            localStorage.setItem('couponApplied', this.couponRes)
          }
        }
      })
    }
  }


  closeM() {
    this.modalService.hide()
  }

  enrollNow2(selectedCourse: any, template: any) {
    console.log('selected course', selectedCourse)
    localStorage.setItem("slug", this.slug)
    // if cart does not exist then create a cart
    const courseid = selectedCourse?.data[0]["id"] || 0;
    const price = selectedCourse?.data[0]['attributes']['price']
    console.log('coursedetial', this.coursesDetail);
    if (localStorage.getItem('token')) {
      const email = localStorage.getItem('email') || '';

      this.courseService.checkAlreadyCoursePurchased(courseid, email).subscribe((res: any) => {

        const dts = res?.data.userCourses.data
        if (dts.length == 0) {
          {
            if (this.cartId == 0 && courseid > 0) {


              this.addItem({
                "courseId": Number(courseid),
                "qty": this.seats,
                "packageId": 0,
                "course": this.coursesDetail.data[0].attributes,
                "Enrollment": []
              });
              const realPrice = selectedCourse.data[0].attributes.discount != null ? selectedCourse.data[0].attributes.discount : selectedCourse.data[0].attributes.price
              const totalprice = realPrice * this.seats;

              this.cartData.data.total = totalprice
              this.cartData.data.finalPrice += totalprice;


              this.cartService.addToCart(this.cartData).subscribe((resp: any) => {
                if (resp.data != null) {
                  // SHOW MESSAGE (COURSE ADD SUCCESSFULL)
                  localStorage.setItem('cartId', resp.data.id)
                  localStorage.setItem('cartQty', '1')
                  if (!this.checkoutPage) {
                    this.router.navigateByUrl('/learner/shopping-cart');
                  }
                  else {
                    this.router.navigateByUrl('/learner/secure-checkout');
                  }

                } else {

                  // SHOW EROR MESSAGE (SOMETHING WENT WRONG)
                }
              })
            }
            if (this.cartId > 0) {
              // check if item being selected already exists
              let matchingCourse = this.cartData.data.CartItem.filter((data: any) => data.courseId == courseid)[0] || undefined;
              if (matchingCourse != undefined || matchingCourse != null) {
                // update quantity 
                matchingCourse.qty = this.seats
              }
              else {
                // its new item to be added 
                this.addItem({
                  "courseId": Number(courseid),
                  "qty": this.seats,
                  "course": this.coursesDetail.data[0].attributes,
                  "packageId": 0,
                  "Enrollment": []
                });
              }


            }
            this.updateTotal();
            this.updateCart();
          }
        }
        else {
          dts.map((resp: any) => {


            const purchasedCourseId = resp.attributes?.course?.data?.id

            if (purchasedCourseId == courseid) {

              this.openModal(template)

            }

          })
        }

      })

    }

    else {
      this.addItem({
        "courseId": Number(courseid),
        "qty": this.seats,
        "packageId": 0,
        "course": this.coursesDetail.data[0].attributes,
        "Enrollment": []
      });
      this.updateTotal()
      localStorage.setItem('cartData', JSON.stringify(this.cartData));
      window.location.href = '/auth/login';
    }
  }


  addItem(item: any) {

    if (this.cartData.data.CartItem === undefined || this.cartData.data.CartItem === null)
      this.cartData.data.CartItem = [];

    this.cartData.data.CartItem.push(item);

  }
  updateCart() {


    localStorage.setItem('cartQty', this.cartData?.data.CartItem.length)
    this._commannService.setCartQtyObs(this.cartData?.data.CartItem.length)
    this.close();
    this.cartService.updateCart(this.cartData, this.cartId).subscribe((cartResp: any) => {
      if (!this.checkoutPage) {
        this.router.navigateByUrl('/learner/shopping-cart');
      }
      else {
        this.router.navigateByUrl('/learner/secure-checkout');
      }

    });
  }

  updateTotal() {
    let total = 0;

    this.cartData?.data.CartItem.map((ci: any, index: any) => {
      if (ci.course != undefined) {
      
        if(ci.courseId>0) {
          total += (  ci.course.discount || ci.course.discountedPrice || ci.course.discounted_price) > 0 ? (ci.course.discount * ci.qty || ci.course.discountedPrice * ci.qty || ci.course.discounted_price * ci.qty) :(ci.course.price * ci.qty)
        }else{
          if(ci.course.discounted_price !=null && ci.course.discounted_price>0 ) {
              total += ci.course.discounted_price * ci.qty;
          }else if(ci.course.price !=null && ci.course.price>=0) {
                total +=  ci.course.price *ci.qty;
          }else{
              total +=ci.course.includedCoursePrice * ci.qty;
          }

      }
    }
    });
    // console.log("   this.cartData.data.total",   this.cartData.data.total)

    if (this.cartData && this.cartData.data) {
      this.cartData.data.total = total
      this.cartData.data.finalPrice = total;

    }

  }
  quickViewCourse(id: any) {

    this.courseService.getQuickView(id).subscribe((res: any) => {
      this.quickViewData = res.data.attributes
      this.finalPrice = this.quickViewData.price
      this.summary = res.data.attributes.title
      this.description = res.data.attributes.title
      this.eventName = this.quickViewData?.category?.data?.attributes.title
      this.markdown = this.quickViewData.tabs[0]?.content
      this.getCourseData(this.quickViewData.slug);
      this.slug = this.quickViewData.slug


      this.calendarData = [
        'data:text/calendar;charset=utf8,',
        'BEGIN:VCALENDAR',
        'PRODID:-//Syncfusion Inc//Scheduler//EN',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Calendar',
        'X-WR-TIMEZONE:Asia/Calcutta',
        'BEGIN:VEVENT',
        'LOCATION:' + this.quickViewData?.venueLocation,
        'SUMMARY:' + this.quickViewData?.title,
        'UID:' + this.options.id,
        'TRANSP:TRANSPARENT',
        'DTSTART;TZID=America/New_York:' + moment(this.quickViewData?.startDate).format("YYYYMMDDTHHmmss"),
        'DTEND;TZID=America/New_York:' + moment(this.quickViewData?.endDate).format("YYYYMMDDTHHmmss"),
        'DESCRIPTION:' + this.quickViewData?.shortDesc,
        'ISREADONLY:false',
        'END:VEVENT',
        'END:VCALENDAR'
      ];
    })
  }

  getCourseData(slug: any) {

    this.courseService.getcoursesBySlug(slug).subscribe((res: any) => {
      this.coursesDetail = res.data.courses;
      this.courseId = this.coursesDetail?.data[0]?.id;
      // this.courseData = res?.data[0]?.attributes
      this.courseData = this.coursesDetail?.data[0]?.attributes
    })
  }

  addToCalendar(): void {
    let calenderdataString: string = '';
    for (let [index, value] of this.calendarData.entries()) {
      if (typeof value != 'undefined') {
        calenderdataString += value;
        if (index != 0) {
          calenderdataString += '\n';
        }
      }
    }


    window.open
      (calenderdataString.trim());
  }


  seatIncrementer() {
    let quantity = this.seats

    if (quantity < 9) {
      quantity = quantity + 1
      this.seats = quantity
    }

    return
  }


  modalRef: BsModalRef | undefined;
  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );
  }

  checkout(data: any, template: any) {

    this.checkoutPage = true


    this.enrollNow2(data, template)


  }
  seatDecrementer() {

    let quantity = this.seats

    if (quantity > 1) {
      quantity = quantity - 1
      this.seats = quantity
    }

    return
  }


}
