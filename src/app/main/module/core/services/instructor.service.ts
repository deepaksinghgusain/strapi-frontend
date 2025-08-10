import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Apollo, gql } from 'apollo-angular';
import { query } from 'express';


const instructorsgeneral = gql
  `query {
    instructors (pagination: { limit: -1 }, filters : { IsActive: { eq: true }  } ) {
      data {
        id
        attributes {
           firstName
          lastName
          bioData
          topics
          email
          IsActive
          image {
            data
            {
              attributes
              {
                name
                caption
                 width	
                height
                url
                previewUrl
                alternativeText
                formats 
                 ext
                
              }
            }
          }
        
        }
      }
    }
  }`;

@Injectable({
  providedIn: 'root'
})



export class InstructorService {

  constructor(private http: HttpClient, 
    private apollo: Apollo,
    ) { }

  // instructorListing() {
  //   const _url = environment.apibaseurl + "/api/instructors?populate=*";

  //   return this.http.get(_url)
  // }

  getInstructors() {
    return this.apollo.watchQuery<any>({
      query: instructorsgeneral,
    }).valueChanges;


  }
  getInstructorsForHome() {
    return this.apollo.watchQuery<any>({
      query: this.getInstructorSimplegql(),
    }).valueChanges;

  }
  instructorById(id: any) {
    const _url = environment.apibaseurl + "/api/instructors/" + id + "?populate=*";

    return this.http.get(_url)
  }
  bannerText() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=instructor-listing";

    return this.http.get(_url)
  }

  getAllCourseCatlogSection() {
    const _url = environment.apibaseurl + "/api/pages?populate=deep&filters[slug][$eq]=course-listing";

    return this.http.get(_url)
  }

  getInstructorSimplegql() {
      return gql`query {
        instructors(filters:{IsActive:{eq:true}}){
          data{
            id
            attributes{
              firstName
              lastName
              shortDesc
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

  getPackages() {
    const _url = environment.apibaseurl + "/api/packages?populate=deep";

    return this.http.get(_url)
  }
}