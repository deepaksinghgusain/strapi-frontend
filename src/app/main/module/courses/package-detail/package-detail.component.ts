import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CourseService } from '../../core/services/course.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CourseQuickViewComponent } from '../course-quick-view/course-quick-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CommanService } from '../../core/sharedServices/comman.service';
import { MetatagsService } from '../../core/services/metatags.service';
import { SeoTags } from '../../core/models/meta-tag';







@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css']
})
export class PackageDetailComponent implements OnInit {

  slug: any = 1;
  
  packageData: any;
  packageDetail: any;

  seats: any = 1;
  imageUrl: any = environment.imageEndPoint
  apiSection: any;
  heroImageSection: any
  backGroundImageUrl: any
  packageOutline: any;
  faq: any
  courseId: any;
  modalRef: BsModalRef | undefined;
  totalCoursePrice: any = 0;
  courseCount: number = 0;
  showCourseIncluded: any = true
  CartItem: any = [];
  totalPrice: any = 0;
  finalPrice: any = 0;
  packageId: any;
  actualPrice: any;
  cartData: any;
  PackageCourses: any = []
  cartId = Number(localStorage.getItem('cartId')) || 0;
  hasExpiredCourses:any=false;
  @ViewChild('template1')
  template1!: TemplateRef<any>;
  @ViewChild('template2')
  template2!: TemplateRef<any>;
  isEmptyPackage:any=false;

  constructor(
    private courseService: CourseService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private _commannService: CommanService,
    private metaService: MetatagsService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.slug = this.activatedRoute.snapshot.params['slug']

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
    })
  }

  ngOnInit(): void {
    // calling get package method //
    if (this.cartId > 0)
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
    this.getPackageGql(this.slug)
    // callling get package detail page method//
    this.getPackagePage()

  }

  // GETTING PACKAGE PAGE //

  getPackagePage() {
    this.courseService.packageDetailPage().subscribe((res: any) => {
      this.heroImageSection = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.hero-image-with-button')[0];
      this.apiSection = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.api-section')[0];
      this.backGroundImageUrl = environment.imageEndPoint + this.heroImageSection?.ackgroundImage?.data?.attributes?.formats?.large?.url
    })
  }
  // GETTING PACKAGE BY SLUG //

  //   getPackage(slug:any) {

  //     this.courseService.getPackageDetail(slug).subscribe((res:any)=>{
  //       this.packageData= res?.data?.attributes
  //       console.log("packageDAtA=>",this.packageData);

  //       this.packageOutline = this.packageData?.outline
  //       this.faq = this.packageData?.faqs?.faq[0]?.answer

  //       this.packageId=res.data.id
  //       console.log(res.data);



  //       calling total price method//

  //  this.getTotalPrice()
  //  this.priceGetter()


  //     })
  //   }

  getPackageGql(slug: string) {
    let ids :any = [];
    this.courseService.getPackageDetailbByGql(slug).subscribe((res: any) => {
      if (res?.data?.packages?.data[0]) {
        this.packageData = res.data.packages.data[0].attributes;
        if (this.packageData) {
          const seoObj: Partial<SeoTags> = {
            metaTitle: this.packageData.title,
            metaImage: this.packageData.image,
            metaDescription: this.packageData.title,
            metaSocial: [
              {
                socialNetwork: "Facebook",
                title: this.packageData.title,
                description: this.packageData.title
              },
              {
                socialNetwork: "Twitter",
                title: this.packageData.title,
                description: this.packageData.title
              }
            ]
          }
  
          if (this.packageData.keywords) {
            seoObj.keywords = this.packageData.keywords
          }
  
          this.metaService.addSEOTags(seoObj as any);
        } else {
          this.metaService.clearSEOTags();
        }
        console.log("package Data", this.packageData);
        let name = ''
        this.packageData?.courses?.data.forEach((element: any) => {
          const facultyname = this.getInstructorName(element?.attributes?.instructors)
       this.PackageCourses.push({
            'title': element?.attributes.title,
            'id': element?.id,
            'price': element?.attributes.price,
            'startDate': element?.attributes.startDate,
            'image': element?.attributes.image,
            'slug': element?.attributes.slug,
            'instructor': facultyname,
            'category':element.attributes.category.data.attributes.title,
          });
        });
        this.packageOutline = this.packageData?.outline
        this.faq = this.packageData?.faqs?.faq[0]?.answer
        this.packageId = res?.data?.packages?.data[0]?.id
      }

      this.getTotalPrice()
      this.priceGetter()
      this.packageExpirationCheck()
      this.emptyPackageCheck()
    })
  }


  getInstructorName(instructors: any) {
    const name: string[] = []
    instructors.data.forEach((element: any, index: number) => {

      name.push(element?.attributes?.firstName + ' ' + element?.attributes.lastName)
    })

    return name.join(',');
  }
  // INCREAMENTER AND DECREMENTER //

  seatIncrementer() {
    let quantity = this.seats

    if (quantity < 9) {
      quantity = quantity + 1
      this.seats = quantity
    }

    return
  }
  seatDecrementer() {
    let quantity = this.seats
    if (quantity > 1) {
      quantity = quantity - 1
      this.seats = quantity
    }
    return
  }

  // OPENING QUICK VIEW //

  openModalWithquickview(id: any) {
    this.courseId = id


    this.modalRef = this.modalService.show(
      CourseQuickViewComponent,
      Object.assign({}, { class: 'custom-popup-quick modal-lg', id })
    );

  }

  // CALCULATING THE PRICE OF PACKAGE ON THE BASIS OF COURSE PRICE//

  getTotalPrice() {
   // this.totalCoursePrice
    this.packageData?.courses?.data?.forEach((element: any) => {
      this.courseCount = this.courseCount + 1
      const price =Number(element?.attributes?.discount)>0 ? Number(element?.attributes?.discount) : element?.attributes?.price
      this.totalCoursePrice = this.totalCoursePrice + price
    });
    return this.totalCoursePrice
  }

  // checking expired courses in package
     packageExpirationCheck() {
     
       const filteredArray  = this.packageData?.courses?.data.filter((element:any)=>{
        const endDate = new Date(element.attributes.endDate).getTime()
        const currDate = Date.now()
         
          
        return (element.attributes?.category?.data?.attributes?.title).toLowerCase()=='live' && endDate < currDate
        })
      
        if(filteredArray.length>0) {
         this.hasExpiredCourses=true;
        }
    
    }

    emptyPackageCheck(){
     if(this.courseCount==0)
      this.isEmptyPackage = true;
    }
    
  faqTabCalled() {

    this.showCourseIncluded = false
  }
  outlineTabCalled() {
    this.showCourseIncluded = true
  }

  /* actual price getter */

  priceGetter() {
    if (this.packageData.price != null && this.packageData.price != undefined && this.packageData.price >= 0) {
      this.actualPrice = this.packageData.price
      //this.totalCoursePrice=this.packageData.price
    }
    else {
      this.actualPrice = this.totalCoursePrice
    }
  }
  

  
  // ENROLL NOW FUNCTIONAITY//
  enrollNow2(selectedPackage: any) {
     if(this.hasExpiredCourses){
      this.openModal(this.template1)

     }else if(this.isEmptyPackage){
      this.openModal(this.template2)
     }
     else{
      console.log('selected course', selectedPackage)
      localStorage.setItem("slug", this.slug)
      const price = selectedPackage.price
      const totalprice = this.totalCoursePrice;
     
      
  
      const objCopy = { ... this.packageData }; // ??? create copy of object
     // objCopy.newprice = this.totalCoursePrice;
     objCopy.newprice = this.actualPrice
      this.packageData = objCopy
     
      
      // console.log(objCopy);
  
      console.log('coursedetial', this.packageData);
      if (localStorage.getItem('token')) {
        if (this.cartId == 0 && this.packageId > 0) {
          this.addItem({
            "courseId": 0,
            "qty": this.seats,
            "packageId": Number(this.packageId),
            "course": this.packageData,
            "Enrollment": []
          });
  
          //const totalprice = (selectedPackage?.discountedPrice) ? (selectedPackage?.discountedPrice * this.seats) : (selectedPackage?.price * this.seats)
          console.log("total price", totalprice, selectedPackage);
          this.updateTotal();
          //this.cartData.data.total = totalprice
          //this.cartData.data.finalPrice = totalprice;
          this.cartService.addToCart(this.cartData).subscribe((resp: any) => {
            if (resp.data != null) {
              // SHOW MESSAGE (COURSE ADD SUCCESSFULL)
              localStorage.setItem('cartId', resp.data.id)
              localStorage.setItem('cartQty', '1')
              this.router.navigateByUrl('/learner/shopping-cart')
            } else {
  
              // SHOW EROR MESSAGE (SOMETHING WENT WRONG)
            }
          })
        }
        if (this.cartId > 0) {
          // check if item being selected already exists
          const matchingCourse = this.cartData.data.CartItem.filter((data: any) => data.packageId == this.packageId)[0] || undefined;
          if (matchingCourse != undefined || matchingCourse != null) {
            // update quantity 
            matchingCourse.qty = this.seats
          }
          
          else {
            this.cartData.data.total = totalprice
            this.cartData.data.finalPrice = totalprice;
            // its new item to be added 
            this.addItem({
              "courseId": 0,
              "qty": this.seats,
              "course": this.packageData,
              "packageId": Number(this.packageId),
              "Enrollment": []
            });
          }
          console.log(' cart after modification', this.cartData)
  
        }
        this.updateTotal();
        this.updateCart();
  
      }
      else {
        this.addItem({
          "courseId": 0,
          "qty": this.seats,
          "packageId": Number(this.packageId),
          "course": this.packageData,
          "Enrollment": []
        });
        this.updateTotal();
       // const totalprice = this.totalCoursePrice
        // const totalprice = (selectedPackage?.discountedPrice) ? (selectedPackage?.discountedPrice * this.seats) : (selectedPackage?.price * this.seats)
      //  this.cartData.data.total = this.cartData.data.total * this.seats
        //this.cartData.data.finalPrice = this.cartData.data.total * this.seats
        localStorage.setItem('cartData', JSON.stringify(this.cartData));
        this.router.navigate(['/auth/login'])
      }
  
     }
  }

  updateTotal() {
    let total = 0;
    this.cartData.data.CartItem.map((ci: any, index: any) => {
     
      

      if (ci.course != undefined) {
          
           if((ci.course.discountedPrice || ci.course.discounted_price || ci.course.discount) > 0){
              total+=ci.course.discountedPrice * ci.qty || ci.course.discounted_price * ci.qty || ci.course.discount*ci.qty
           }else{
             if(ci.packageId==0 ){
                total += ci.course.price* ci.qty ;
             }
             else{
               if(ci.course.newprice !=null || ci.course.price!=null){
                total +=(ci.course.newprice * ci.qty )|| (ci.course.price *ci.qty)
               }
               else{
                total +=ci.course.includedCoursePrice * ci.qty 
               }
             }
           }
         
        // total += ((ci.course.discountedPrice || ci.course.discounted_price) > 0) ?
        //   (ci.course.discountedPrice * ci.qty || ci.course.discounted_price * ci.qty) :
        //   (ci.course.price * ci.qty && ci.packageId==0) >= 0 ? (ci.course.price * ci.qty) : (ci.course.newprice * ci.qty) > 0 ? ci.course.newprice * ci.qty : ci.course.includedCoursePrice * ci.qty;

      }
    });
    this.cartData.data.total = total
    this.cartData.data.finalPrice = total;
  }

  updateCart() {
    localStorage.setItem('cartQty', this.cartData.data.CartItem.length)
    this._commannService.setCartQtyObs(this.cartData.data.CartItem.length)
    this.cartService.updateCart(this.cartData, this.cartId).subscribe((cartResp: any) => {
      this.router.navigateByUrl('/learner/shopping-cart');
    });
  }

  addItem(item: any) {
    if (this.cartData.data.CartItem === undefined || this.cartData.data.CartItem === null)
      this.cartData.data.CartItem = [];
    this.cartData.data.CartItem.push(item);
  }

  // hide model
  closeM(){
    this.modalService.hide();
  }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered modal-exams' })
    );

  }

}
