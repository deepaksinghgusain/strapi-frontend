import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


declare const gtag: Function;
@Injectable({
  providedIn: 'root'
})
export class gTagService {

  constructor(private _route:ActivatedRoute, private router : Router) {

     

  }
 

  pushTag(gtmtag: any) {
    gtag('config',
      environment.GA_TRACKING_ID, gtmtag);
     console.log('pushed', gtmtag)
  }
  pushEvent(eventname: string, gtmtag: any) {
   
    gtag('event', eventname, gtmtag)
    console.log('pushed event', eventname, gtmtag)
  }

}
