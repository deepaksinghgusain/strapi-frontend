import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../../services/landing-page.service';
import { MetatagsService } from '../../services/metatags.service';

@Component({
  selector: 'app-term-use',
  templateUrl: './term-use.component.html',
  styleUrls: ['./term-use.component.css']
})
export class TermUseComponent implements OnInit {
  heroSampleSection: any;
  staticSection: any;
  markdowndata: any;

  constructor(
    private landingPageService: LandingPageService,
    private metaService: MetatagsService
    ) { }

  ngOnInit(): void {
    this.termUsedata()
  }
  termUsedata() {
    this.landingPageService.getTermofuse().subscribe((res: any) => {
      if (res) {
        this.heroSampleSection = res?.data[0]?.attributes?.blocks?.filter
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
