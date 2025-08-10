import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LandingPageService } from 'src/app/main/module/core/services/landing-page.service';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { AuthService } from '../../services/auth.service';
import Validation from '../../validator/validation';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  modalRef!: BsModalRef;
  signInForm!: FormGroup;
  imageUrl: String;

  submitted = false;
  fieldTextType: boolean = false; heroTitle: any;
  formTitle: any;
  buttonTitle: any;
  heroImg: any;
  ;
  changeType: boolean = false;
  passwordsNotMatching: any;
  successText: string = 'account successfully created!';
  title: any;
  environmentUrl: string = '';
  errorMsg: any = false;
  passwordMatch: boolean = false;
  count = 0;
  countries: any = [];
  states: any = [];
  match :boolean =false;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private landingPageService: LandingPageService,

    private _modalService: BsModalService, private _router: Router) {
    this.imageUrl = environment.imageEndPoint
    this.authService.showHero(this._router.url);
  }
  ngOnInit(): void {
    this.getSignupeData()
    this.getData();
    this.environmentUrl = environment.apibaseurl


    // Validation Set
    this.signInForm = this.formBuilder.group({
      // firstname: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z  ]*$")])],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      middlename: [''],
      companyname: [''],
      country: ['', Validators.required],
      province: ['', Validators.required],
      address1: [''],
      // Pcode: ['', Validators.required],  
      Pcode: ['', ''],
      newsletter1: [false, Validators.requiredTrue],
      newsletter2: [false, Validators.requiredTrue],
      phone: ['', Validators.compose([Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.required],
    }
      // ,
      // {
      //   validators: [Validation.match('password', 'confirmPassword')]
      // }
    );
  }

  onSubmit() {
    this.count = 1;
    this.submitted = true;
    // stop here if form is invalid
    if (this.signInForm.invalid) {
      return;

    }

    localStorage.setItem('register', 'true');
    localStorage.setItem('email', this.signInForm.controls['email'].value);
    let data = {
      "username": this.signInForm.controls['email'].value,
      "email": this.signInForm.controls['email'].value,
      "password": this.signInForm.controls['password'].value,
      "firstName": this.signInForm.controls['firstname'].value,
      "lastName": this.signInForm.controls['lastname'].value,
      "middleName": this.signInForm.controls['middlename'].value,
      "address1": this.signInForm.controls['address1'].value,
      "phone": this.signInForm.controls['phone'].value,
      "PTIN": this.signInForm.controls['Pcode'].value,
      "companyName": this.signInForm.controls['companyname'].value,
      "country": this.signInForm.controls['country'].value,
      "state": this.signInForm.controls['province'].value
    }
    this.authService.registerUser(data).subscribe(res => {
      
      if (res) {

        this.successText = 'account successfully created!'
        this.openModal(this.successText, true)

      }
    }, (err => {

      this.errorMsg = true;
      if (err.error.error.message === 'Email is already taken') {
        this.title = 'Email is already registered';
      } else if(err.error.error?.message==='Internal Server Error') {
        this.title = 'Email is already registered';
      
      } 
      else if (err.error.error.message === 'token.invalid' && err.error.error.status === 400) {
        this.title = 'Token already redeemed';
        this._router.navigate(['/auth/login'])
      } else if (err.error.error.message === 'An error occurred during account creation' && err.error.error.status === 400) {
        this.title = 'Something went wrong ! Please try again.';
      }
      else {
        this.title = err.error.error.message;
      }
      this.openModal(this.title, false)
    })
    )

  }

  getState() {
    if (this.signInForm.value.country != '') {
      this.authService.getStates(this.signInForm.value.country).subscribe((res: any) => {
        this.states = res.data.states;
      })
    } else {
      this.states = []
    }

  }
  getData() {
    this.authService.getCountries().subscribe((res: any) => {
      this.countries = res.data;
    })
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleCPFieldTextType() {
    this.changeType = !this.changeType;
  }

  get f() { return this.signInForm.controls; }

  openModal(title: any, btnStatus: boolean) {
    this.count = 0;
    const initialState = {
      title: title,
      btnStatus: btnStatus

    };
    this.modalRef = this._modalService.show(PopupComponent, { initialState, class: 'submit-popup modal-lg modal-dialog-centered', backdrop: 'static', keyboard: false, focus: btnStatus });

  }

  gotoLoginpage() {
    this._router.navigate(['/auth/login']);
  }

  getSignupeData() {
    this.landingPageService.getSignup().subscribe((res: any) => {

      if (res) {
        this.heroTitle = res?.data?.attributes?.heroSection;
        this.heroImg = res?.data?.attributes?.heroSection.background.data.attributes.url
        this.formTitle = res?.data?.attributes;
        this.buttonTitle = res?.data?.attributes?.signupButton[0];
      }
    });
  }


  checkMatch() {
    if ((this.signInForm.controls['password'].value === this.signInForm.controls['confirmPassword'].value) && this.signInForm.controls['password'].value !='' && this.signInForm.controls['confirmPassword'].value !='') {
      this.passwordMatch = true
} else { 
      this.passwordMatch = false;
    }

    if(this.signInForm.controls['firstname'].value!='' && this.signInForm.controls['lastname'].value!=''
     && this.signInForm.controls['country'].value!='' && this.signInForm.controls['province'].value!='' && this.signInForm.controls['newsletter1'].value!='' 
     && this.signInForm.controls['newsletter2'].value!='' && this.signInForm.controls['email'].value!='' && this.signInForm.controls['password'].value!='' && this.signInForm.controls['confirmPassword'].value!='' && this.signInForm.controls['password'].value === this.signInForm.controls['confirmPassword'].value)
     {
      this.match = true
     }else
     {
      this.match = false
     }
}
}