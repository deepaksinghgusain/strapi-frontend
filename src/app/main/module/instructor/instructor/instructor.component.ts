import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InstructorService } from 'src/app/main/module/core/services/instructor.service';
import { environment } from 'src/environments/environment';
import { InstructorDetailComponent } from '../instructor-detail/instructor-detail.component';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  getValues: any;
  imageUrl: String;
  modalRef: BsModalRef | undefined;
  getBannerData: any = {
    bannerTitle: '',
    footerTitle: '',
    footerSubtitle: '',
    descTitle: '',
    subtitle: '',
    description1: '',
    description2: '',
    heading:'',
    email:'',
    signupButton:'',
    signupButtonLink:''
  };
  markdowndata: any;
  markdowndata2:any;
  constructor(private instructorService: InstructorService, private modalService: BsModalService, ) {
    this.imageUrl = environment.imageEndPoint;
  }

  ngOnInit(): void {
    this.getData();
    // this.bannerData();
  }

  getData() {
    
    this.instructorService.getInstructors().subscribe((res: any) => {
      this.getValues = res.data.instructors.data;
    })
  }
  openModalWithClass(id: any,index:any) {
    localStorage.setItem('InstructorDetailIndex',index)
    this.modalRef = this.modalService.show(
      InstructorDetailComponent,
      Object.assign({}, { class: 'custom-popup modal-lg', id })
    );
    // Object.assign({}, { class: 'custom-video modal-lg' })  
  }
  bannerData() {
    this.instructorService.bannerText().subscribe((res: any) => {

      this.getBannerData = res.data[0].attributes.blocks;
      res.data[0].attributes.blocks.forEach((element: any) => {
        if (element.__component === 'blocks.hero-simple') {
          this.getBannerData.bannerTitle = element.title
        }
        if (element.__component === 'blocks.page-highlight-with-image') {
          this.getBannerData.descTitle = element.title
          // this.getBannerData.description1 = element.description
          // this.markdowndata = this.getBannerData.description1
          let des = element.description
          des = des.split("\n**\n");
          // this.getBannerData.description1 = des[0].split("**");
          this.getBannerData.description1 = des[0];
          // this.getBannerData.description1 = this.getBannerData.description1[1];
          this.getBannerData.description2 = des[1];
          this.markdowndata = this.getBannerData.description2
          this.markdowndata2 = this.getBannerData.description1
        }
        if (element.__component === 'blocks.page-question-section') {
          this.getBannerData.footerTitle = element.title
          this.getBannerData.footerSubtitle = element.subtitle
          this.getBannerData.email = element.button.label
          this.getBannerData.signupButtonLink=element.button.href
        }
        if (element.__component === 'blocks.api-section' && element.Index==='Instructor>Instructors') {
          this.getBannerData.heading = element.title
        }
      });
    })
  }
}
