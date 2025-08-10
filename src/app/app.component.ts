import { Component, OnInit, OnDestroy } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AuthService } from './auth/services/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { gTagService } from './shared/gTagService.service';
import { SwUpdate } from '@angular/service-worker';
import { interval, Subject, takeUntil } from 'rxjs';

declare const gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject<boolean>();
  constructor(
    @Inject(PLATFORM_ID) private platformId: object, private _route: ActivatedRoute, private gtagservice: gTagService, private router: Router, @Inject(DOCUMENT) private document: Document, public authenticationService: AuthService, private swService: SwUpdate) {
      this.updateAvailable();
  }

  updateAvailable() {
    this.swService.available.subscribe(async event => {
      try {
        console.log('available event', event);
        if (event.type === 'UPDATE_AVAILABLE') {
          this.swService.activateUpdate().then(() => document.location.reload());
        }
      } catch (error) {
      }
    })
  }

  /** Add Google Analytics Script Dynamically */
  addGAScript() {

    const gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.GA_TRACKING_ID;
    document.head.prepend(gtagScript);
    /** Disable automatic page view hit to fix duplicate page view count  **/
    gtag('config', environment.GA_TRACKING_ID, { send_page_view: false ,'debug_mode':true });

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      interval(30 * 1000).pipe(
        takeUntil(this.destroyed$)
      ).subscribe(async () => {
        try {
          await this.swService.checkForUpdate();
        } catch (error) {

        }
      });
      this.addGAScript();
      this.router.events.pipe(
        filter((event: any) => event instanceof NavigationEnd)
      ).subscribe((event) => {
        /** START : Code to Track Page View  */

        if (event instanceof NavigationEnd) {

          this.gtagservice.pushTag({ 'page_path': event.urlAfterRedirects })
          //adding url param for social media tracking
          const urlParameters = Object.assign({}, this._route.snapshot.queryParams);
          if (urlParameters['utm_source'] != undefined && urlParameters['utm_medium'] != undefined && urlParameters['utm_content'] != undefined) {
            sessionStorage.setItem("utmsource", urlParameters['utm_source'])
            sessionStorage.setItem("utmmedium", urlParameters['utm_medium'])
            sessionStorage.setItem("utmcontent", urlParameters['utm_content'])
            console.log(urlParameters['utmsource'], "urlparam")

          }
          if (sessionStorage.length > 0) {
            urlParameters['utm_source'] = sessionStorage.getItem('utmsource');
            urlParameters['utm_medium'] = sessionStorage.getItem('utmmedium');
            urlParameters['utm_content'] = sessionStorage.getItem('utmcontent');
            this.router.navigate([], { relativeTo: this._route, queryParams: urlParameters, queryParamsHandling: 'merge' })
          }

        }

        /** END */
      })
      const navMain = document.getElementById('navbarCollapse');
      if (navMain) {
        navMain.onclick = function onClick() {
          if (navMain) {
            navMain.classList.remove("show");
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
