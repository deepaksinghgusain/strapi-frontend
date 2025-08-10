
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { PLATFORM_ID, Input } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { DontBeShyComponent } from 'src/app/shared/components/dont-be-shy/dont-be-shy.component';
import { LandingPageService } from 'src/app/main/module/core/services/landing-page.service';
import { environment } from 'src/environments/environment';
import { MetatagsService } from '../../services/metatags.service';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  @Input() backgroundImageurl = 'background-image:url(../../../assets/params/images/banner/hero-image.png);';
  dependencies: any;
  features: any;

  id: number;
  getabouteam: any;
  heroSampleSection: any;
  ourValueSection: any;
  getFromCpe: any;
  getRecommendations: any;
  getQuestionsSection: any;


  imageUrl: any = environment.imageEndPoint
  staticSection: any;
  markdowndata: any;
  //  modalService: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private meta: Meta,
    private modalService: BsModalService,
    private landingPageService: LandingPageService,
    private metatagsService: MetatagsService
  ) {

    this.id = 0;
  }

  ngOnInit(): void {
    this.getaboutusData()

    if (isPlatformBrowser(this.platformId)) {
      // MCP
      // $('html,body').scrollTop(0);
    }


  }



  modalRef: BsModalRef | undefined;



  openModalWithClass1() {
    this.modalRef = this.modalService.show(
      DontBeShyComponent,
      Object.assign({}, { class: 'modal-popupemail modal-lg' })
    );
    // Object.assign({}, { class: 'custom-video modal-lg' })  
  }
  getaboutusData() {

    this.landingPageService.getAboutus().subscribe((res: any) => {


      if (res) {
        this.getabouteam = res?.data[0]?.attributes?.blocks.filter
          ((res: { __component: string; }) => res.__component === 'blocks.page-highlight-with-image')[0]
      }

      if (res) {
        this.ourValueSection = res?.data[0]?.attributes?.blocks.filter
          ((res: { __component: string; }) => res.__component === 'blocks.page-highlight-with-image-bulleted-text')[0]


      }
      if (res) {
        this.getFromCpe = res?.data[0]?.attributes?.blocks.filter
          ((res: { __component: string; }) => res.__component === 'blocks.feature-textonly')[0]
      }
      if (res) {
        this.getRecommendations = res?.data[0]?.attributes?.blocks.filter
          ((res: { __component: string; }) => res.__component === 'blocks.recommendation-card')[0]
      }
      this.getQuestionsSection = res?.data[0]?.attributes?.blocks.filter
        ((res: { __component: string; }) => res.__component === 'blocks.page-question-section')[0]
      if (res) {
        this.staticSection = res?.data[0]?.attributes?.blocks.filter
          ((result: { __component: string; }) => result.__component === 'blocks.page-highlight-with-image')[0]

      }
      this.metatagsService.addSEOTags(res?.data[0]?.attributes?.seo);
      this.markdowndata = this.staticSection.description
    });




  }

}
