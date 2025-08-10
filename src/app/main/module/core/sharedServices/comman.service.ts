import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { GraphQLError } from 'graphql';


@Injectable({
  providedIn: 'root'
})
export class CommanService {

  constructor(private apollo: Apollo) { }

  private data = new BehaviorSubject<any>(null);
  commanData = this.data.asObservable();


  private coursesdata = new BehaviorSubject<any>(null);
  commanCoursesdata = this.coursesdata.asObservable();

  private instructorData = new BehaviorSubject<any>(null);
  commaninstructorData = this.instructorData.asObservable();

  private courseCatlog = new BehaviorSubject<any>(null);
  commanCourseCatlog = this.courseCatlog.asObservable();


  private footerdata = new BehaviorSubject<any>(null);
  commanfooterdata = this.footerdata.asObservable();

  private cartQty = new BehaviorSubject<any>(0);
  commanCartQtydata = this.cartQty.asObservable();

  setCartQtyObs(qty: any) {

    this.cartQty.next(qty);
  }

  getlandingpageData(res: any) {
    this.data.next(res);
  }


  getCoursespageData(res: any) {
    this.coursesdata.next(res);
  }


  getinstructorData(res: any) {
    this.instructorData.next(res);
  }


  getfooter(res: any) {

    this.footerdata.next(res);
  }

  getCourseCatlog(res: any) {
    this.courseCatlog.next(res);
  }


  getPackagesListByGql() {
    return this.apollo.watchQuery<any>({
      query: this.packageListGql(),
    }).valueChanges;
  }

  throwGraphqlError() {
    return throwError(() => new GraphQLError('Internal server error', {
      extensions: {
        http: {
          status: 500,
          statusText: 'Internal Server Error',
        }
      }
    }));
  }


  packageListGql() {
    return gql`query {
      packages{
        data{
          id
          attributes{
            title
            desc
            price
            slug
            discountedPrice
            createdAt
            image{
              data{
                attributes{
                  url
                }
              }
            } 
          }
        }
      }
    }`
  }

  

}
