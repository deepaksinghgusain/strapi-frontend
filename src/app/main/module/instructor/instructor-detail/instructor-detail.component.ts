import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { InstructorService } from 'src/app/main/module/core/services/instructor.service';
import { environment } from 'src/environments/environment';
import { CommanService } from '../../core/sharedServices/comman.service';


@Component({
  selector: 'app-instructor-detail',
  templateUrl: './instructor-detail.component.html',
  styleUrls: ['./instructor-detail.component.css']
})
export class InstructorDetailComponent implements OnInit {

  imageUrl: String;
  getInstructorData: any = {
    name: '',
    bio: '',
    profilePic: '',
    coursesTitle: [],
    topics: []
  };
  instructorIndex: any;
  footerData: any;
  modalRef: BsModalRef | undefined;
  constructor(private modalService: BsModalService, private sanitizer: DomSanitizer,
    public modal: BsModalRef, public options: ModalOptions, private _commannService: CommanService,
    private router:Router,
    private instructorService: InstructorService) {
    this.imageUrl = environment.imageEndPoint;
  }

  sanitize(content: any) {

    return this.sanitizer.bypassSecurityTrustHtml(content)
  }
  ngOnInit(): void {
    this.instructorIndex = localStorage.getItem('InstructorDetailIndex');
    this.instructorDetail();
    this.getfooterSection();
  }
  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;

      }
    })
  }

  instructorDetail() {
    let id = localStorage.getItem('InstructorDetailId')
    this.instructorService.instructorById(id).subscribe((res: any) => {
      this.getInstructorData.name = res.data.attributes.firstName + " " + res.data.attributes.lastName;
      this.getInstructorData.bio = res.data.attributes.bioData;
      this.getInstructorData.profilePic = res.data.attributes.image.data.attributes.formats.thumbnail.url;
     
      
      this.getInstructorData.coursesTitle = res.data.attributes.courses.data;
      this.getInstructorData.coursesTitle=  this.getInstructorData.coursesTitle.filter((data:any)=>{
     
        return data.attributes.isActive==true
        
        })
      let topic = res.data?.attributes?.topics;
      this.getInstructorData.topics = topic.split(",");

    })

  }

  close() {
    this.modal.hide();
  }

  redirectToCourseDetail(id:any){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['course/course-detail/',id])
    );
    // this.modal.hide()
    window.open(url,'_blank')
 
  }

}
