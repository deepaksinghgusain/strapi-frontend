import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CartService } from 'src/app/main/module/core/services/cart.service';
import { CourseService } from 'src/app/main/module/core/services/course.service';
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { SubSink } from 'subsink';
import { AuthService } from '../../services/auth.service';
import { LandingPageService } from 'src/app/main/module/core/services/landing-page.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  modalRef?: BsModalRef | null;
  modalRef2?: BsModalRef;
  submitted = false;
  loginForm!: FormGroup;
  successText: string = '';
  fieldTextType: boolean = false;
  title: any;
  count = 0;
  demo: any;
  courseId: any;
  checkCategory: any;
  userId: any;
  public unsubscribe$ = new SubSink()
  heroTitle: any;
  signinTitle: any;
  loginTitle: any;
  buttonTitle: any;
  imageUrl: String;
  heroImg: any;
  environmentUrl: string = '';


  constructor(private formBuilder: FormBuilder, private _modalService: BsModalService, private _commannService: CommanService, private cartService: CartService,
    public authenticationService: AuthService, private courseService: CourseService, private router: Router, private landingPageService: LandingPageService) {
    this.imageUrl = environment.imageEndPoint,
      this.authenticationService.showHero(this.router.url);
  }
  ngOnInit(): void {
    this.getLogindata()
    this.environmentUrl = environment.apibaseurl

    // let token = localStorage.getItem("token")

    //Validation Set
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
      password: ['', [Validators.required]],
      remember: false,
    });
    let rem = localStorage.getItem('remember');
    if (rem === 'true') {
      this.loginForm.patchValue({
        email: localStorage.getItem('rem_email'),
        password: localStorage.getItem('rem_pass'),
        remember: true,

      })
    } else {
      this.loginForm.patchValue({
        email: '',
        password: '',
        remember: false,
      })
    }

  }

  onSubmit() {
    this.count = 1;

    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {

      return;
    } else {
      localStorage.setItem('login', 'true');
      this.authenticationService.login(this.f['email'].value, this.f['password'].value).subscribe((res: any) => {
        if (res.jwt != null) {
          // GET USER CART
          localStorage.setItem('remember', this.loginForm.value.remember);
          localStorage.setItem('token', res.jwt);
          localStorage.setItem('username', res.user.firstName);
          localStorage.setItem('lastname', res.user.lastName);
          localStorage.setItem('userId', res.user.id);
          this.userId = res.user.id;
          localStorage.setItem('email', res.user.email);
          localStorage.setItem('PTIN', res.user.PTIN);

          this.authenticationService.currentUser$.next(res.jwt);
      
          if (this.loginForm.value.remember === true) {
            localStorage.setItem('rem_email', this.loginForm.value.email);
            localStorage.setItem('rem_pass', this.loginForm.value.password);
          } else {
            localStorage.removeItem('rem_email');
            localStorage.removeItem('rem_pass');
          }
          //GET CUSTOMER ID DETAILS 
          // this.getCustomerDetail(res.user.id)
          if (localStorage.getItem('slug')) {

            console.log("slug present")
            this.addToCart();



          } else {
            this.getcardCount();
            this.router.navigate(['/learner/dashboard'])
          }



        }

      },

        (err: any) => {
          if (err.error.error?.message === 'Invalid identifier or password') {
            this.title = 'Invalid email or password';
          }else if(err.error.error?.message==='Internal Server Error') {
            this.title = 'Invalid email or password';
          
          } else if (err.error.error?.message === 'Your account email is not confirmed' && err.error.error?.status === 400) {

            this.title = 'Your account email is not confirmed! Please confirm';
          }
          else {
            this.title = err.error.error?.message;
          }

          // this.title = 'Incorrect email or password';
          this.openModal(this.title, false)
          this.loginForm.reset();
        })
    }
  }

  addToCart() {
    let cart = localStorage.getItem('cartData') || ''
    let cartId = localStorage.getItem('cartId') || ''
    
    let cartData = JSON.parse(cart)
    cartData.data.userId=this.userId
    if (cartData)
      this.unsubscribe$.add(this.cartService.addToCart(cartData).subscribe(
        (resp: any) => {
          if (resp.data != null) {
            this.getcardCount();
            // SHOW MESSAGE (COURSE ADD SUCCESSFULL)
            localStorage.setItem('cartId', resp.data.id)
            this.router.navigateByUrl('/learner/shopping-cart')

          }
          else {
            // SHOW EROR MESSAGE (SOMETHING WENT WRONG)
          }
        }, (err: any) => {
          console.log(err);
        }))
  }

  getcardCount() {
    let cartId = localStorage.getItem('cartId') || 0;
    if (cartId > 0)
      this.cartService.getCart(cartId).subscribe({
        next: (resp: any) => {
          this._commannService.setCartQtyObs(resp?.data?.attributes?.CartItem.length)
        },
        error: (res: any) => {
          localStorage.setItem('cartId', '0');
          localStorage.setItem('cartQty', '0');
        }
      });
  }

  getOrderDetails(email: string) {

    let check = false;

    this.courseService.GetUserSubscribedCourses(email).subscribe(
      {
        next: (res: any) => {
          res?.data?.userCourses?.data.forEach((element: any) => {

            let course: any = element?.attributes?.course?.data;
            let title = course?.attributes["category"]?.data?.attributes["title"];

            if (title === 'Live Webcast' || title === 'In Person') {
              check = true;
            }
          })
          if (check)
            this.router.navigate(['/learner/dashboard'])
          else
            this.router.navigate(['/learner/self-study'])

        },
        error: (res: any) => {
          this.router.navigate(['/learner/dashboard'])
        }
      });

  }

  // GETTING CUSTOMER ID

  getCustomerDetail(userid: any) {

    this.cartService.getCardToken(userid).subscribe((res: any) => {
      // console.log(res);
      res.cid;
      localStorage.setItem('cid', res.cid);
    })
  };


  get f() { return this.loginForm.controls; }
  openModal(title: any, btnStatus: boolean) {
    this.count = 0;
    const initialState = {
      title: title,
      btnStatus: btnStatus

    };
    this.modalRef = this._modalService.show(PopupComponent, { initialState, class: 'submit-popup modal-lg modal-dialog-centered', backdrop: 'static', keyboard: false, focus: btnStatus });
  }

  getLogindata() {
    this.landingPageService.getLogin().subscribe((res: any) => {

      if (res) {
        this.heroTitle = res?.data?.attributes?.heroSection;
        this.heroImg = res?.data?.attributes?.heroSection.background.data.attributes.url
        this.loginTitle = res?.data?.attributes
        this.buttonTitle = res?.data?.attributes?.signinbutton[0]
      }
    });
  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
