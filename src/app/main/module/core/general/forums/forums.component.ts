import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LandingPageService } from '../../services/landing-page.service';
import { MetatagsService } from '../../services/metatags.service';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {
  staticSection: any;
  heroSampleSection: any;
  markdowndata: any;
  titleWithLogo: any;
  logoImg: any;
  environmentUrl: string = '';
  imageUrl: String;
  heroTitle: any;
  heroImg: any;
  pageHighlight: any;

 constructor(
    private landingPageService: LandingPageService,
    private metaService: MetatagsService,
    ) { this.imageUrl = environment.imageEndPoint }


    ngOnInit(): void {
      this.getForumData()
      this.environmentUrl = environment.apibaseurl
  
    }
    getForumData() {
      this.landingPageService.getForums().subscribe((res: any) => {
       
        if (res) {
          this.heroTitle = res?.data[0]?.attributes?.blocks.filter
            ((result: { __component: string; }) => result.__component === 'blocks.hero-image-with-titles-subtitle')[0]
          this.heroImg = this.heroTitle.background.data?.attributes.url
  
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
