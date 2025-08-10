import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/main/module/core/services/cart.service';
import { CourseService } from 'src/app/main/module/core/services/course.service';
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';
import { Title } from '@angular/platform-browser';


import { gTagService } from '../../gTagService.service';
declare const gtag: Function;

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  cartData: any;
  eventPushed = false;
  constructor(
    private _commannService: CommanService,
    private gtagservice: gTagService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private courseService:CourseService,
    private titleService:Title,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}
  orderId = Number(localStorage.getItem('oid')) || 0;
  gtagData: { id: any; name: any; quantity: any; price: any }[] = [];
  stripeSessionId: any;
  cartItems: any = [];
  itemsArray:any= []
  ngOnInit(): void {
  
    if (isPlatformBrowser(this.platformId)) {
      this.activatedRoute.params.subscribe((params) => {
        this.stripeSessionId = this.activatedRoute.snapshot.queryParams['session_id'] || null;
      });
      this.gtagData = JSON.parse(localStorage.getItem('ogtagdata') || '{}');
      const checkoutdata = JSON.parse(localStorage.getItem('odata') || '{}');
      // console.log('gtagdata', this.gtagData);
      // console.log('checkoutdata', checkoutdata);
      //this.getCartList()
     
      if (this.stripeSessionId!=null) {
       
        this.courseService.getOrderBySessinId(this.stripeSessionId).subscribe((res: any) => {
          console.log('res==>', res,res.data.orders.data[0],res.data.orders.data.length); 
          this.orderId = res.data.orders.data[0].id
          this.titleService.setTitle(`CPE Warehouse-success#${this.orderId}`);
            if (res.data.orders.data.length > 0) {
            if (res.data.orders.data[0].attributes.orderStatus == 'succeeded' || res.data.orders.data[0].attributes.orderStatus == 'pending') {
              res.data.orders.data[0].attributes.OrderItems.map((od:any)=>{
                this.itemsArray.push( {
                  "id": od.courseId>0?od.courseId:od.packageId,
                  "name": od.title,
                  "quantity": od.Enrolls.length,
                  "price": od.price,
                  "category": 'TaxCourse',
                  "brand": "CPE",
                })
              })
              if (this.itemsArray.length>0)
                this.gtagservice.pushEvent('purchase', {
                  transaction_id: this.orderId,
                  value: res.data.orders.data[0].attributes.finalPrice,
                  currency: 'USD',
                  shipping: 0,
                  tax: 0,
                  items: this.itemsArray,
                });
              let gtagLog = {
                data: {
                  userId: res.data.orders.data[0].attributes.userId,
                  orderId: this.orderId,
                  email: res.data.orders.data[0].attributes.email,
                  status:res.data.orders.data[0].attributes.orderStatus,
                  purchaseDate:new Date().toISOString(),
                  gtagData: {
                    transaction_id: this.orderId,
                    value:res.data.orders.data[0].attributes.finalPrice,
                    currency: 'USD',
                    shipping: 0,
                    tax: 0,
                    items: this.itemsArray,
                  },
                },
              };
             
              this.postGtagLog(gtagLog);
              this.eventPushed = true;
              localStorage.setItem('cartId', '0');
              localStorage.setItem('cartQty', '0');
              localStorage.setItem('ogtagdata', '');
              localStorage.setItem('odata', '');
              localStorage.setItem('oid', '');
            }
          }
        });
      }else{
        localStorage.setItem('cartId', '0');
        localStorage.setItem('cartQty', '0');
        localStorage.setItem('ogtagdata', '');
        localStorage.setItem('odata', '');
        localStorage.setItem('oid', '');
        this.eventPushed = true;
       
      }
    } else {
      console.log('isPlatformBrowser==>', isPlatformBrowser(this.platformId));
    }
  }

  postGtagLog(data: any) {
    this.cartService.postLog(data).subscribe((res: any) => {
      console.log('gtaglogPushed');
    });
  }
  getCartList() {
    const analyticProductData: {
      id: any;
      name: any;
      quantity: any;
      price: any;
    }[] = [];
    const finalprice = 0;

    // this.cartService.getCart(this.cartId).subscribe((resp: any) => {
    //   console.log("cart Data", resp);

    //   this.cartData.data = resp.data.attributes;
    //   this.cartItems = this.cartData.data.CartItem;
    //   this.cartItems?.map((course: any, index: any) => {
    //     const realPrice = course.discount != null ? course.discount : course.price

    //     if (course.packageId === 0) {
    //       analyticProductData.push(
    //         {
    //           "id": course.courseId,
    //           "name": course.title,
    //           "quantity": course.qty,
    //           "price": realPrice,
    //         }
    //       );
    //     }
    //     else {
    //       analyticProductData.push(
    //         {
    //           "id": course.packageId,
    //           "name": course.title,
    //           "quantity": course.qty,
    //           "price": realPrice,
    //         }
    //       );
    //     }

    //   })
    //   // now send purchase event
    //   this.gtagservice.pushEvent('purchase',
    //     {
    //       "value": resp?.data?.attributes?.finalPrice,
    //       "currency": "USD",
    //       "shipping": 0,
    //       "items": analyticProductData
    //     }
    //   );

    // });
  }


  
}
