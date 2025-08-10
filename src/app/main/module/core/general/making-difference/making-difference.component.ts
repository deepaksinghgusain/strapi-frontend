import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LandingPageService } from '../../services/landing-page.service';
import { MetatagsService } from '../../services/metatags.service';
@Component({
  selector: 'app-making-difference',
  templateUrl: './making-difference.component.html',
  styleUrls: ['./making-difference.component.css']
})
export class MakingDifferenceComponent implements OnInit {
  staticSection: any;
  heroSampleSection: any;
  markdowndata: any;
  titleWithLogo: any;
  logoImg: any;
  environmentUrl: string = '';
  imageUrl: String;
  heroTitle: any;
  heroImg: any;


  constructor(
    private landingPageService: LandingPageService,
    private metaService: MetatagsService,
    ) { this.imageUrl = environment.imageEndPoint }

  ngOnInit(): void {
    this.getmakingDifferenceData()
    this.environmentUrl = environment.apibaseurl

  }
  getmakingDifferenceData() {
    this.landingPageService.getmakingDifference().subscribe((res: any) => {

      if (res) {
        this.heroTitle = res?.data[0]?.attributes?.blocks.filter
          ((result: { __component: string; }) => result.__component === 'blocks.hero-simple-with-image')[0]
        this.heroImg = this.heroTitle.background.data?.attributes.url

      }
      if (res) {
        this.staticSection = res?.data[0]?.attributes?.blocks.filter
          ((result: { __component: string; }) => result.__component === 'blocks.static-section')[0]

      }
      if (res) {
        this.titleWithLogo = res?.data[0]?.attributes?.blocks.filter
          ((result: { __component: string; }) => result.__component === 'blocks.page-highlight-with-image')[0]
        this.logoImg = this.titleWithLogo.image.data.attributes.url
      }
      this.metaService.addSEOTags(res?.data[0]?.attributes?.seo);
      this.markdowndata = this.staticSection.staticText
    });
  }
}
