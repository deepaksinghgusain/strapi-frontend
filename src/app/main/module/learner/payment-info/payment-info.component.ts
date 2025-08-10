import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CartService } from '../../core/services/cart.service';
import { CommanService } from '../../core/sharedServices/comman.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css'],
})
export class PaymentInfoComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  footerData: any;
  data: any;
  userId: any;
  count = 0;
  editPaymentForm!: FormGroup;
  submitted = false;
  editFields = '';
  cartExists: any;
  month = '';
  year = '';
  errorMsg: any;
  successText: any;
  Exp_year = '';
  cardId='';
  customerId='';
  currentYear:any;
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _commannService: CommanService,
    private cartService: CartService
  ) {
    this.getCardDetails();
  }
  ngOnInit(): void {
    this.currentYear= new Date().getFullYear(); 
    console.log("current year",this.currentYear.toString().split('20')[1])
    this.editPaymentForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.pattern('^[a-zA-Z_ ]*$'),
          Validators.required,
        ]),
      ],
      cardNumber: [
        '',
        Validators.compose([
          Validators.pattern('^[0-9s]*$'),
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ]),
      ],
      ExpiryDate: [
        '',
        Validators.compose([
          Validators.pattern('^(0[1-9]|1[0-2])/?([0-9]{2})$'),
          Validators.required,
        ]),
      ],
      cvv: [
        '',
        Validators.compose([
          Validators.pattern('^[0-9s]*$'),
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(4),
        ]),
      ],
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign(
        {},
        { class: 'submit-popup modal-lg modal-dialog-centered' }
      )
    );
  }
  onEnableControl(cntrl: any) {
    this.editFields = cntrl;
  }
  get f() {
    return this.editPaymentForm.controls;
  }

  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;
      }
    });
  }

  close() {
    this.modalService.hide();
  }

  getCardDetails() {
    this.userId = localStorage.getItem('userId');
    this.cartService.getCardToken(this.userId).subscribe((res: any) => {
this.cardId=res.data.id
this.customerId=res.data.customer
      if (res && res.data) {
        this.Exp_year = res?.data?.exp_year.toString().split('20');
        console.log("exp year",this.Exp_year)
        this.cartExists = res;
        this.editPaymentForm.patchValue({
          name: res?.data?.name,
          cardNumber: '************' + res?.data?.last4,
          ExpiryDate: res?.data?.exp_month + '/' + this.Exp_year[1],
          cvv: 123,
        });
      }
    });
  }

  onSubmit(template: any) {
    this.count = 1;
    this.submitted = true;
    // stop here if form is invalid
    if (this.editPaymentForm.invalid) {
      return;
    }

    if (this.cartExists) {
      //update
      this.Exp_year = this.f['ExpiryDate'].value.split('/');
      this.month = this.Exp_year[0];
      this.year = this.Exp_year[1];
      
      let yearCheck=this.currentYear.toString().split('20')[1]
      console.log("yearCheck",yearCheck)
      if(this.year<yearCheck){
        this.errorMsg = true;
        this.successText = 'Card is expired. Please try again';
        // this.openModal(template);
        return;
      }
      this.data = {

        userId: localStorage.getItem('userId'),
        email: localStorage.getItem('email'),
        cardNumber: this.f['cardNumber'].value,
        stripeCustomerId: this.customerId,
        stripeCardId: this.cardId,
        expMonth: this.month,
        expYear: this.year,
        name: this.f['name'].value,
      };
      this.cartService.createCard(this.data).subscribe((res: any) => {
   
        if (res.statusCode === 402 && res.code === 'incorrect_number') {
          this.errorMsg = true;
          this.successText = 'Incorrect Card Number . Please try again !';
          this.openModal(template);
        } else if (
          res.statusCode === 402 &&
          res.code === 'invalid_expiry_year'
        ) {
          this.errorMsg = true;
          this.successText = 'Incorrect Expiry Date . Please try again !';
          this.openModal(template);
        } else {
          this.errorMsg = false;
          this.successText = 'payment successfully updated!';
          this.openModal(template);
        }
      });
    } else {
      //add
      let newDate = this.editPaymentForm.value.ExpiryDate.split('/');
      this.month = newDate[0];
      this.year = newDate[1];
      let yearCheck=this.currentYear.toString().split('20')[1]
      if(this.year<yearCheck){
        this.errorMsg = true;
        this.successText = 'Card is expired. Please try again';
        // this.openModal(template);
        return;
      }
      this.data = {
        userId: this.userId,
        email: localStorage.getItem('email'),
        cardNumber: this.f['cardNumber'].value,
        stripeCustomerId: '',
        stripeCardId: '',
        expMonth: this.month,
        expYear: this.year,
        name: this.f['name'].value,
      };
      this.cartService.createCard(this.data).subscribe((res: any) => {
        this.errorMsg = false;
        this.successText = 'Card Created Successfully !';
        this.openModal(template);
      });
    }
  }

  checkExpiry(event: any) {
    let count;
    if (event.inputType !== 'deleteContentBackward') {
      if (this.editPaymentForm.value.ExpiryDate.length <= 2) {
        count = 0;
      }

      if (this.editPaymentForm.value.ExpiryDate.length === 2 && count == 0) {
        this.editPaymentForm.patchValue({
          ExpiryDate: this.editPaymentForm.value.ExpiryDate + '/',
        });
        count = 2;
      }
    }
  }
}
