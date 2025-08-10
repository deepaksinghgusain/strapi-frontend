import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InstructorService } from '../../core/services/instructor.service';
import { InstructorDetailComponent } from '../instructor-detail/instructor-detail.component';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MetatagsService } from '../../core/services/metatags.service';
@Component({
  selector: 'app-instructor-listing',
  templateUrl: './instructor-listing.component.html',
  styleUrls: ['./instructor-listing.component.css']
})
export class InstructorListingComponent implements OnInit {
  instructors: any;
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
    heading: '',
    email: '',
    emailLink: '',
    signupButton: '',
    signupButtonLink: ''
  };
  markdowndata: any;
  markdowndata2: any;
  constructor(private instructorService: InstructorService,
    private sanitizer: DomSanitizer,
    private metaService: MetatagsService,
    private modalService: BsModalService,) {
    this.imageUrl = environment.imageEndPoint;
  }

  ngOnInit(): void {
    this.getData();
    this.bannerData();
  }

  getData() {

    this.instructorService.getInstructors().subscribe((res: any) => {
      this.instructors = res.data.instructors.data;

    })
  }
  sanitize(content: any) {

    return this.sanitizer.bypassSecurityTrustHtml(content)
  }
  openModalWithClass(id: any, index: any) {
    localStorage.setItem('InstructorDetailIndex', index)
    localStorage.setItem('InstructorDetailId', id)
    this.modalRef = this.modalService.show(
      InstructorDetailComponent,
      Object.assign({}, { class: 'custom-popup modal-lg', id })
    );
  }
  bannerData() {
    this.instructorService.bannerText().subscribe((res: any) => {
      this.metaService.addSEOTags(res?.data[0]?.attributes?.seo);
      this.getBannerData = res.data[0].attributes.blocks;
      res.data[0].attributes.blocks.forEach((element: any) => {
        if (element.__component === 'blocks.hero-simple') {
          this.getBannerData.bannerTitle = element.title
        }
        if (element.__component === 'blocks.page-highlight-with-image') {
          this.getBannerData.descTitle = element.title
          let des = element.description
          des = des.split("\n**\n");
          this.getBannerData.description1 = des[0];
          // this.getBannerData.description1 = this.getBannerData.description1[1];
          this.getBannerData.description2 = des[1];
          this.markdowndata = this.getBannerData.description2
          this.markdowndata2 = this.getBannerData.description1
          this.getBannerData.signupButton = element.button.label
          this.getBannerData.signupButtonLink = element.button.href
        }
        if (element.__component === 'blocks.page-question-section') {
          this.getBannerData.footerTitle = element.title
          this.getBannerData.footerSubtitle = element.subtitle
          this.getBannerData.email = element.button.label
          this.getBannerData.emailLink = element.button.href
        }
        if (element.__component === 'blocks.api-section' && element.Index === 'Instructor>Instructors') {
          this.getBannerData.heading = element.title
        }
      });
    })
  }
}

