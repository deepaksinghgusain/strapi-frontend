import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Apollo, gql } from 'apollo-angular';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  constructor(private http: HttpClient, private apollo: Apollo) { }

  getHomePageSection() {
    const _url = environment.apibaseurl + "/api/homepage?populate=deep";

    return this.http.get(_url)
  }


  getHomePageCourses() {
    const _url = environment.apibaseurl + "/api/courses?populate=deep&filters[isActive][$eq]=true&filters[forTaxLaw][$eq]=true";
    return this.http.get(_url)
  }

  getHomePageCoursesByGql() {
    return this.apollo.watchQuery<any>({
      query: this.getCoursesList(),
    }).valueChanges;
  }


  gethomePagefacultymembers() {
    const _url = environment.apibaseurl + "/api/instructors?populate=deep";

    return this.http.get(_url)
  }

  getHeader() {
    const _url = environment.apibaseurl + "/api/global?populate=deep";

    return this.http.get(_url)
  }

  getHeroSection(page: string, slug: string) {
    console.log(slug);
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=" + slug;

    return this.http.get(_url)
  }

  getAboutus() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=about-us";
    return this.http.get(_url)
    // return throwError(() => new HttpErrorResponse({
    //   status: 500,
    //   statusText: 'Internal Server Error',
    //   url: 'https://admin.cpewarehouse.com/graphql',
    //   error: '<html>\r\n' +
    //     '<head><title>500 Internal Server Error</title></head>\r\n' +
    //     '<body>\r\n' +
    //     '<center><h1>500 Internal Server Error</h1></center>\r\n' +
    //     '<hr><center>nginx/1.18.0 (Ubuntu)</center>\r\n' +
    //     '</body>\r\n' +
    //     '</html>\r\n'
    // }))
  }

  cancellationPolicy() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=cancellation-policy";

    return this.http.get(_url)

  }

  getPolicy() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=privacy-policy";

    return this.http.get(_url)

  }

  getTermofuse() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=terms-of-use";

    return this.http.get(_url)

  }
  getPaymentTermContent() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=payment-terms";

    return this.http.get(_url)

  }


  getmakingDifference() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=making-difference";

    return this.http.get(_url)

  }
  getExamData() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=exam";

    return this.http.get(_url)

  }
  instructorSection() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=instructor-listing";

    return this.http.get(_url)

  }
  //  HTTP CALL FOR CHAT TOKEN

  chatToken(userName: any) {
    return this.http.get(`${environment.apibaseurl}/api/twilio-chat/${userName}`, { responseType: 'text' })
  }


  getLogin() {
    const _url = environment.apibaseurl + "/api/Signinpage?populate=deep";

    return this.http.get(_url)

  }
  getSignup() {
    const _url = environment.apibaseurl + "/api/signup?populate=deep";

    return this.http.get(_url)

  }
  getCoursesList() {
    return gql`query {
      courses(filters:{isActive:{eq:true}, isFeatured:{eq:true},forTaxLaw:{eq:true}} ) {
        data {
          id
          attributes {
            title
           startDate
            endDate
            timezone
            price
            keywords
            slug
            shortDesc
            image{
              data{
                attributes{
                  url
                }
              }
            }


               instructors{
              data{
                attributes{
                  firstName
                  lastName


              }
            }
          }

          }
        }
      }
    }`
  }

  getForums() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=forums";

    return this.http.get(_url)

  }

}
