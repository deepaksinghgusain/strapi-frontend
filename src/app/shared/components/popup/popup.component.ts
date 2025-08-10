import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';
import { SharedPopupComponent } from '../shared-popup/shared-popup.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @Input() myContent: any; // we can set the default value also
  title: string = '';
  btnStatus:any ;
  list: string[] = [];
  modalRef!: BsModalRef;
  email:any='';
  errorMsg:any;
  footerData:any;
  constructor(private _router: Router,private _commannService: CommanService, public modal: BsModalService,public modalService: BsModalRef,private authService:AuthService, public options: ModalOptions) { 
    if(this.btnStatus)
    {

    }
    // this.btnStatus = this.options?.initialState?['btnStatus']
  }


  ngOnInit(): void {
     this.email = localStorage.getItem('email')
  }

  gotoLoginpage() {
    this.modalService.hide()
    this._router.navigate(['/auth/login']);
  }
  
  backButton() {
    this.modalService.hide()
    // this._router.navigate(['/auth/signup']);
  }
  close() {
    this.backButton();
    
  }

  resendLink()
{
  let email = localStorage.getItem('email')
  this.authService.resendEmail(email).subscribe((res: any) => {
    this.modalService.hide()
    if (res) {
      this.title = 'Email Resent Successfully!'
      this.openModal1(this.title, true)
    }
  }, (err => {
    this.modalService.hide()
    this.title = err.error.error.message;
    this.openModal1(this.title, false)
  })
  )
}
getfooterSection() {
  this._commannService.commanfooterdata.subscribe((res: any) => {
    if (res) {
      this.footerData = res.data.attributes.footer;
    
    }
  })
}
forgotPassword(){
  this.authService.forgotPassword(this.email).subscribe((res: any) => {
    this.title = 'Reset password link sent successfully';
    this.openModal1(this.title, true)
    // this.router.navigate(['/auth/newpassword'])
  }, (err: any) => {
    this.errorMsg = true;
    this.title = err.error.error.message;
    this.openModal1(this.title, false)
  })
}

  closeit(){
    this.modalService.hide()
    this.resendLink();
  }
resentIt(){    this.modalService.hide()
    this.forgotPassword();
  }
    openModal1(title: any, btnStatus: boolean) {

    const initialState = {
      title: title,
      btnStatus: btnStatus
    };
    this.modalRef = this.modal.show(SharedPopupComponent, { initialState, class: 'submit-popup modal-lg modal-dialog-centered submit-modal-popup', backdrop: 'static', keyboard: false, focus: btnStatus });
  }

}
