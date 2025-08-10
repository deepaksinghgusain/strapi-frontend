import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = environment.apibaseurl

  constructor(private http: HttpClient) { }

  addToCart(data: any) {
    return this.http.post(`${this.baseUrl}/api/carts`, data)
  }

  updateCart(data: any, cartId: any) {
    return this.http.put(`${this.baseUrl}/api/carts/${cartId}`, data)
  }

  deleteCart(cartId: any) {

    return this.http.delete(`${this.baseUrl}/api/carts/${cartId}`)
  }

  getCart(cartId: any) {

    return this.http.get(`${this.baseUrl}/api/carts/${cartId}?populate=deep`)
  }

  applyCoupon(couponCode: any) {

    // return this.http.get(`${this.baseUrl}/api/coupons/${couponCode.trim()}`)
      return this.http.get(`${this.baseUrl}/api/validateCoupon/${couponCode.trim()}`)

  }

  addOrder(data: any) {

    return this.http.post(`${this.baseUrl}/api/orders`, data)
  }

  getCheckoutUrl(data: any) {
    return this.http.post(`${this.baseUrl}/api/checkout`, data)
  }

  getCardToken(userId: any) {
    return this.http.get(`${this.baseUrl}/api/user-card-tokens/${userId}`)
  }

  updateOrderStatus(data: any) {
    return this.http.post(`${this.baseUrl}/api/orderUpdate`, data)
  }

  postLog(data:any){
    return this.http.post(`${this.baseUrl}/api/logs`, data)
  }


  createCard(data: any) {
    let obj = {
      data: data
    }

    return this.http.post(`${this.baseUrl}/api/user-card-tokens`, obj)
  }
}
