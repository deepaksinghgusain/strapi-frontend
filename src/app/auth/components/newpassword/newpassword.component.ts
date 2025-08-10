import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { AuthService } from '../../services/auth.service';
import Validation from '../../validator/validation';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css']
})
export class NewpasswordComponent implements OnInit {
  newPasswordForm!: FormGroup;
  fieldTextType: boolean = false;
  submitted = false;
  changeType: boolean = false;
  passwordsNotMatching: any;
  modalRef!: BsModalRef;
  title: any;
  successText: string = '';
  errorMsg: any = false;
  code = '';
  emailAddress = '';
  passwordMatch: boolean = false;
  count=0;
 
  reg:any =  new RegExp('(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$');
  constructor(private formBuilder: FormBuilder, private authService: AuthService,

    private _modalService: BsModalService, private _router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      this.emailAddress = params['em'];
    });
  }
  ngOnInit(): void {

    this.newPasswordForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required])],
      // password: ['',Validators.compose([Validators.required, Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$')])],
      confirmPassword: ['', Validators.required],
    }
      // ,
      // {
      //   validators: [Validation.match('password', 'confirmPassword')]
      // }
    );
  }
  onSubmit() {
    
    this.count=1;
    localStorage.clear();
    this.submitted = true;
    
    // stop here if form is invalid
    // if ( this.newPasswordForm.controls['password'].value=='' && this.newPasswordForm.controls['confirmPassword'].value=='' && this.newPasswordForm.controls['password'].value !== this.newPasswordForm.controls['confirmPassword'].value ) {
    //   return;

    // }

    if(this.newPasswordForm.status=='INVALID'){
 return
    }
   
    
    this.authService.showHero(this._router.url);
    let data = {
      "code": this.code,
      "password": this.newPasswordForm.controls['password'].value,
      "passwordConfirmation": this.newPasswordForm.controls['confirmPassword'].value,
    }

//     if(data.password.match('(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$')){
// console.log("log true",data.password);

//     }
//     else{
//       console.log("not true",data.password);
      
//     }
    this.authService.resetPassword(data).subscribe(res => {
      
      if (res) {
        this.successText = 'PASSWORD SUCCESSFULLY CHANGED!'
        this.openModal(this.successText, true)
      }
      
    }, (err => {
      this.errorMsg = true;
      
      if (err.error.error.message === 'Incorrect code provided') {
        this.title = 'Reset Link Expired!';
      } else {
        this.title = err.error.error.message;
      }
      this.openModal(this.title, false)
    })
    )

  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleCPFieldTextType() {
    this.changeType = !this.changeType;
  }

  get f() { return this.newPasswordForm.controls; }

  openModal(title: any, btnStatus: boolean) {
    this.count=0;
    const initialState = {
      title: title,
      btnStatus: btnStatus

    };
    this.modalRef = this._modalService.show(PopupComponent, { initialState, class: 'submit-popup modal-lg modal-dialog-centered submit-alert', backdrop: 'static', keyboard: false, focus: btnStatus });

  }
  gotoLoginpage() {
    this._router.navigate(['/auth/login']);
  }
  checkMatch() {
    if (this.newPasswordForm.controls['password'].value === this.newPasswordForm.controls['confirmPassword'].value) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }

  }
}
