import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Apollo, gql } from 'apollo-angular';

const question = gql
  `query {
  orders {
    data {
      attributes {
        userName
        email
        OrderItems{
          courseId
          title
        }
      }
    }
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient, private apollo: Apollo) { }
  url = environment.apibaseurl;
  
  getReviewExamQuestion(slug?: any) {
    const baseUrl = environment .apibaseurl;

      //   return this.http.get(`${baseUrl}/api/review-exams`)
      return this.apollo.watchQuery<any>({
        query: this.getQuestionGqlReviewExam(slug),
      }).valueChanges;
    


     
  }
 
  SubmitData(record: any) {
    return this.http.post(`${this.url}/api/user-exams`, record);
  }

  
  getQuestionGql(slug:any) {
    return gql`query{
        exams (filters:
           { 
            course:
            { 
              slug :{ eq: "${slug}"} 
            }
          }) {
          data
          {
            id
            attributes
            {
              title
              desc
               questions {
                id
                isMCQ
                title
                options{
                  option
                  id
                  displayOrder
                  isAnswer
                }
              }
            }
            
          }
        }
    }
  `;
  }

  getQuestionGqlReviewExam(slug:any) {
    return gql`query{
        reviewExams (filters:
           { 
            course:
            { 
              slug :{ eq: "${slug}"} 
            }
          }) {
          data
          {
            id
            attributes
            {
              title
              desc
               questions {
                id
                isMCQ
                title
                durationInminute
                options{
                  option
                  id
                  displayOrder
                  isAnswer
                  hint
                }
              }
            }
            
          }
        }
    }
  `;
  }

  // get final exam question=== 
  getAllFinalExamQuestion(slug?: any) {

    return this.apollo.watchQuery<any>({
      query: this.getQuestionGql(slug),
    }).valueChanges;
  
}

// getting Video Metric (http call)
getVideoMetric(updloadId:any) {  
  const baseUrl = environment .apibaseurl;
  
   return this.http.get(`${baseUrl}/api/video/viewdata/${updloadId}`);
}


// update user courses ... 

updateUserCourse(id:any,data:any){
  const baseUrl = environment .apibaseurl;
 return this.http.put(`${baseUrl}/api/user-courses/${id}`,data)
}

}
