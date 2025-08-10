import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Apollo, gql } from 'apollo-angular';
import moment from 'moment';
const Orders = gql`
  query {
    orders {
      data {
        attributes {
          userName
          email
          OrderItems {
            courseId
            title
          }
        }
      }
    }
  }
`;

const getcategory = gql`
  query {
    courses(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          startDate
          category {
            data {
              id
              attributes {
                title
              }
            }
          }
        }
      }
    }
  }
`;

const packagesonly = gql`
  query {
    packages {
      data {
        attributes {
          title
          desc
          price
          slug
          discountedPrice

          image {
            data {
              attributes {
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
  }
`;

const getInvoiceTemplateUrl = gql`query {
  global {
    data {
      attributes {
        invoiceTemplate {
          data {
            attributes {
              url              
            }
          }
        }
      }
    }
  }
}`

@Injectable({
  providedIn: 'root',
})

export class CourseService {
  orderStatus: any;
  slug = '';
  courseId = '';

  currentDate: string
  constructor(private http: HttpClient, private apollo: Apollo) {

    this.currentDate = moment().format('YYYY-MM-DD') + 'T00:00:00.000Z'



  }

  url = environment.apibaseurl;

  getcoursesRedirectionBySlug(slug: any) {
    return this.apollo.watchQuery<any>({
      query: this.getredirection_LinkCourses(slug),
    }).valueChanges;
  }

  getredirection_LinkCourses(slug: string) {
    return gql`query {
    courses(filters:{slug:{eq:"${slug}"}}) {
      data {
        id         
        attributes {                       
          redirection_Link
          slug
        }
      }
    }
  }
  `;
  }

  getQuickView(id: any) {
    return this.http.get(`${this.url}/api/courses/${id}?populate=*`);
  }

  GetUserSubscribedCourses(email: string) {
    return this.apollo.watchQuery<any>({
      query: this.getUserCourseGQL(email),
    }).valueChanges;
  }


  getRssLinks() {
    return this.http.get(`${this.url}/api/homepage/getRssFeed`);
  }


  getSelfStudyUpcomingCourse(IDarray: any) {
    return this.apollo.watchQuery<any>({
      query: this.getCourse(IDarray),
    }).valueChanges;
  }

  getCourse(IDarray: any) {
    return gql`
    query {
      courses(
        pagination: { limit: -1 }
        filters: {
          id: { notIn:  [${IDarray}] }
          isActive: { eq: true }
          forTaxLaw: { eq: true }
          and: [
            {
              and: [
                {
                  category: { title: { eq: "Recorded" } }
                }
              ]
            }
          ]
        }
      ) {
        data {
          id
    
          attributes {
            title
            forTaxLaw
            slug
            startDate
            endDate
            timezone
            price
            shortDesc
            isActive
            category {
              data {
                attributes {
                  title
                }
              }
            }
          }
        }
      }
    }
    
    `;
  }

  getUpcomingCourse(IDarray: any) {
    return this.apollo.watchQuery<any>({
      query: this.getCourses(IDarray),
    }).valueChanges;
  }

  getCourses(IDarray: any) {
    return gql`
    query {
      courses(
        pagination: { limit: -1 }
        filters: {
          id: { notIn: [${IDarray}] }
          isActive: { eq: true }
          forTaxLaw: { eq: true }
          or: [
            {
              and: [
                {
                  startDate: { gte: "${this.currentDate}" }
                  category: { title: { eq: "Live" } }
                }
              ]
            }
          ]
        }
      ) {
        data {
          id
    
          attributes {
            title
            forTaxLaw
            slug
            startDate
            endDate
            timezone
            price
            shortDesc
            isActive
            category {
              data {
                attributes {
                  title
                }
              }
            }
          }
        }
      }
    }
    
    `;
  }

  getUserCourseGQL(email: string) {
    return gql`query{
     userCourses( sort: ["purchasedOn:desc"],pagination:{limit:-1},filters:{user:{email :{ eq: "${email}"}}}){
      data{
        id
          attributes{
            status
            completedOn
            purchasedOn
            joinUrl
            isReviewExamPassed
            lastVideoView
            course{
              data{
                id
                  attributes{
                    title
                    startDate
                    endDate
                    slug
                    webinarId
                    videoUrl
                    credit
                    medium
                    fieldOfStudy
                    programNumber
                    instructors{
                      data{
                        attributes{
                          firstName
                          lastName
                        }
                      }
                    }
                    certificateTemplate
                                  {data{
                                    attributes{
                                      url
                                    
                                    }
                                  }}
                    handout {
                              data {
                                  attributes {
                                    url
                                    name
                                      }
                                    }
                            }
                           
                        category{
                          data{
                            attributes{
                              title
                            }
                          }
                        }
                  }
              }
            }
            user{
              data{
                id
                attributes{
                  username
                  
                }
              }
            }
           }
          }  
        }
      }`;
  }
  checkAlreadyCoursePurchased(id: number, email: string) {


    return this.apollo.watchQuery<any>({
      query: this.getAlreadyCoursePurchasedGQL(id, email),
    }).valueChanges;
  }
  getAlreadyCoursePurchasedGQL(id: number, email: string) {
    return gql`query{
      userCourses( sort: ["purchasedOn:desc"],
       pagination:{limit:-1},
       filters:
       {
         user:{email :{ eq: "${email}" }}
         course:{id :{ eq: ${id}}}
       }){
        data{
         id
           attributes{
             status
             completedOn
             joinUrl
             course{
               data{
                 id
                   attributes{
                     title
                     startDate
                     slug
                     webinarId
                     videoUrl
                     
                       category{
                         data{
                           attributes{
                             title
                           }
                         }
                       }
                   }
               }
             }
             user{
               data{
                 id
                 attributes{
                   username
                 }
               }
             }
            }
           }  
         }
       }`;
  }
  getCourseCategoryById() {
    return this.apollo.watchQuery<any>({
      query: this.getCourseCategory(),
    }).valueChanges;
  }

  getExamdetail(slug: string) {
    return gql`query{
        userCourses( sort: ["purchasedOn:desc"], filters:{course:{slug :{ eq: "${slug}"}}}){
          data{
            id
              attributes{
                status
                completedOn
                course{
                  data{
                    id
                      attributes{
                        title
                        startDate
                        slug
                        videoUrl                
                         
                      }
                  }
                }
                user{
                  data{
                    id
                    attributes{
                      username
                      user_exams{
                        data{attributes
                        {totalScore
                        score
                        }}
                      }
                    }
                  }
                }
               }
              }  
            }
          }`;
  }

  getExamdetailByslug(slug: string) {
    return this.apollo.watchQuery<any>({
      query: this.getExamdetail(slug),
    }).valueChanges;
  }

  // searchCourses(title: any) {

  //   return this.http.get(`${this.url}/api/courses/?populate=*&filters[title][$containsi]=` + title);

  // }

  getCourseData(id: any) {
    return this.http.get(
      `${this.url}/api/courses/${id}?populate=deep&filters[isActive][$eq]=true&filters[forTaxLaw][$eq]=true`
    );
  }
  getAllCourseForSearch(search: any) {
    return this.apollo.watchQuery<any>({
      query: this.getCourseSearchGql(search, true, true),
    }).valueChanges;
  }

  getAllCourses(title?: any) {
    let search = title || '';

    if (search !== '') {
      return this.apollo.watchQuery<any>({
        query: this.getCoursesWithTitleGql(true, true, search),
      }).valueChanges;
    } else {

      return this.apollo.watchQuery<any>({
        query: this.getCoursesGql(true, true),
      }).valueChanges;
    }

  }


  getAllCoursesForLive(title?: any) {

    let search = title || '';
    console.log(this.currentDate)
    return this.apollo.watchQuery<any>({
      query: this.getCoursesLiveTitleGql(true, true, search),
    }).valueChanges;

  }

  getCoursesLiveTitleGql(
    fortaxLaw: boolean,
    isActive: boolean,
    title: string

  ) {

    return gql`query{
      courses( 
        
        pagination: { limit: -1 }, 
        filters : {
          isActive: { eq: ${isActive}}, 
          forTaxLaw: { eq: ${fortaxLaw} },
          title: { contains : "${title}" },
          and: [{
                    endDate:   { gte:  "${this.currentDate}"
                    },
                    category: {
                        title: {eq: "Live"}
                    }
                }]
         }
      ){
        data {
              id
              attributes {
              title
              forTaxLaw
              isActive
              startDate
              endDate
                
              price
              shortDesc
                  
              image {
                data  
                  { 
                    attributes {
                      name
                      url
                      alternativeText
                      caption
                      width
                      height
                      mime
                      previewUrl
                    }
                  }
                }
                  
              slug
              certificateTemplate{
                data{
                  attributes{
                      url
                    }
                  }
                }
              category{
                data{
                  attributes{
                      title
                    }
                  }
                }
                creditsInfo
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
    }`;
  }


  getCoursesWithTitleGql(
    fortaxLaw: boolean,
    isActive: boolean,
    title: string

  ) {
    return gql`query{
      courses( 
        
        pagination: { limit: -1 }, 
        filters : {
          isActive: { eq: ${isActive}}, 
          forTaxLaw: { eq: ${fortaxLaw} },
          title: { contains : "${title}" },
          and: [{
                    endDate:   { gte:  "${this.currentDate}"
                    },
                    category: {
                        title: {eq: "Live"}
                    }
                }]
         }
      ){
        data {
                id
                attributes {
                  title
                  forTaxLaw
                  startDate
                  endDate
                  timezone
                  price
                  shortDesc
                  isActive
                  image {
                    data  
                    { 
                  		attributes {
                        name
                        url
                         alternativeText
                         caption
                        width
                        height
                        mime
                        previewUrl
                      }
                  	}
                  }
                  keywords
                  slug
                  certificateTemplate{
                    data{
                      attributes{
                        url
                      }
                    }
                  }
                   category{
                    data{
                      attributes{
                        title
                       faqs{
                          faq{
                            question
                            answer
                          }
                      }
                      }
                    }
                  }
                    tabs {
                    
                    featureTitle
                    content
                    index
                    image{
                      data{
                        attributes{
                          url
                        }
                      }
                    }
                  }
                     instructor{
                    data{
                      attributes{
                        firstName
                        lastName
                        bioData
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
                  
                }
              }
      }
    }`;
  }

  getSelfStudyCoursesSearchGql(isActive: boolean, forTaxLaw: true, title: string) {	
    return gql`	
      query {	
        courses( 	
          pagination: { limit: -1 }, 	
          filters : {	
            isActive: { eq: ${isActive}}, 	
            forTaxLaw: { eq: ${forTaxLaw} },	
            title: { contains : "${title}" },	
             category: {	
              title: {ne: "Live"}	
     	
          }	
        }	
      )	
      { data {	
            attributes {	
              forTaxLaw	
              isActive	
              title	
              shortDesc	
              discount
              price	
              slug	
              category {	
                data {	
                  attributes {	
                    title	
                  }	
                }	
              }	
              image {	
                data {	
                  attributes {	
                    url	
                  }	
                }	
              }	
            }	
          }	
        }	
      }	
`;	
  }

  getSelfStudyCoursesGql(isActive: boolean, forTaxLaw: true) {

    return gql`
      query {
        courses( 
          pagination: { limit: -1 }, 
          filters : {
            isActive: { eq: ${isActive}}, 
            forTaxLaw: { eq: ${forTaxLaw} },
            category: {
              title: {ne: "Live"}
     
          }
        }
      )
      { data {
            attributes {
              forTaxLaw
              isActive
              title
              shortDesc
              discount
              price
              startDate
              endDate
              slug
              category {
                data {
                  attributes {
                    title
                  }
                }
              }
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
              creditsInfo
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
      }
`;
  }

  getCourseSearchGql(keyword: any, isActive: boolean, forTaxLaw: true) {
    return gql`query {
      courses( 
        pagination: { limit: -1 }, 
        filters : {
          isActive: { eq: ${isActive}}, 
          forTaxLaw: { eq: ${forTaxLaw} },
            or:  [{
                      and: [{
                              endDate:   { gte:  "${this.currentDate}"}
                              ,
                              category: {
                                  title: {eq: "Live"}
                              }
                          }]
                    },
                    {
                        category: {
                            title: {ne: "Live"}
                        }
                    }],
  
         }
      )
    {
          data {
            id
            attributes {
              title
              forTaxLaw
              
              slug
            startDate
              
            }
          }
        }
      }`;
  }
  getCoursesGql(fortaxLaw: boolean, isActive: boolean) {

    // var currentDate = JSON.parse(stringified);
    return gql`query {
      courses( 
        pagination: { limit: -1 }, 
        filters : {
          isActive: { eq: ${isActive}}, 
          forTaxLaw: { eq: ${fortaxLaw} },
            or:  [{
                      and: [{
                              endDate:   { gte:  "${this.currentDate}"}
                              ,
                              category: {
                                  title: {eq: "Live"}
                              }
                          }]
                    },
                    {
                        category: {
                            title: {ne: "Live"}
                        }
                    }],
  
         }
      )
    {
      data {
        id
         
        attributes {
          title
          forTaxLaw
          isActive
          shortDesc
         startDate
          endDate
          timezone
          price
          image {
            data  
            { 
          		attributes {
                name
                url
                 alternativeText
                 caption
                width
                height
                mime
                previewUrl
              }
          	}
          }
          keywords
          slug
          certificateTemplate{
            data{
              attributes{
                url
              }
            }
          }
           category{
            data{
              attributes{
                title
               faqs{
                  faq{
                    question
                    answer
                  }
              }
              }
            }
          }
            tabs {
            
            featureTitle
            content
            index
            image{
              data{
                attributes{
                  url
                }
              }
            }
          }
             instructors{
            data{
              attributes{
                firstName
                lastName
                bioData
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
          
        }
      }
    }
  }
  `;
  }

  getAllPackages() {
    return this.apollo.watchQuery<any>({
      query: packagesonly,
    }).valueChanges;
  }

  getSelfStudyCourses() {
    return this.apollo.watchQuery<any>({
      query: this.getSelfStudyCoursesGql(true, true),
    }).valueChanges;
  }

  getSelfStudyCoursesSearch(search: string) {	
    return this.apollo.watchQuery<any>({	
      query: this.getSelfStudyCoursesSearchGql(true, true, search),	
    }).valueChanges;	
  }

  getOrders() {
    return this.apollo.watchQuery<any>({
      query: Orders,
    }).valueChanges;
  }

  getcategory() {
    return this.apollo.watchQuery<any>({
      query: getcategory,
    }).valueChanges;
  }

  getcoursesBySlug(slug: any) {
    return this.apollo.watchQuery<any>({
      query: this.getCoursesDetail(slug),
    }).valueChanges;
    // return   this.http.get(`${this.url}/api/courses?populate=deep&filters[slug][$containsi]=`+slug)
  }
  getcourseCertificateBySlug(slug: any) {
    return this.apollo.watchQuery<any>({
      query: this.GetCourseForCertificateGQL(slug),
    }).valueChanges;
    // return   this.http.get(`${this.url}/api/courses?populate=deep&filters[slug][$containsi]=`+slug)
  }
  getPackageDetail(slug: any) {
    return this.http.get(`${this.url}/api/packages/${slug}?populate=deep`);
  }


  /* GETTING PACKAGE DETAIL BY GRAPH QL */
  getPackageDetailbByGql(slug: string) {
    return this.apollo.watchQuery<any>({
      query: this.getPackageDetailGql(slug),
    }).valueChanges;
  }

  packageDetailPage() {
    return this.http.get(
      `${this.url}/api/pages?populate=deep&filters[slug][$eq]=package-detail`
    );
  }

  getOrderBySessinId(sessionId:string){
  return this.apollo.watchQuery<any>({
    query:this.getOrdersBySeesionIdGql(sessionId),
  }).valueChanges;
  }

  getOrderDetailByUserEmail(email:string){
    return this.apollo.watchQuery<any>({
      query:this.getOrderDetailByUserEmailGql(email),
    }).valueChanges;
    }
getInvoicetemplate()
{
  return this.apollo.watchQuery<any>({
    query:getInvoiceTemplateUrl,}).valueChanges;
}

  // CertificateDetail() {
  //   return this.http.get(`${this.url}/api/orders?populate=*`)
  // }

  getCourseCategory() {
    return gql`query {
        courses (filters:{id:{eq:"${this.courseId}"}}) {
          data {
            attributes {
              category{
                data{
                  id
                  attributes{
                    title
                  }
                }
              }
            }
          }
        }
      }`;
  }

  GetCourseForCertificateGQL(slug: string) {
    return gql`query {
    courses(filters:{slug:{eq:"${slug}"}}) {
      data {
        id
        attributes {
          title
          credit 
          shortDesc
          startDate
          endDate
          programNumber
          medium
          slug
          fieldOfStudy
          price
          videoUrl
          venueLocation
          handout  {
            data  
            { 
          		attributes {
                name
                url
                 alternativeText
                 caption
                width
                height
                mime
                previewUrl
              }
          	}
          }
          webinarId
          certificateTemplate{
            data{
              attributes{
                url
              }
            }
          }
          user_courses  (filters:{status:{eq:"Completed"}   } )
          {
            data
              {
                id
                attributes
                  {
                    course
                    {
                      data
                      {
                        id
                        
                      }
                    }
                    user
                    {
                      data
                      {
                        id
                        
                      }
                    }
                    status
                    completedOn
                  }
                
              }
          } 
          }
        }
          
        }
      }
  `;
  }

  getCoursesDetail(slug: string) {
    return gql`query {
    courses(filters:{slug:{eq:"${slug}"}}) {
      data {
        id
         
        attributes {
          title
          credit 
          shortDesc
          startDate
          endDate
          programNumber
          medium
          fieldOfStudy
          price
          discount
          videoUrl
          webinarId
          image {
            data  
            { 
          		attributes {
                name
                url
                 alternativeText
                 caption
                width
                height
                mime
                previewUrl
              }
          	}
          }
          keywords
          slug
          redirection_Link
          certificateTemplate{
            data{
              attributes{
                url
              }
            }
          }
           category{
            data{
              attributes{
                title
               faqs{
                  faq{
                    question
                    answer
                  }
              }
              }
            }
          }
            tabs {
            title
            featureTitle
            content
            index
            image{
              data{
                attributes{
                  url
                }
              }
            }
          }
             instructors(	
              pagination: { limit: -1 }){
            data{
              attributes{
                firstName
                lastName
                bioData
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
          
        }
      }
    }
  }
  `;
  }

  getPackageDetailGql(slug: string) {
    return gql`query {
    packages(filters:{slug:{eq:"${slug}"}}){
  data{
    id
    attributes{
      title
      desc
      price
      slug
      discountedPrice
      outline
      createdAt
      image{
        data{
          attributes{
            url
          }
        }
      }
      faqs{
        title
        faq{
          answer
          question
        }
      }
      courses(filters:{isActive:{eq:true},forTaxLaw:{eq:true}},pagination: { limit: -1 }){
        data{
          id
          attributes{
            shortDesc
            title
            startDate
            endDate
            isActive
            slug
            price
            discount
            category{
              data{
                attributes{
                  title
                }
              }
            }
            image{
              data{
                attributes{
                  url
                }
              }
            }
            instructors(	
              pagination: { limit: -1 }){
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
      
      
    }
    }
  }
}`;
  }



  getOrderDetailByUserEmailGql(email: string) {
    return gql`query{
      orders(filters:{email :{ eq: "${email}" },
      orderStatus :{ eq: "succeeded" }}
    sort: "id:DESC"
    )
    {
       data{
         id,
         attributes{
           OrderItems{
            title
            courseId
            packageId
            qty
            price
            finalPrice
            
            Enrolls{
              email
            }
          }
          totalPrice 
          finalPrice
          createdAt
           orderStatus
           stripeSessionId,
           userId
           email
           
          
         }
       }
     }
       }`
      }

  getOrdersBySeesionIdGql(sessionId:string){
    return gql`query{
      orders(filters:{stripeSessionId:{eq:"${sessionId}"}}){
       data{
         id,
         attributes{
           OrderItems{
            title
            courseId
            packageId
            price
            finalPrice
            Enrolls{
              email
            }
          }
          totalPrice 
          finalPrice
           orderStatus
           stripeSessionId,
           userId
           email
          
         }
       }
     }
       }`
  }
}
