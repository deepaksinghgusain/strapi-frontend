import { Component, OnInit } from '@angular/core';
import { LandingPageService } from 'src/app/main/module/core/services/landing-page.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MetatagsService } from 'src/app/main/module/core/services/metatags.service';
@Component({
  selector: 'app-hero-simple-image',
  templateUrl: './hero-simple-image.component.html',
  styleUrls: ['./hero-simple-image.component.css']
})
export class HeroSimpleImageComponent implements OnInit {


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaService: MetatagsService,
    private landingPageService: LandingPageService) { }
  heroeSection: any;
  environmentUrl: string = '';
  scontroller = '';

  ngOnInit(): void {
    this.environmentUrl = environment.apibaseurl;
    const page = this.activatedRoute.snapshot.url.length > 0 ? this.activatedRoute.snapshot.url[0].path : 'home';
    this.scontroller = this.router.url.split('/')[1];
    this.getHeroData(page);
  }

  getHeroData(url: string) {

    if (url == 'payment-terms') {
      this.landingPageService.getPaymentTermContent().subscribe((res: any) => {
        if (res) {

          this.heroeSection = res?.data[0]?.attributes?.blocks.filter
            ((result: { __component: string; }) => result.__component === 'blocks.hero-simple-with-image')[0]
        }
      })
    }
    if (url == 'making-difference') {
      this.landingPageService.getmakingDifference().subscribe((res: any) => {
        if (res) {

          this.heroeSection = res?.data[0]?.attributes?.blocks.filter
            ((result: { __component: string; }) => result.__component === 'blocks.hero-simple-with-image')[0]
        }
      })
    }
    if (url == 'view-webinar') {
      this.landingPageService.getExamData().subscribe((res: any) => {
        if (res) {

          this.heroeSection = res?.data[0]?.attributes?.blocks.filter
            ((result: { __component: string; }) => result.__component === 'blocks.hero-simple-with-image')[0]
        }
      })
    }
    if (url == 'self-study' && this.scontroller == 'learner') {
      this.landingPageService.getHeroSection('', 'self-study-dashboard').subscribe((res: any) => {
        if (res) {
          this.metaService.addSEOTags(res?.data[0]?.attributes?.seo);

          this.heroeSection = res?.data[0]?.attributes?.blocks.filter
            ((result: { __component: string; }) => result.__component === 'blocks.hero-simple-with-image')[0]
        }
      })
    }
    if (url == 'dashboard' && this.scontroller == 'learner') {
      this.landingPageService.getHeroSection('', 'learner-dashboard').subscribe((res: any) => {
        if (res) {
          this.metaService.addSEOTags(res?.data[0]?.attributes?.seo);

          this.heroeSection = res?.data[0]?.attributes?.blocks.filter
            ((result: { __component: string; }) => result.__component === 'blocks.hero-simple-with-image')[0]
        }
      })
    }
  }
}
