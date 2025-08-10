import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SecureCheckoutComponent } from '../secure-checkout/secure-checkout.component';
import { CartService } from '../../core/services/cart.service';
import { environment } from '../../../../../environments/environment';
import { CommanService } from '../../core/sharedServices/comman.service';
import { gTagService } from 'src/app/shared/gTagService.service';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  modalRef: BsModalRef | undefined;

  cartData: any;
  cartItems: any = [];
  imageUrl: any = environment.imageEndPoint;
  cartId = Number(localStorage.getItem('cartId')) || 0
  showEmpty: boolean = false;
  deleteCartItemPrice: any;
  deleteCartItemIndex: any = 0;


  constructor(private modalService: BsModalService, private gtagservice: gTagService, private cartService: CartService, private router: Router, private _commannService: CommanService) { }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
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
    this.getCartList();
  }

  openModal(template: TemplateRef<any>, cart: any, index: any) {
    this.deleteCartItemPrice = cart;
    this.deleteCartItemIndex = index;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered modal-trash' })
    );
  }

  close() {
    this.modalService.hide();
  }

  openModalWithquickview() {
    this.modalRef = this.modalService.show(
      SecureCheckoutComponent,
      Object.assign({}, { class: 'custom-popup-quick modal-lg' })
    );
    // Object.assign({}, { class: 'custom-video modal-lg' })
  }
  getCartList() {
    if (this.cartId > 0) {
      this.cartService.getCart(this.cartId).subscribe((resp: any) => {


        if (resp) {
          this.cartData.data = resp?.data?.attributes
          this.cartItems = this.cartData?.data?.CartItem;
          this._commannService.setCartQtyObs(this.cartItems?.length)
          this.showEmpty = this.cartItems?.length <= 0;
          console.log("cart Data =>", this.cartItems)
        }

      })
    } else {
      // SHOW MESSAGE YOUR CART IS EMPTY
      // eslint-disable-next-line no-alert

    }

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

  // update total of cart based on cartitems
  updateTotal() {
  
  
    let total = 0;
    this.cartData.data.CartItem.map((ci: any, index: any) => {
      console.log("ci",ci);
      if (ci.course != undefined) {
        total += ((ci.course.discountedPrice || ci.course.discounted_price || ci.course.discount) > 0) ? (ci.course.discount * ci.qty || ci.course.discountedPrice * ci.qty || ci.course.discounted_price * ci.qty) :
        (ci.packageId) == 0 ? (ci.course.price * ci.qty) : (ci.course.price * ci.qty)>0? (ci.course.price):(ci.course.includedCoursePrice * ci.qty);
      }
    });
    this.cartData.data.total = total
    this.cartData.data.finalPrice = total;
  }

  deleteItemFromCart(course: any, qty: any) {
    this.close();
    const cartId = Number(localStorage.getItem('cartId'))
    this.cartData.data.CartItem = this.cartData.data.CartItem.filter((data: any) => data.courseId != course.id && data.packageId != course.id)
    this.updateTotal()
    const courseqantity = qty;
    console.log(course)
    this.cartService.updateCart(this.cartData, cartId).subscribe((cartResp: any) => {

      this.gtagservice.pushEvent('remove_from_cart',
        {
          "id": course.id,
          "name": course.title,
          "quantity": courseqantity,
          "price": course.price,
          "category": 'TaxCourse',
          "brand": "CPE", 
          "list_name": undefined,
          "list_position": 0,
          "variant": undefined,
        }
      );

      // var qty = Number(localStorage.getItem('cartQty')) - 1;
      const qty = this.cartItems.length - 1;
      localStorage.setItem('cartQty', qty.toString())
      this.getCartList();
      if (qty <= 0) {
        this.deleteCart(cartId)
      }
      // this.getCartList();
    })
  }

  deleteCart(cartId: any) {
    this.cartService.deleteCart(cartId).subscribe((data: any) => {
      localStorage.setItem('cartId', '0')
      // SHOW MESSAGE ( YOUR CART IS EMPTY )
    })
  }

  checkout() {
    this.router.navigateByUrl('/learner/secure-checkout');
  }

}
