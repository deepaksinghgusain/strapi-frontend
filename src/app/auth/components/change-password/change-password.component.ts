import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, EmailValidator, FormControl, RequiredValidator, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from '../../services/auth.service';
import Validation from '../../validator/validation';
import { Router, ActivatedRoute } from '@angular/router'
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  submitted = false;
  ChangePasswordForm!: FormGroup
  createnewpassword: any
  confirmnewpassword: any;
  count = 0;
  errorMsg: any;
  successText: any;
  modalRef: BsModalRef | undefined
  changeType: boolean = false;
  fieldTextType: boolean | undefined;
  title: any;
  fieldTextpassword: any;
  password: boolean | undefined;
  currentPasswordtext: boolean | undefined;
  confirmPassword: boolean | undefined;;
  passwordsNotMatching: any;
  passwordMatch: boolean = false;
  footerData:any;

  constructor(private authService: AuthService,private _commannService: CommanService, private formBuilder: FormBuilder, private modalService: BsModalService,private route: Router, private actroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ChangePasswordForm = this.formBuilder.group({
      // currentPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/)]),
      currentPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword:new FormControl ('', Validators.required),
      
    }
      // ,
      // {
      //   validators: [Validation.match('password', 'confirmPassword')]
      // }
    );
  }


  get f(): { [key: string]: AbstractControl } {
    return this.ChangePasswordForm.controls;
  }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );
  }

  close() {
    this.modalService.hide();
  }

  onSubmit(template: any) {

    this.submitted = true;
    this.count = 1;


    if (this.ChangePasswordForm.invalid) {
      return;
    }


    let data = {
      "currentPassword": this.ChangePasswordForm.controls['currentPassword'].value,
      "password": this.ChangePasswordForm.controls['password'].value,
      "confirmPassword": this.ChangePasswordForm.controls['confirmPassword'].value,
    }
    this.authService.changePassword(data).subscribe(res => {
      if (res) {

        this.successText = 'Password Changed successfully!'
        this.errorMsg = false;
        this.openModal(template)
        // this.route.navigate(['/learner/profile'])

      }
    }, (err => {

      this.errorMsg = true;
      this.successText = 'Enter correct previous password!'
      this.openModal(template)
    })

    )
    // this.ChangePasswordForm.reset();
    


  }



  currentPasswordseye() {
    this.currentPasswordtext = !this.currentPasswordtext;
  }

  passwordeye() {
    this.password = !this.password;
  }

  confirmPasswordeye() {
    this.confirmPassword = !this.confirmPassword;
  }
  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;
      
      }
    })
  }


  checkMatch() {
    
    if ((this.ChangePasswordForm.controls['password'].value === this.ChangePasswordForm.controls['confirmPassword'].value)&& this.ChangePasswordForm.controls['password'].value !='' && this.ChangePasswordForm.controls['confirmPassword'].value !='') {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }

  }

}
