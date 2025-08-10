import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnyTxtRecord } from 'dns';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ContactUsService } from '../../services/contact-us.service';
import { LandingPageService } from '../../services/landing-page.service';
import { MetatagsService } from '../../services/metatags.service';
import { CommanService } from '../../sharedServices/comman.service';
import { OnDestroy } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, OnDestroy{
  modalRef: BsModalRef | undefined;
  footerData: any;
  contactusForm: FormGroup;
  submitted = false;
  countries: any = [];
  states: any = [];
  questionCategory: any = [];
  count = 0;
  successText: any;
  errorMsg: any = false;
  captcha!: string;
  email!: string;
  data: any;
  title: any;
  subtitle: any;
  button: any;
  image: any;
  result: any;
  thankyouText: any;
  imageUrl: any;
  private destroy$ = new Subject<void>();
  constructor(
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private _commannService: CommanService,
    private authService: AuthService,
    private contactUsservice: ContactUsService,
    private _modalService: BsModalService,
    private router: Router,
    private metaService: MetatagsService,
  ) {
    
    this.contactusForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      message: ['', Validators.required],
      company: [''],
      qType: ['', Validators.required],
      //country: ['', Validators.required],
      //province: ['', Validators.required],
      phone: [
        '', [Validators.pattern('^[0-9s]*$')]
        // Validators.compose([

        //   Validators.pattern('^[0-9s]*$'),
        //   Validators.maxLength(10),
        //   Validators.minLength(10),
        // ]),
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
          ),
        ]),
      ],
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private unsubscribe$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.getfooterSection()
    this.getPageContent();
    this.captcha = '';
    this.imageUrl = environment.imageEndPoint;
    this.questionCategory=['Registration issues or questions',
                            'Question about a Self Study course',
                            'Enquire about hosting a CPE Forum',
                            'Question about CPE',
                            'Topic suggestions',
                            'Interested in being a CPE Warehouse faculty or author',
                            'General Comment or suggestion for CPE Warehouse',
                            'Other' 
                          ];
    this.getData();
    this.handleGraphqlError();
  }

  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;
      }
    });
  }

  onSubmit(template: any) {
    this.count = 1;
    this.submitted = true;
    // stop here if form is invalid

    if (this.contactusForm.invalid) {
      return;
    }
    if (this.captcha === '') {
      this.errorMsg = true;
      this.successText = 'Please select captcha!';
      this.openModal(template);
      return;
    }
    let data = {
      data: {
        email: this.contactusForm.controls['email'].value,
        firstName: this.contactusForm.controls['firstName'].value,
        lastName: this.contactusForm.controls['lastName'].value,
        phoneNumber: this.contactusForm.controls['phone'].value,
        company: this.contactusForm.controls['company'].value,
        qType: this.contactusForm.controls['qType'].value,
        //country: this.contactusForm.controls['country'].value,
        //state: this.contactusForm.controls['province'].value,
        message: this.contactusForm.controls['message'].value,
      },
    };

    this.contactUsservice
      .contactUs(data)
      .pipe(
        catchError((error: any) => {
          // Handle API call error
          this.errorMsg = true;
          this.successText = 'Please try again! ';
          this.openModal(template);
          console.error('Contact Us API error:', error);
          // Optionally, show error message to the user
          return throwError(() => new Error('An error occurred while submitting the form.'));
        })
      )
      .subscribe((res) => {
        // Handle successful response
        if (res) {
          this.errorMsg = false;
          (this.thankyouText = 'Thank You'),
            (this.successText =
              'we will get back to you within 1 business day!');
          this.openModal(template);
        }
      });



    this.contactUsservice.contactUs(data).subscribe(
      (res) => {

        if (res) {
          this.errorMsg = false;
          (this.thankyouText = 'Thank You'),
            (this.successText =
              'we will get back to you within 1 business day!');
          this.openModal(template);
        }
        // this.contactusForm.reset()
      },
      (err) => {
        this.errorMsg = true;
        this.successText = 'Please try again! ';
        this.openModal(template);
      }
    );
  }

  getPageContent() {
    this.contactUsservice
      .getHeroSection('page', 'contact-us')
      .subscribe((res: any) => {
        if (res) {
          this.metaService.addSEOTags(res?.data[0]?.attributes?.seo);
          this.data = res?.data[0]?.attributes?.blocks.filter(
            (x: { __component: string }) =>
              x.__component === 'blocks.hero-image-with-titles'
          );
          this.title = this.data[0]?.title;
          this.subtitle = this.data[0]?.subTitle;
          // this.image=this.imageUrl+ this.data[0].backgroundImage?.data?.attributes.url
          this.button = this.data[0]?.button[0]?.label;
          this.cd.detectChanges();
        }
      });
      this._commannService.throwGraphqlError().subscribe(res => {
        console.log('getPageContent----- res --->', res);
      })
  }

  getState() {
    if (this.contactusForm.value.country != '') {
      this.authService
        .getStates(this.contactusForm.value.country)
        .subscribe((res: any) => {
          this.states = res.data.states;
        });
    } else {
      this.states = [];
    }
  }

  getData() {
    this.authService.getCountries().subscribe((res: any) => {
      this.countries = res.data;
    });
  }

  get f() {
    return this.contactusForm.controls;
  }

  openModal(template: TemplateRef<any>) {
    this.count = 0;
    this.modalRef = this._modalService.show(
      template,
      Object.assign(
        {},
        { class: 'submit-popup modal-lg modal-dialog-centered' }
      )
    );
  }

  close() {
    this._modalService.hide();
    this.router.navigate(['']);
  }

  resolved(event: any) {
    this.captcha = event;
  }

  private handleGraphqlError(): void {
    this._commannService.throwGraphqlError()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('GraphQL error response:', res);
          // Optionally, handle GraphQL error response
        },
        error: (error) => {
          console.error('GraphQL error:', error);
          // Optionally, show error message to the user
        }
      });
  }
}
