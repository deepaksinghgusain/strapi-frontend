import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommanService } from 'src/app/main/module/core/sharedServices/comman.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { LandingPageService } from 'src/app/main/module/core/services/landing-page.service';


@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  homepageContent: any;
  heroImgeurl: any;
  videolink: any;
  testdata: any;
  modalRef: BsModalRef | undefined;
  video!: SafeResourceUrl;
  environmentUrl: string = '';
  heroeSection: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private landingPageService: LandingPageService,
    private commannService: CommanService) {

  }



  ngOnInit(): void {
    this.environmentUrl = environment.apibaseurl;

    const page = this.activatedRoute.snapshot.url.length > 0 ? this.activatedRoute.snapshot.url[0].path : 'home';
    this.getHeroData(page);
    // this.video= this.sanitizer.bypassSecurityTrustResourceUrl('https://asteridadminqa.essentialdemo.com/uploads/New_Wine_Hillsong_Worship_1_048575ff2f.mp4')
    ///throw new Error('Method not implemented.');
  }




  openModalWithClass(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'custom-video modal-lg' })
    );

  }

  getHeroData(url: string) {
    if (url == 'about-us') {
      this.landingPageService.getAboutus().subscribe((res: any) => {
        if (res) {
          this.heroeSection = res?.data[0]?.attributes?.blocks.filter
            ((result: { __component: string; }) => result.__component === 'blocks.hero-simple')[0];
          if (this.heroeSection?.videoDetail?.video?.data?.attributes?.url != null) {
            const url = this.heroeSection?.videoDetail?.video?.data?.attributes?.url;
            this.videolink = `${this.environmentUrl}${url}`

          }
          else {
            this.videolink = this.sanitizer.bypassSecurityTrustResourceUrl(this.heroeSection?.videoDetail?.videourl);
          }
        }
      })
    }
    if (url == 'home') {

      this.landingPageService.getHomePageSection().subscribe((res: any) => {
        if (res) {
          this.heroeSection = res?.data?.attributes?.blocks.filter
            ((result: { __component: string; }) => result.__component === 'blocks.hero-simple')[0];
          if (this.heroeSection?.videoDetail?.video?.data?.attributes?.url != null) {
            let url = this.heroeSection?.videoDetail?.video?.data?.attributes?.url;
            this.videolink = `${this.environmentUrl}${url}`

          }
          else {
            this.videolink = this.sanitizer.bypassSecurityTrustResourceUrl(this.heroeSection?.videoDetail?.videourl);
          }


        }
      })
    }
    if (url == 'course-listing') {
      this.landingPageService.getHeroSection('page', url).subscribe((res: any) => {
        if (res) {
          this.heroeSection = res?.data[0]?.attributes?.blocks.filter
            ((result: { __component: string; }) => result.__component === 'blocks.hero-simple')[0];
          if (this.heroeSection?.videoDetail?.video?.data?.attributes?.url != null) {
            const url = this.heroeSection?.videoDetail?.video?.data?.attributes?.url;
            this.videolink = `${this.environmentUrl}${url}`

          }
          else {
            this.videolink = this.sanitizer.bypassSecurityTrustResourceUrl(this.heroeSection?.videoDetail?.videourl);
          }
        }
      })
    }

  }





}