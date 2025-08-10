import { Component, OnInit } from '@angular/core';
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';

@Component({
  selector: 'app-dont-be-shy',
  templateUrl: './dont-be-shy.component.html',
  styleUrls: ['./dont-be-shy.component.css']
})
export class DontBeShyComponent implements OnInit {
  footerData:any;
  constructor(private _commannService: CommanService) { }

  ngOnInit(): void {
  }
  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;
      
      }
    })
  }
}
