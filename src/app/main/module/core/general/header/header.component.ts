import { CourseService } from './../../services/course.service';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CartService } from '../../services/cart.service';
import { LandingPageService } from '../../services/landing-page.service';
import { CommanService } from '../../sharedServices/comman.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  headerData: any;
  keyword = 'name';
  activeClass: boolean = false;
  data: any = []
  tokenCheck: any = false;
  @ViewChild('auto') auto: any;
  coursesData: any;
  searchbox: boolean = false;
  footerData: any;
  cartQty: any = "";
  cartData: any
  cartId = Number(localStorage.getItem('cartId')) || 0;
  headerlogo: any;
  environmentUrl: string = '';
  constructor(
    private router: Router,
    public authenticationService: AuthService,
    private modalService: BsModalService,
    private _landingPageService: LandingPageService,
    private courseService: CourseService,
    private cartService: CartService,
    private _commannService: CommanService) {
    this.environmentUrl = environment.apibaseurl;

    // this.tokenExists();
    this.getcourses();

    this._commannService.commanCartQtydata.subscribe((res: any) => {
      // setTimeout(() => { this.cartQty = res ; }, 10);
      this.cartQty = res;
    });
    this.authenticationService.currentUser$.subscribe((loginMessage) => {

      if (loginMessage) {

        this.tokenCheck = true;
      } else {
        this.tokenCheck = false;
      }
    });

  }

  ngOnInit(): void {

    this.getHeader();
    this.getCartQty()

  }

  getCartQty() {
    this._commannService.commanCartQtydata.subscribe((res: any) => {

      this.cartQty = res;
    });
  }

  tokenExists() {
    const isTokenExist = localStorage.getItem('token')
    if (isTokenExist) {
      this.tokenCheck = true;
    } else {
      this.tokenCheck = false;
    }
  }

  logout() {
    localStorage.removeItem('login');
  //removing url param for social media tracking
    // localStorage.removeItem('utmsource');
    // localStorage.removeItem('utmmedium');
    // localStorage.removeItem('utmcontent');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('cartId');
    localStorage.removeItem('login');
    localStorage.removeItem('userId');
    localStorage.removeItem('cartData');
    localStorage.removeItem('slug');
    localStorage.removeItem('FinalAnswerList');
    localStorage.removeItem('ogtagdata');
    localStorage.removeItem('odata');
    localStorage.removeItem('oid');
    this.modalService.hide();
    this.authenticationService.currentUser$.next(null);
    localStorage.setItem('cartQty', '0');
    this._commannService.setCartQtyObs(0);
    this.router.navigate(['/auth/login'])
  }

  getHeader() {
    this._landingPageService.getHeader().subscribe((res: any) => {
      if (res) {
        this.headerData = res?.data?.attributes?.navigation;
        this._commannService.getfooter(res);
        this.headerlogo = `${this.environmentUrl}` + res?.data?.attributes?.headerLogo?.data?.attributes?.url;

        if (this.headerlogo == undefined)
          this.headerlogo = "/../../../assets/params/images/logo/logo.svg"

      }
    });
  }

  getcourses() {
    this.courseService.getAllCourseForSearch('').subscribe((res: any) => {
      this.data = [];
      if (res) {

        res.data.courses.data.forEach((element: any) => {

          this.data.push({
            id: element.id,
            name: element.attributes?.title,
            slug: element.attributes?.slug
          })
        });


      }
    });
  }


  loginpopup() {
    this.modalRef = this.modalService.show(
      LoginComponent,
      Object.assign({}, { class: 'full-view-popup modal-lg' })
    );
    // Object.assign({}, { class: 'custom-video modal-lg' })
  }

  selectEvent(item: any) {
    // this.getcourses();
    // this.router.navigate(["['/course/course-detail', course?.id]")
    this.router.navigate(['/course/course-detail/' + item.slug])
    setTimeout(() => {
      this.showhideSerachbox()
    }, 1000);

    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    this.auto.close();
    // if(e.target.value ==''){
    // }
  }

  showhideSerachbox() {
    this.searchbox = !this.searchbox
    this.activeClass = !this.activeClass
  }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered modal-logout' })
    );

  }
  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;

      }
    })
  }

  close() {
    this.modalService.hide();
  }

}
