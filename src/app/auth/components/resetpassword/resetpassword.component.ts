import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent {
  modalRef: BsModalRef | undefined;
  forgotPasswordForm!: FormGroup;
  submitted = false;
  title: any;
  errorMsg: any = false;
  count = 0;
  footerData: any;
  @ViewChild('template2')
  template2!: TemplateRef<any>;

  constructor(private modalService: BsModalService, private _commannService: CommanService, private router: Router, private formBuilder: FormBuilder, private authenticationService: AuthService) { }

  ngOnInit(): void {
    // let token = localStorage.getItem("token")

    //Validation Set
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]]
    });
  }

  close() {

    this.modalService.hide()
  }

  closeM() {

    this.router.navigate(['/auth/signup'])
    this.modalService.hide()
  }

  openModal2(template2: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template2,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );
  }

  onSubmit(template: TemplateRef<any>) {
    this.count = 1;
    localStorage.setItem("email", this.f['email'].value)
    this.submitted = true;
    // stop here if form is invalid 
    if (this.forgotPasswordForm.invalid) {
      return;
    } else {
      this.authenticationService.forgotPassword(this.f['email'].value).subscribe((res: any) => {
        this.title = 'Reset password link sent at your email address';
        this.openModal(this.title, true)
        // this.router.navigate(['/auth/newpassword'])
      }, (err: any) => {
        this.errorMsg = true;
        this.title = err.error.error.message;
        if (err.error.error.message == "User Does Not Exist - Please Create Account") {
          this.openModal2(this.template2)

          // setTimeout(() => {
          //   this.close()
          //   this.router.navigate(['/auth/signup'])
          // },3000);
        } else {
          this.openModal(this.title, false)
        }
        console.log("err", err.error.error.message, err);


      })
    }
  }
  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;

      }
    })
  }

  resendEmailLink() {
    this.modalService.hide()
    let email = localStorage.getItem('email')
    this.authenticationService.resendEmail(email).subscribe((res: any) => {
      if (res) {
        this.title = 'Email Resent Successfully!'
        this.openModal(this.title, true)
      }
    }, (err: any) => {
      this.modalService.hide()
      this.title = err.error.error.message;
      this.openModal(this.title, false)
    })
  }

  get f() { return this.forgotPasswordForm.controls; }

  openModal(title: any, btnStatus: boolean) {
    this.count = 0;
    const initialState = {
      title: title,
      btnStatus: btnStatus
    };
    this.modalRef = this.modalService.show(PopupComponent, { initialState, class: 'submit-popup modal-lg modal-dialog-centered', backdrop: 'static', keyboard: false, focus: btnStatus });
  }
}

