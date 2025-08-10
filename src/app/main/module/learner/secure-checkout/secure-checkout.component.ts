import { Component, DebugElement, OnInit, ɵresetCompiledComponents } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { environment } from '../../../../../environments/environment';
import { CommanService } from '../../core/sharedServices/comman.service';
import * as moment from 'moment-timezone';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { gTagService } from 'src/app/shared/gTagService.service';

@Component({
  selector: 'app-secure-checkout',
  templateUrl: './secure-checkout.component.html',
  styleUrls: ['./secure-checkout.component.css'],
})
export class SecureCheckoutComponent implements OnInit {
  cartData: any;
  cartItems: any = [];
  enrollments: any = [];
  modalRef?: BsModalRef | null;
  imageUrl: any = environment.imageEndPoint;
  totalPrice: any = 0;
  finalPrice: any = 0;
  couponValue: any = '';
  couponValueOFF: any = '';
  couponErrMsg: any = '';
  enrolls: any = [];
  checkoutData: any = [];
  footerData: any;
  agreeTerms: boolean = false;
  couponRes: any = false;


  gtagData: { 
    id: any; 
    name: any; 
     brand: any; 
     category: any; 
    quantity: any; 
    price: any; }[] = []
  couponType: any;
  title: any;
  cartId = Number(localStorage.getItem('cartId')) || 0;
  errorText: any = false;
  ptinInfo: any = 'Starts with P, followed by 8 digits (for EAS only)Starts with P, followed by 8 digits (for EAS only)';
  errorText1: any = false;
  errorText2: any = false;
  errorText3: any = false;
  ptinMessage = '';
  firstnameMessage = '';
  lastnameMessage = '';
  emailMessage = '';
  name: any = '';
  disableCouponButton: any = 0;
  checkEmail: any = false;
  i_index: any;
  constructor(
    private _commannService: CommanService,
    private modalService: BsModalService,
    private cartService: CartService, private gtagservice: gTagService,
    private router: Router
  ) {
    this.cartData = {
      data: {
        userId: Number(localStorage.getItem('userId')),
        total: 0,
        discountCode: '',
        discountPrice: 0,
        finalPrice: 0,
        CartItem: [],
      },
    };
  }

  ngOnInit(): void {
    // localStorage.setItem("ogtagdata", '')
    // localStorage.setItem("odata", '')
    // localStorage.setItem("oid", '')
    this.getCartList();
  }

  close() {
    this.modalService.hide();
  }

  getCartList() {
    this._commannService.setCartQtyObs(0);
    this.cartService.getCart(this.cartId).subscribe((resp: any) => {
      console.log("cart Data==>", resp);

      this.cartData.data = resp.data.attributes;
      this.cartItems = this.cartData.data.CartItem;
      console.log("this.cartitems",this.cartData.data.total);
      
      if (this.cartItems.length > 0) {
        this.cartItems?.forEach((course: any, index: any) => {
          var items = [];
          if (course.qty >= 1) {

            for (let i = 0; i < course.qty; i++)
              if (course.packageId != 0) {
                items.push({
                  courseId: 0,
                  packageId: course.course.id,
                  name: '',
                  lastname: '',
                  ptin: ''
                });
              } else {
                items.push({
                  courseId: course.course.id,
                  packageId: 0,
                  name: '',
                  lastname: '',
                  ptin: ''
                });
              }
            course.Enrolls = items;
            course.Enrolls[0].name = localStorage.getItem("username")
            course.Enrolls[0].lastname = localStorage.getItem("lastname")
            course.Enrolls[0].ptin = localStorage.getItem("PTIN")
            course.Enrolls[0].email = localStorage.getItem("email")
          }
        });
      }

      this.cartData.data.CartItem = this.cartItems;

      this._commannService.setCartQtyObs(this.cartItems.length);
      this.totalPrice = this.cartData.data.total;
      this.finalPrice = this.cartData.data.finalPrice;

      this._commannService.setCartQtyObs(this.cartItems.length);

      this.cartItems.map((data: any) => {

        if (data.packageId != 0) {
          this.enrolls.push({
            name: '',
            lastname: '',
            courseId: data.packageId,
            ptin: ''
          });
        } else {
          this.enrolls.push({
            name: '',
            lastname: '',
            courseId: data.courseId,
            ptin: ''
          });
        }
      });
    });
  }

  addToCalendar(course: any) {
    // console.log(course);
    var calendarData = [
      'data:text/calendar;charset=utf8,',
      'BEGIN:VCALENDAR',
      'PRODID:-//Syncfusion Inc//Scheduler//EN',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Calendar',
      'X-WR-TIMEZONE:Asia/Calcutta',
      'BEGIN:VEVENT',
      'LOCATION:' + course?.venue_location || '',
      'SUMMARY:' + course.title,
      'UID:' + course.id,
      'TRANSP:TRANSPARENT',
      'DTSTART;TZID=America/New_York:' +
      moment(course?.start_Date).format('YYYYMMDDTHHmmss'),
      'DTEND;TZID=America/New_York:' +
      moment(course?.end_Date).format('YYYYMMDDTHHmmss'),
      'DESCRIPTION:' + course?.short_desc || '',
      'ISREADONLY:false',
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    let calenderdataString: string = '';
    for (let [index, value] of calendarData.entries()) {
      if (typeof value != 'undefined') {
        calenderdataString += value;
        if (index != 0) {
          calenderdataString += '\n';
        }
      }
    }
    window.open(calenderdataString.trim());
  }

  getImage(data: any) {
    const format = JSON.parse(data?.formats);
    if (format === null) {
      return this.imageUrl + data?.url;
    }
    else {
      return this.imageUrl + format.thumbnail.url;
    }
  }
  checkout() {
    if (this.agreeTerms) {
      this.enrolls.map((data: any, index: any) => {
        if (data.name == '' && data.email == '') {
          this.enrolls.splice(index, 1);
        }
      });
      console.log('enrolls ', this.enrollments)
      this.addOrder();
    }
  }

  applyCoupon() {

    this.disableCouponButton = this.disableCouponButton + 1;



    this.couponErrMsg = '';
    if (this.couponValue != '') {
      this.cartService
        .applyCoupon(this.couponValue)
        .subscribe((couponResp: any) => {
          console.log("couponRes",couponResp);
          
          if (couponResp.statusCode == 200) 
           
           {
            // this.couponValue = couponResp.id;

            if (couponResp.amount_off != null) {


              if (couponResp.amount_off  >= this.finalPrice) {
                this.couponErrMsg = "Invalid Coupon."
                this.couponRes = false;
              }
              else {
                this.couponType = 'amountOff';
                this.finalPrice -= couponResp.amount_off ;
                this.finalPrice = this.finalPrice.toFixed(2)
                this.couponValueOFF = couponResp.amount_off;
                this.couponRes = true;
              }


            } else {
              this.couponType = 'percentOff'
              this.couponValueOFF = couponResp.percent_off;
              const discountedPrice:any = ((this.finalPrice * couponResp.percent_off) / 100).toFixed(2)
              this.finalPrice -= discountedPrice;
              this.finalPrice = this.finalPrice.toFixed(2)
              this.couponRes = true;
            }
          }
        }, (err)=>{
          if (err.error.error.status == 400 || err.error.error.status == 404) {
            this.couponErrMsg = 'Invalid coupon.';
            this.couponRes =false
  
          }
        });
    }
  }

  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;
      }
    });
  }

  addOrder() {
    this.gtagData = [];
    // console.log('cart items', this.cartItems);
    this.checkoutData = [];
    let checkPTIN = false;
    let checkName = false;
    let checklastname = false;

    let freeEvents: number = 0;
    let lengthOfCartItems = this.cartItems.length
    console.log('items', this.cartItems)

    this.cartItems.map((data: any, index: any) => {
      
      if (data.course.price === 0  && data.courseId>0) {
        freeEvents = freeEvents + 1;
      }else{
      
               if(data.course.price !=null && data.course.price==0 ){
                   freeEvents = freeEvents +1;
               }else{
                if(data.course.price == null  && data.course.includedCoursePrice == 0){
                  freeEvents = freeEvents+1;
                }
               }
      }




      const eachPrice:any = (data?.course?.discounted_price || data?.course?.discount) > 0
        ? (data?.course?.discounted_price || data?.course?.discount)
        : ((data?.course?.price) >= 0 && (data?.course?.price) !=null )? (data?.course?.price) : data?.course?.includedCoursePrice;
       
        let couponDiscountedPrice:any; 
       if(this.couponType=='percentOff'){
         const discountedAmount:any=((eachPrice*this.couponValueOFF)/100).toFixed(2)
          couponDiscountedPrice = (eachPrice -discountedAmount).toFixed(2)
       }
       else{
        const discountedAmount:any = ((this.couponValueOFF)/(lengthOfCartItems*data.qty)).toFixed(2)
        couponDiscountedPrice = (eachPrice -discountedAmount).toFixed(2)
        
       }
      // console.log("pric",couponDiscountedPrice);
      const priceIncents:any =  (couponDiscountedPrice*100).toFixed(0)
      
      this.checkoutData.push({
        name: data.course.title,
        default_price_data: {
          currency: 'USD',
          unit_amount_decimal: couponDiscountedPrice == null ? (0) : (priceIncents),
        },
        images: [this.imageUrl + data.course.url],
        qty: data.qty,
        // "qtyArray":qtyArray,
        coupon: '',
        orderId: 0,
        discountCoupon: this.couponRes ==true?{
          name: this.couponValue ? this.couponValue : '',
          value: this.couponValueOFF ? this.couponValueOFF : '',
          type:this.couponType ? this.couponType : '',
          email: localStorage.getItem('email')
        } :{}
      });

      this.gtagData.push(
        {
          "id": data.course.id,
          "name": data.course.title,
          "quantity": data.qty,
          "price": couponDiscountedPrice,
          "category": 'TaxCourse',
          "brand": "CPE",
        }
      );
      //console.log("course1",data.course);
      const format = JSON.parse(this.cartItems[index]['course']['formats']);
      let imageURL = format?.thumbnail?.url



      delete this.cartItems[index]['id'];
      this.cartItems[index]['title'] = this.cartItems[index]['course']['title'];

      //CALCULATING ACTUAL PRICEE OF THE PARTICULAR COURSE AND PACKAGE :-

      let particularPrice;
     
      if (this.cartItems[index]['course']['discount']>0 || this.cartItems[index]['course']['discounted_price']>0) {
        particularPrice = this.cartItems[index]['course']['discount'] || this.cartItems[index]['course']['discounted_price']
      } else if (this.cartItems[index]['course']['price']) {
        particularPrice = this.cartItems[index]['course']['price']
      } else {
        particularPrice = this.cartItems[index]['course']['includedCoursePrice']
      }

      // const particularPrice = this.cartItems[index]['course']['discount'] 
      // || this.cartItems[index]['course']['discounted_price'] ||  this.cartItems[index]['course']['includedCoursePrice']
      // ? this.cartItems[index]['course']['discount'] || this.cartItems[index]['course']['discounted_price'] ||  this.cartItems[index]['course']['includedCoursePrice'] :this.cartItems[index]['course']['price']
      console.log("particularPrice",particularPrice);
      
      this.cartItems[index]['price'] = particularPrice

      // PRICE  AFTER COUPON APPLIED (finalPrice)

      // console.log("cartItems",this.cartItems);
      
      let noOfEnroll =  this.cartItems[index].Enrolls.length
      // console.log("no of Enroll",noOfEnroll);
      

      if (this.couponValue != null && this.couponType == 'amountOff') {
        this.cartItems[index]['finalPrice'] = (particularPrice - (this.couponValueOFF / (lengthOfCartItems*noOfEnroll))).toFixed(2)
      } else if (this.couponValue != null && this.couponType == 'percentOff') {
        this.cartItems[index]['finalPrice'] = (particularPrice - (this.couponValueOFF * particularPrice) / 100).toFixed(2);
      }
      else {
        this.cartItems[index]['finalPrice'] = particularPrice;
      }

      this.cartItems[index]['category'] = this.cartItems[index]['course']['category'];
      this.cartItems[index]['imageUrl'] = imageURL
      // console.log("this.cartItems = ", this.cartItems[index], index)
      // this.enrolls.map((en: any, i: number) => {
      data?.Enrolls.map((en: any, i: number) => {
        // console.log('en === ', data.courseId, en.courseId);
        // console.log(
        //   'en === ',
        //   data.courseId,
        //   en.courseId,
        //   typeof this.enrolls[i]
        // );
        // if(data.courseId == en.courseId){
        this.cartItems[index]['title'] =
          this.cartItems[index]['course']['title'];


        delete this.cartItems[index]['Enrollment'];
        // delete this.cartItems[index]['course']['id']
        // console.log('cart item before del id', this.cartItems);

        delete this.cartItems[index]['id'];

        //  this.cartItems[index]['Enrolls'] = [this.enrolls[i]]
        // console.log('this.cartItems = ', this.cartItems[index], en.courseId);
        // }
        if (this.cartItems[index]['Enrolls'][i].ptin === '') {
          checkPTIN = true;
          // } else {

          //   this.cartItems[index]['Enrolls'][i].ptin = this.cartItems[index]['Enrolls'][i].ptin
          //   let ptinPattern = /^[p,P][1-9]+[0-9]*$/;
          //   const result: any = ptinPattern.test(
          //     this.cartItems[index]['Enrolls'][i].ptin
          //   );
          //   if (!result || this.cartItems[index]['Enrolls'][i].ptin.length != 9) {
          //     // let index  = i+1;
          //     this.errorText = true;
          //     this.ptinMessage = 'PTIN# must start with P, followed by 8 digits';
          //   }
          // }
        }
        if (this.cartItems[index]['Enrolls'][i].email === '') {
          this.checkEmail = true;
        } else {
          this.cartItems[index]['Enrolls'][i].email = this.cartItems[index]['Enrolls'][i].email
          let emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
          const result = emailPattern.test(
            this.cartItems[index]['Enrolls'][i].email
          );
          if (!result) {
            // let index  = i+1;
            this.emailMessage = 'please enter valid email address';
          }
        }

        if (this.cartItems[index]['Enrolls'][i].name === '') {
          checkName = true;
        }
        // else {
        //   this.cartItems[index]['Enrolls'][i].name = this.cartItems[index]['Enrolls'][i].name.toLowerCase()
        //   let namePattern = /^[a-zA-Z  ]*$/;
        //   const result: any = namePattern.test(
        //     this.cartItems[index]['Enrolls'][i].name
        //   );
        //   if (!result) {
        //     // let index  = i+1;
        //     this.errorText2 = true;
        //     this.firstnameMessage = 'Firstname must contain only alphabets';
        //   }
        // }

        if (this.cartItems[index]['Enrolls'][i].lastname === '') {
          checklastname = true;
        }
        // } else {

        //   this.cartItems[index]['Enrolls'][i].lastname = this.cartItems[index]['Enrolls'][i].lastname.toLowerCase()
        //   let namePattern = /^[a-zA-Z  ]*$/;
        //   const result: any = namePattern.test(
        //     this.cartItems[index]['Enrolls'][i].lastname
        //   );
        //   if (!result) {
        //     // let index  = i+1;
        //     this.errorText1 = true;
        //     this.lastnameMessage = 'Lastname must contain only alphabets';
        //   }
        // }
      });


    });
    //#region Validation

    if (checkName && checklastname && this.checkEmail) {
      // console.log("ok===========================")
      this.title = 'Please enter the firstname, lastname and email';
      this.openModal(this.title, false);
      return;
    }
    if (checkName) {
      this.title = "Firstname is required";
      // alert('Name is rquired');
      this.openModal(this.title, false);
      return;
    }
    if (checklastname) {
      this.title = 'Lastname is required';
      this.openModal(this.title, false);
      return;
    }
    if (this.checkEmail) {
      this.title = 'Email is required';
      // alert('Name is rquired');
      this.openModal(this.title, false);
      return;
    } else if (this.emailMessage != '') {
      this.title = 'Please enter valid email address for enrollments';
      // alert('Name is rquired');
      this.openModal(this.title, false);
      return;
    }



    if (this.errorText2) {
      // this.ptinMessage = 'PTIN# must start with P, followed by 8 digits';
      this.title = 'Firstname is required';
      this.openModal(this.title, false);
      return;
    }
    if (this.errorText1) {
      // this.ptinMessage = 'PTIN# must start with P, followed by 8 digits';
      this.title = 'Lastname is required';
      this.openModal(this.title, false);
      return;
    }
    if (this.errorText) {
      // this.ptinMessage = 'PTIN# must start with P, followed by 8 digits';
      this.title = 'PTIN# is required';
      this.openModal(this.title, false);
      return;
    }

    // console.log(this.cartData.data.userId,'userId=== order')
    // return false;


    //#endregion 


    const orderData = {

      data: {
        OrderItems: this.cartItems,
        userId: this.cartData.data.userId,
        totalPrice: this.cartData.data.total,
        discountCode: this.couponRes==true?this.couponValue :'',
        discountPrice: this.couponRes==true?this.couponValueOFF : 0,
        finalPrice: this.finalPrice,
        stripeOrderId: '',
        orderStatus: 'pending',
        discountType: this.couponRes==true?this.couponType:'',
        userName: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        receiptUrl: '',
      },
    };



    if (lengthOfCartItems !== freeEvents) {
      this.cartService.addOrder(orderData).subscribe((od: any) => {
        if (this.errorText) {
          return;
        } else {

          const orderId = od.data.id;
          console.log('od', od)
          const cid = localStorage.getItem('cid') || '';
          this.checkoutData.map((cd: any, index: any) => {
            this.checkoutData[index]['orderId'] = orderId;
            this.checkoutData[index]['customerid'] =
              localStorage.getItem('cid') || '';
            this.checkoutData[index]['email'] = localStorage.getItem('email') || '';
          });
          this.addGoogleTracking(orderId, od)

          this.checkoutUrl(this.checkoutData);
        }
      });
    }
    //  FOR FREE EVENTS 
    else {
      // UNIQUE ID FOR STRIPE
      const uniqueStripeId = Date.now().toString()
      orderData.data.orderStatus = 'succeeded'
      orderData.data.stripeOrderId = uniqueStripeId
      this.cartService.addOrder(orderData).subscribe((od: any) => {

        if (od?.data?.attributes?.orderStatus == 'succeeded') {
          const orderId = od.data.id;

          this.addGoogleTracking(orderId, od)

          // MAKING EVENT FOR FREE COURSES
          const eventData = {
            "type": "payment_intent.succeeded",
            "data": {
              "object": {
                "id": uniqueStripeId
              }
            }
          }
          this.cartService.updateOrderStatus(eventData).subscribe((res) => {

            if (res) {
              this.router.navigateByUrl('/success')
                .then(() => {
                  window.location.reload();
                });
            }
          })
        }
      })
    }
  }


  addGoogleTracking(orderid: string, orderData: any) {
 
    localStorage.setItem('oid', orderid);
    localStorage.setItem('odata', JSON.stringify(orderData));
    localStorage.setItem('ogtagdata', JSON.stringify(this.gtagData,));
    console.log(this.checkoutData)
    // console.log("orderData",orderData);
   
    console.log("orderDataPrice",orderData?.data?.attributes?.totalPrice,this.gtagData)
    this.gtagservice.pushEvent('checkout_progress',
    {
      "items": this.gtagData,
      "coupon": this.couponValue || '',
      'currency':'USD',
      'value': orderData?.data?.attributes?.totalPrice,
      "category": 'TaxCourse',
      "brand": "CPE", 
      "list_name": undefined,
      "list_position": 0,
      "variant": undefined,
    }
  );
  }
  openModal(title: any, btnStatus: boolean) {
    const initialState = {
      title: title,
      btnStatus: btnStatus,
    };
    this.modalRef = this.modalService.show(PopupComponent, {
      initialState,
      class: 'submit-popup modal-lg modal-dialog-centered',
      backdrop: 'static',
      keyboard: false,
      focus: btnStatus,
    });
  }

  checkoutUrl(data: any) {
    this.cartService.getCheckoutUrl(data).subscribe((ckData: any) => {
      // console.log('ckData = ', ckData);
      window.open(ckData.url, '_self');
    });
  }

  changed(evt: any, name: any, i_index: any) {
    this.name = name;
    this.i_index = i_index;

    // let ptinPattern = /^[p,P][1-9]+[0-9]*$/;
    // const result: any = ptinPattern.test(evt);
    // if (evt==='' ) {
    //   // let index  = i+1;
    //   this.errorText=true;
    //   this.ptinMessage = 'PTIN# is required';
    //   return;
    // }else{

    // }
    // if (!result && evt.length > 0 && evt.length != 9) {
    //   this.errorText = true;
    //   this.ptinMessage = 'Starts with P, followed by 8 digits (for EAS only)';
    //   this.ptinInfo = "";
    // } else {
    //   this.errorText = false;
    //   this.ptinInfo = "";
    //   this.ptinMessage = '';
    // }
  }

  lastnamechange(evt: any, name: any, i_index: any) {
    this.name = name;
    this.i_index = i_index;
    let namePattern = /^[a-zA-Z  ]*$/;
    const result1: any = namePattern.test(evt);
    if (evt === '') {
      // let index  = i+1;
      this.errorText1 = true;
      this.lastnameMessage = 'Lastname is required';
      return;
    }
    else {
      this.errorText1 = false;
      this.lastnameMessage = '';
    }
    // if (!result1) {
    //   // let index  = i+1;
    //   this.errorText1 = true;
    //   this.lastnameMessage = 'Lastname must contain only alphabets';
    // } else {
    //   this.errorText1 = false;
    //   this.lastnameMessage = '';
    // }

  }

  firstnamechange(evt: any, name: any, i_index: any) {
    this.name = name;
    this.i_index = i_index;
    if (evt === '') {
      // let index  = i+1;
      this.errorText2 = true;
      this.firstnameMessage = 'Firstname is required';
      return;
    } else {
      this.errorText2 = false;
      this.firstnameMessage = '';
    }
    let namePattern = /^[a-zA-Z ]*$/;
    // const result1: any = namePattern.test(evt);
    // if (!result1) {
    //   // let index  = i+1;
    //   this.errorText2 = true;
    //   this.firstnameMessage = 'Firstname must contain only alphabets';
    // }
    // else {
    //   this.errorText2 = false;
    //   this.firstnameMessage = '';
    // }

  }

  emailchange(evt: any, name: any, i_index: any) {
    this.name = name;
    this.i_index = i_index;
    let emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const result1: any = emailPattern.test(evt);
    if (evt === '') {
      // let index  = i+1;
      this.errorText3 = true;
      this.emailMessage = 'Email is required';
      return;
    }
    if (!result1) {
      // let index  = i+1;
      this.errorText3 = true;
      this.emailMessage = 'Please enter valid email address';
    } else {
      this.errorText3 = false;
      this.emailMessage = '';
    }

  }
}
