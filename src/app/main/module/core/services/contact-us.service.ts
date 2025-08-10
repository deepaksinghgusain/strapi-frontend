import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private http: HttpClient) { 

  }
  getHeroSection(page: string, slug: string) {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=" + slug;

    return this.http.get(_url)
  }

  contactUs(body: any) {
    
    const _url = environment.apibaseurl + "/api/contact-uses";

    return this.http.post(_url, body)
  }
}
