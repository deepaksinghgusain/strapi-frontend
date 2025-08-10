import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MetatagsService } from '../../core/services/metatags.service';
import { CommanService } from '../../core/sharedServices/comman.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  count = 0;
  modalRef: BsModalRef | undefined;
  submitted = false;
  states: any = [];
  countries: any = [];
  editFields = '';
  title: any;
  errorMsg: any = false;
  successText: any = 'information succesfully saved!';
  footerData: any;
  constructor(private modalService: BsModalService,
    private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router,
    private _commannService: CommanService,
    private metaService: MetatagsService,
    private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      // firstname: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z  ]*$")])],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      company: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      address: [''],
      Pcode: ['', ''],
      phone: ['', Validators.compose([Validators.pattern("^[0-9\s]*$"), Validators.maxLength(10), Validators.minLength(10)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
    });
    this.getData();
    this.viewDetails();
    this.getfooterSection();
    this.profileForm.controls['country'].enable();
    this.profileForm.controls['state'].enable();


  }


  viewDetails() {
    this.authService.userInfo().subscribe((res: any) => {
      if (res) {
        this.profileForm.patchValue({
          firstname: res.firstName,
          lastname: res.lastName,
          company: res.companyName,
          country: res.country,
          // state: res.state,
          Pcode: res.PTIN,
          address: res.address1,
          phone: res.phone,
          email: res.email,
        })

        this.getState(res.state, res.country);
      }



    })

  }
  getState(state?: any, country?: any) {

    if (country) {
      this.profileForm.value.country = country;
    }
    if (!state) {
      this.profileForm.patchValue({

        state: ''
      })

      this.profileForm.controls['state'].enable();
    }
    if (this.profileForm.value.country != '') {
      this.authService.getStates(this.profileForm.value.country).subscribe((res: any) => {
        this.states = res.data.states;

      })
      if (state) {
        this.profileForm.patchValue({

          state: state
        })
      }

    } else {
      this.states = []
    }

  }
  getData() {
    this.authService.getCountries().subscribe((res: any) => {
      this.countries = res.data;
    })
  }
  onSubmit(template: any) {

    this.count = 1;
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;

    }
    let data = {
      "firstName": this.profileForm.controls['firstname'].value,
      "lastName": this.profileForm.controls['lastname'].value,
      "address1": this.profileForm.controls['address'].value,
      "phone": this.profileForm.controls['phone'].value,
      "PTIN": this.profileForm.controls['Pcode'].value,
      "companyName": this.profileForm.controls['company'].value,
      "country": this.profileForm.controls['country'].value,
      "state": this.profileForm.controls['state'].value,
      "email": this.profileForm.controls['email'].value
    }
    this.authService.updateUserInfo(data).subscribe(res => {
      if (res) {

        this.successText = 'information succesfully saved!'
        this.errorMsg = false;
        this.openModal(template)

      }
    }, (err => {
      this.errorMsg = true;
      if (err.error.error.message === 'Email is already taken') {
        // this.title = 'Email is already registered';
        this.successText = 'Email is already registered'
        this.openModal(template)
      } else if (err.error.error.message === 'An error occurred during account creation' && err.error.error.status === 400) {
        this.successText = 'Something went wrong ! Please try again.'
        this.openModal(template)
      }
      else {
        this.title = err.error.error.message;
        this.successText = err.error.error.message
        this.openModal(template)
      }
      // this.openModal(this.title, false)
    })
    )
  }

  get f() { return this.profileForm.controls; }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );

  }

  close() {
    this.modalService.hide();
    this.router.navigate(['/learner/dashboard']);
  }
  onEnableControl(cntrl: any) {

    this.editFields = cntrl;
    if (cntrl === 'country') {
      this.profileForm.controls['country'].enable();
    } if (cntrl === 'state') {
      this.profileForm.controls['state'].enable();
    }

  }

  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;
        this.cd.detectChanges();

      }
    })
  }

}
