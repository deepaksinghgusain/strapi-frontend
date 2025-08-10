import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LandingPageService } from '../../services/landing-page.service';
import { MetatagsService } from '../../services/metatags.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  heroSampleSection: any;
  staticSection: any;

  imageUrl: any = environment.imageEndPoint
  markdowndata: any;

  constructor(
    private landingPageService: LandingPageService,
    private metaService: MetatagsService
    ) { }
  ngOnInit(): void {
    this.getpolicyData()
  }
  getpolicyData() {
    this.landingPageService.getPolicy().subscribe((res: any) => {
      if (res) {
        this.heroSampleSection = res?.data[0]?.attributes?.blocks.filter
          ((result: { __component: string; }) => result.__component === 'blocks.hero-simple-with-image')[0]
      }
      if (res) {
        this.staticSection = res?.data[0]?.attributes?.blocks.filter
          ((result: { __component: string; }) => result.__component === 'blocks.static-section')[0]
      }
      this.metaService.addSEOTags(res?.data[0]?.attributes?.seo);
      this.markdowndata = this.staticSection.staticText
    });


  }
}