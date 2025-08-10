import { Component, OnInit, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InstructorService } from 'src/app/main/module/core/services/instructor.service';
import { LandingPageService } from 'src/app/main/module/core/services/landing-page.service';
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-hero-simple',
  templateUrl: './hero-simple.component.html',
  styleUrls: ['./hero-simple.component.css']
})
export class HeroSimpleComponent implements OnInit {
  courseListingContent: any;
  environmentUrl: string = '';
  instructorData: any;
  questionsection: any;
  herosimpleSection: any;
  modalRef: BsModalRef | undefined;
  videolink: any;
  constructor(
    private modalService: BsModalService,
    private landingPageService: LandingPageService,
    private _instructorService: InstructorService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private _commonService: CommanService) {

  }

  openModalWithClass(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'custom-video modal-lg' })
    );

  }
  ngOnInit(): void {
    this.environmentUrl = environment.apibaseurl;
    const page = this.activatedRoute.snapshot.url.length > 0 ? this.activatedRoute.snapshot.url[0].path : 'home';

    if (page === 'instructor-listing') {
      this.getInstructorListing()
    } if (page === 'self-study') {
      this.getSelfStudySection()
    }

  }

  getSelfStudySection() {

    this.landingPageService.getHeroSection('page', 'self-study').subscribe((res: any) => {
      if (res) {
        this.herosimpleSection = res?.data[0]?.attributes?.blocks.filter
          ((result: { __component: string; }) => result.__component === 'blocks.hero-simple')[0];

        if (this.herosimpleSection?.videoDetail?.video?.data?.attributes?.url != null) {
          const url = this.herosimpleSection?.videoDetail?.video?.data?.attributes?.url;
          this.videolink = `${this.environmentUrl}${url}`

        }
        else {
          this.videolink = this.sanitizer.bypassSecurityTrustResourceUrl(this.herosimpleSection?.videoDetail?.videourl);
        }
      }
    })

  }
  getCourseCatlogSection() {
    this._instructorService.getAllCourseCatlogSection().subscribe((res: any) => {
      if (res) {
        // this.questionsection=  res?.data[0]?.attributes?.blocks.filter((x: { __component: string; }) =>x.__component ==='blocks.page-question-section')[0];
        this.herosimpleSection = res?.data[0]?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.hero-simple')[0];
        this._commonService.getCourseCatlog(res)

      }
    })
  }

  getInstructorListing() {
    this.landingPageService.instructorSection().subscribe((res: any) => {
      if (res) {
        this.herosimpleSection = res?.data[0]?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.hero-simple')[0];
        this._commonService.getCourseCatlog(res)
        console.log(this.herosimpleSection)
        if (this.herosimpleSection?.videoDetail?.video?.data?.attributes?.url != null) {
          const url = this.herosimpleSection?.videoDetail?.video?.data?.attributes?.url;
          this.videolink = `${this.environmentUrl}${url}`

        }
        else {
          this.videolink = this.sanitizer.bypassSecurityTrustResourceUrl(this.herosimpleSection?.videoDetail?.videourl);
        }

      }
    })
  }

}
