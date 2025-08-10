import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';

@Component({
  selector: 'app-shared-popup',
  templateUrl: './shared-popup.component.html',
  styleUrls: ['./shared-popup.component.css']
})
export class SharedPopupComponent implements OnInit {
  title: any;
  errorMsg:any=false;
    btnStatus:any ;
    footerData:any;
  constructor(public modalService: BsModalRef,private _commannService: CommanService,private router:Router,public options: ModalOptions) { }

  ngOnInit(): void {
  }
  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;
      
      }
    })
  }
  gotoLoginpage() {
    this.modalService.hide()
    this.router.navigate(['/auth/login']);
  }
  close(){
    this.modalService.hide()
  }
}
