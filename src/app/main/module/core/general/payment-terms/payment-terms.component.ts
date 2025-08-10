import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../../services/landing-page.service';
import { MetatagsService } from '../../services/metatags.service';

@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.css']
})
export class PaymentTermsComponent implements OnInit {
  staticSection: any;
  heroSampleSection: any;
  markdowndata: any;
  constructor(
    private landingPageService: LandingPageService,
    private metaService: MetatagsService,
    ) { }

  
  ngOnInit(): void {
    this.getPageContent()
    
    
  }

  getPageContent() {
    this.landingPageService.getPaymentTermContent().subscribe((res: any) => {
       
      if (res) {
        this.metaService.addSEOTags(res?.data[0]?.attributes?.seo);
        this.staticSection = res?.data[0]?.attributes?.blocks.filter
          ((result: { __component: string; }) => result.__component === 'blocks.static-section')[0]
      }
      this.markdowndata = this.staticSection.staticText
    });
  }
}
 
