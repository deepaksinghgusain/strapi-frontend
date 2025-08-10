import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LandingPageService } from '../../services/landing-page.service';
import { MetatagsService } from '../../services/metatags.service';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.css']
})
export class CancellationComponent implements OnInit {
  heroSampleSection: any;
  markdowndata: any;
  staticSection: any;

  constructor(private authService: AuthService, 
    private router: Router,
    private metaService: MetatagsService, 
    private landingPageService: LandingPageService
  ) {
    this.authService.showHero(this.router.url);
  }

  ngOnInit(): void {
    this.getCancellationPolicy()
  }

  getCancellationPolicy() {

    this.landingPageService.cancellationPolicy().subscribe((res: any) => {
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
