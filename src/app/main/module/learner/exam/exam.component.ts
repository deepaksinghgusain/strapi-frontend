import { AfterViewInit, Attribute, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CourseService } from '../../core/services/course.service';
import { CommanService } from '../../core/sharedServices/comman.service';
import { DatePipe } from '@angular/common';
import { ExamService } from '../../core/services/exam.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jsPDF } from "jspdf";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import moment from 'moment';
import { PageService } from '../../core/services/page.service';
import { LandingPageService } from '../../core/services/landing-page.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit, AfterViewInit {
  footerData: any;
  muxPlaybackId: any;
  slug: any;
  TodaysDate = new Date();
  questionList: any;
  questionCount: number = 0;
  finalQuestionCount=0;
  currentQuestionIndex: number = 0;
  disablePrev = true;
  disableNext = false;
  submit = false;
  viewMode = 'home-tab';
  prevs = false;
  answerJson: any = []
  finalAnswerJson: any = []
  @ViewChild('video')
  video!: ElementRef;
  @ViewChild('template1')
  template1!: TemplateRef<any>;
  @ViewChild('template3')
  template3!: TemplateRef<any>;
  @ViewChild('template2')
  template2!: TemplateRef<any>;
  @ViewChild('template4')
  template4!: TemplateRef<any>;
  @ViewChild('template5')
  template5!: TemplateRef<any>;
  @ViewChild('template6')
  template6!: TemplateRef<any>;
  finalQuestionList: any;
  ScoreObtained: any;
  totalScore: any;
  totalPercentage: any;
  showPassModel = false;
  showFailModel = false;
  certificatehtml: any;
  username: any;
  url: any;
  title: any
  isShow = false;
  examId: any;
  getusers: any;
  showErr = false
  err: any;
  credit: any;
  selectedCourse: any;
  courseid: number = 0;
  viewerUserId: any;
  muxVideoEnv: any;
  SectionTitle: any;
  TabSectionTitle: any;
  TabSectionDesc: any;
  finalquestionList: any;
  passPercentage: any;
  vidViewPercent:any = 0;
  showQuestionOnTime = false;
  isAnswerTrue: any = null;
  isAttempted: any = null;
  num: any;
  isVal = false;
  isPlay: any = false;
  isPaused: any = false;
  playBtnCount: number = 0;
  reviewAnswerJson: any = []
  hintForQuestion: any;
  isFinalExam: boolean = true;   // for final exam button disable or enable;
  faq: any;
  isReviewExamExist = false;   // for existance of review exam for that particular course
  dsblFinalExmBtn = true;
  userEmail: any;
  isReviewExamPassed: any = false;
  lastVideoViewed: any = 0;
  userCourseId: any;
  timeStampsAray: any = [];
  pausedDuration: any = 0;
  prTime: any;
  pauseBtnCount: any = 0;
  timoutId: any;
  currPausedTime: any = 0;
  isTimeoutClear:any = false;
  finalExamId:any;
  videoWatchTime :any;
  firstName:any;
  lastName:any;
  courseCompletedOn:any;
  nextQuesRemainingTime:any=0;
  isTimeoutCleared:any=false;
  showFirstReviewQuestion = true;
  showReviewQTimeoutId:any;

  constructor(private modalService: BsModalService, private datePipe: DatePipe,
    private _commannService: CommanService, private http: HttpClient,
    private sanitizer: DomSanitizer, private _pageService: PageService,
    private courseService: CourseService, private examService: ExamService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private LandingPageService: LandingPageService,
  ) {
    this.username = localStorage.getItem('username')
    this.viewerUserId = localStorage.getItem('userId')
    this.muxVideoEnv = environment.muxVideoEnv;
    this.userEmail = localStorage.getItem('email')

  }

  ngAfterViewInit(): void {
    this.video.nativeElement.innerHTML = ` <video
    id="my-player"
    class="video-js vjs-16-9"
    controls
    preload="auto"
    width="90%"
      data-setup='{   "timelineHoverPreviews": true,
        "plugins": {
          "mux": {
            "debug": true,
            "data":{
              "env_key":"${this.muxVideoEnv}",
              "video_title":"${this.slug}",
              "viewer_user_id":"${this.viewerUserId}"
            }
          }

        }
      }'
    >
    <source src=${this.muxPlaybackId} type="video/mux" />
    </video>`

    let currPlayedTime = 0;

    var video = document.getElementsByTagName('video')[0];

    video.addEventListener('pause', () => {
      this.pauseBtnCount = this.pauseBtnCount + 1; 
      if(this.showFirstReviewQuestion){
        clearTimeout(this.showReviewQTimeoutId);
      }else{
        clearTimeout(this.timoutId);
        this.isTimeoutCleared = true;
        if (this.isReviewExamExist) {
          this.nextQuesRemainingTime = Math.floor(this.questionList[this.currentQuestionIndex + 1].timeStampInSeconds - video.currentTime);
        }
      }
      this.isPlay = false;
      this.isPaused = true;
    });

    video.addEventListener('play', () => {
      this.playBtnCount = this.playBtnCount + 1;
      this.isPlay = true;
      if ((this.playBtnCount == 1 || this.showFirstReviewQuestion) && this.isReviewExamExist && !this.isReviewExamPassed ) {
        this.showReviewQuestions()
      }
      if (this.playBtnCount > 1 && !this.isAnswerTrue && this.showQuestionOnTime) {
        if (this.isReviewExamExist) {
          this.CheckAnswer()
          this.isPaused = true;
        }
      }
      if (this.playBtnCount > 1 && this.isAnswerTrue && this.currentQuestionIndex < this.questionList.length - 1){
        this.resumeCountdown();
      }
      this.isPaused = false;
    });

    video.addEventListener('playing', () => {
      if (!this.isPaused) {
        this.sendVidViewToUsercourse();
      }
      setInterval(() => { if (!this.isPaused) {
        this.sendVidViewToUsercourse();
      }}, 5000);
    });

    video.addEventListener('waiting', () => {
      console.log("waiting")
    });

    video.addEventListener('seeking', () => {
      const delta = video.currentTime - this.prTime;
      if (Math.abs(delta) > 1) {
        video.currentTime = this.prTime;
      }
    });

    video.addEventListener('seeked', () => {
      console.log("seeked")
    });

    video.addEventListener('ended', () => {
      this.vidViewPercent = 100.00
      this.prTime = 0;
    });

    video.addEventListener('timeupdate', (event) => {
      if (!video.seeking) {
        this.prTime = video.currentTime;
        if (this.showQuestionOnTime && !this.isAnswerTrue) {
          video.pause();
          alert("You MUST Correctly answer the Review Question below to continue.");
        }
      }
      this.videoWatchTime = video.currentTime.toFixed(0)
      localStorage.setItem("videoWatchTime",this.videoWatchTime)
      if(video.duration>0){
        this.vidViewPercent = ((this.videoWatchTime*100)/video.duration).toFixed(2) 
      }
    });
  }

  next(questionNo: number) {
    if (questionNo >= 0 && questionNo < this.questionCount - 1)
    this.currentQuestionIndex++
  }

  ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
      this.slug = this.activatedRoute.snapshot.params['slug']
      this.muxPlaybackId = this.activatedRoute.snapshot.params['url']
      let fullName= this.activatedRoute.snapshot.params['fullName']
      const name = fullName.split("-")
      this.firstName = name[0]
      this.lastName=name[1]!="null"? name[1] :''
      this.getUserCourse()
      this.getFinalquestionListing(this.slug);
      this.muxPlaybackId = this.activatedRoute.snapshot.params['url']
      })
    this.getPageContent('exam')
    this.getExamresult(this.slug);
    this.getCourseDetail(this.slug)
  }

  // Function to resume the countdown with the remaining time
  resumeCountdown() {
    // Set a new timeout with the remaining time
    this.timoutId = setTimeout(() => {
      // Check if the video is still playing before showing the question
      this.showQ(this.currentQuestionIndex + 1, this.questionList[this.currentQuestionIndex + 1]);
    }, this.nextQuesRemainingTime * 1000);
  }

  sanitize(content: any) {
    return this.sanitizer.bypassSecurityTrustHtml(content)
  }

  downloadCertificate(): void {
    this.getUserCourse();
    const course = this.selectedCourse
    const userId = localStorage.getItem('userId');
    const lastname = localStorage.getItem('lastname');
    if (this.selectedCourse) {
      const url = course?.certificateTemplate?.data?.attributes?.url
      const title = course.title || '';
      const credit = course.credit || '';
      const medium = course.medium || '';
      const fieldStudy = course.fieldOfStudy || '';
      const program = course.programNumber || '';
      let datecompleted = '';
      if (this.courseCompletedOn)
        datecompleted = moment(this.courseCompletedOn).format('MMMM DD, YYYY')
      //this function use for Cerficate Download in pdf.
      this.http.get(environment.apibaseurl + url, { responseType: 'text' }).subscribe(res => {
        let html = res.replace('{{username}}', this.firstName + " " + this.lastName)
                      .replace('{{username}}', this.username)
                      .replace('{{course}}', title)
                      .replace("{{credit}}", credit)
                      .replace("{{medium}}", medium)
                      .replace("{{fieldStudy}}", fieldStudy)
                      .replace("{{completedOn}}", datecompleted)
                      .replace("{{program}}", program);
        this.certificatehtml = this.sanitizer.bypassSecurityTrustHtml(html);
        this.certificatehtml = html
        let doc = new jsPDF('p', 'pt', [745, 745]);
        doc.html(this.certificatehtml, {
          callback: function (doc: any) {
            doc.save(`certificate_${title}.pdf`);
          },
        });
      })
    }
  }

  async downloadHandout() {
    let course = this.selectedCourse
    var userId = localStorage.getItem('userId');
    if (this.selectedCourse) {
      if(course?.handout?.data)
      {
        let handouts = course?.handout?.data;
        for (let handout of handouts) {
          if (handout?.attributes?.url) {
            if (handout?.attributes?.url) {
              const fileUrls = `${environment.apibaseurl}${handout?.attributes?.url}`
              const image = await fetch(fileUrls)
              const imageBlog = await image.blob()
              const imageURL = URL.createObjectURL(imageBlog)
              const link = document.createElement('a')
              link.href = imageURL
              link.download = 'Handout'
              link.target = "_blank"
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
          }
        }
      }
    }
  }

  getPageContent(slug: any) {
    this._pageService.getPageCMSContent(slug).subscribe((res: any) => {
      this.SectionTitle
      const apiSection = res?.data[0]?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.api-section')[0];
      const tabSection = res?.data[0]?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.tab-with-button')[0];
      this.faq = res?.data[0]?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.static-section')[0];
      this.SectionTitle = apiSection?.title
      this.TabSectionTitle = tabSection?.sectionTitle
      this.TabSectionDesc = tabSection?.sectionDescription
    })
  }
  
  openErrModal(title: any, btnStatus: boolean) {
    const initialState = {
      title: title,
      btnStatus: btnStatus
    };
    this.modalRef = this.modalService.show(PopupComponent, { initialState, class: 'submit-popup modal-lg modal-dialog-centered', backdrop: 'static', keyboard: false, focus: btnStatus });
  }

  modalRef: BsModalRef | undefined;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered modal-exams' })
    );
  }

  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;
      }
    })
  }

  openModal1(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );

  }

  openModal2(template2: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template2,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );
  }

  openModal3(template3: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template3,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );
  }

  openModal4(template3: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template3,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );
  }

  openModal5(template3: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template3,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );
  }

  openModal6(template3: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template3,
      Object.assign({}, { class: 'submit-popup modal-lg modal-dialog-centered' })
    );
  }

  getReviewQuestionListing(id: any) {
    this.examService.getReviewExamQuestion(id).subscribe((res: any) => {
      if (res) {
        if (res?.data?.reviewExams.data.length > 0) {
          this.isFinalExam = false;
          // enable the final exam button if  the review exam of same course has already given
          if (this.isReviewExamPassed) {
            this.dsblFinalExmBtn = false;
          } else {
            this.dsblFinalExmBtn = true;
          }
          this.isReviewExamExist = true;
          let questions: any = [];
          let timeStampInSecondsArray: any = [];
          let questiondata = res?.data?.reviewExams.data[0].attributes?.questions
          this.examId = res?.data?.reviewExams.data[0].id
          questiondata.map(function (element: any) {
            let questionOptions: any = [];
            element.options.map(function (item: any) {
              questionOptions.push({
                "id": item.id,
                "option": item.option,
                "isAnswer": item.isAnswer,
                "hint": item.hint,
              })
            })
            const timeStampInSeconds = ((element.durationInminute.split(':')[0] || 0) * 60 * 60) + ((element.durationInminute.split(':')[1] || 0) * 60)

            timeStampInSecondsArray.push(timeStampInSeconds)

            questions.push({
              "id": element.id,
              "isMCQ": true,
              "selectedAnswer": "",
              "title": element.title,
              "options": questionOptions,
              timeStampInSeconds,
            })

          })

          this.timeStampsAray = timeStampInSecondsArray
          this.questionList = questions
          this.questionCount = this.questionList.length;

        } else {
          this.isReviewExamExist = false;
          this.isFinalExam = true;
          this.dsblFinalExmBtn = false;
        }
      }
    }, (error: any) => {
      console.log('error in fetching course listing', error)
    })
  }

  reviewExamsAnswer(option: any, question: any, selectedIndex: number) {
    this.questionList.map(function (item: any, indx: number) {
      console.log("item of question list", item, indx);
      if (indx === selectedIndex)
        item.selectedAnswer = option
    })
    if (question.isAnswer) {
      console.log("your answer is correct");
      this.hintForQuestion = question.hint;
      this.openModal5(this.template6)
    }
    else {
      this.hintForQuestion = question.hint
      this.openModal5(this.template5)
      this.isAnswerTrue = false;
      this.isAttempted = true;
      this.CheckAnswer()
    }
    let jsonData = {
      "question": this.questionList[selectedIndex].title.trim(),
      "answer": option.trim()
    }
    this.answerJson[selectedIndex] = jsonData;
    localStorage.setItem('FinalAnswerList', JSON.stringify(this.questionList))
    this.reviewAnswerJson = localStorage.getItem("FinalAnswerList");
    this.reviewAnswerJson = JSON.parse(this.reviewAnswerJson)
  }

  selectAnswer(option: any, selectedIndex: number) {
    this.finalquestionList.map(function (item: any, indx: number) {
      if (indx === selectedIndex)
        item.selectedAnswer = option
    })

    let jsonData = {
      "question": this.finalquestionList[selectedIndex].title.trim(),
      "answer": option.trim()
    }
    this.finalAnswerJson[selectedIndex] = jsonData;
  }

  checkFinalAnswers() {
    if (this.finalAnswerJson.length != this.finalQuestionCount || this.finalAnswerJson.includes(undefined)==true ) {
      this.err = 'Make sure you have answered each question'
      this.openErrModal(this.err, false);
    }
    else {
      this.openModal1(this.template1)

    }
  }

  close() {
    this.modalService.hide();
  }

  closeRightAnswrM() {
    this.close()
    this.isAnswerTrue = true;
    this.isAttempted = true;
    this.CheckAnswer()

  }

  SubmitFinal() {
    let date: any = this.datePipe.transform(this.TodaysDate, 'yyyy-MM-dd');
    this.TodaysDate = date
    this.LandingPageService.getHeader().subscribe((res: any) => {
      this.passPercentage = res?.data?.attributes?.examPassPercentage || 70
    })
    let record = {
      "data": {
        "answerJson": this.finalAnswerJson,
        "exam": this.finalExamId,
        "startedOn": this.TodaysDate,
        "endedOn": this.TodaysDate
      }
    }

    this.examService.SubmitData(record).subscribe((res: any) => {
      if (res) {
        this.ScoreObtained = res.data.attributes.score
        this.totalScore = res.data.attributes.totalScore
        this.totalPercentage = this.ScoreObtained  * 100 / this.totalScore
        this.totalPercentage = this.totalPercentage.toFixed(2);
        if (this.totalPercentage >= this.passPercentage) {
          this.openModal3(this.template3)
          this.isShow = true;
        }
        else {
          this.openModal2(this.template2)
        }
      }
    },(resp: any) => {
      if (resp.status === 400 && resp.error.error.message != '' && resp.error.error.message.toLowerCase().indexOf('already given the exam') > 0) {
        this.openModal3(this.template4)
      }
    })
  }

  retakeExam() {
    this.currentQuestionIndex = 0;
    this.ngOnInit()
  }

  certificateTab() {
    this.ngOnInit()
  }

  getExamresult(slug: any) {
    const userID = localStorage.getItem('userId')
    this.courseService.getExamdetailByslug(slug).subscribe((res: any) => {
      this.getusers = res?.data?.userCourses?.data.filter((item: any) => item?.attributes.user.data.id === userID)
      let id = this.getusers.map((item: any) => { return item?.attributes.user.data.id })
      let ids = id[0]
      let exam = this.getusers[0].attributes?.user?.data?.attributes?.user_exams?.data;
      if (ids === userID && exam.length > 0) {
        var totalScore = exam[0]?.attributes?.totalScore
        var ScoreObtained = exam[0].attributes?.score
        this.totalPercentage = (Number(ScoreObtained) / Number(totalScore)) * 100
        this.totalPercentage = this.totalPercentage.toFixed(2);
        if (this.totalPercentage >= 70) {
          this.isShow = true;
        }
      }
      if (this.getusers[0]?.attributes?.status == "Completed") {
        this.isShow = true;
      }
    })
  }

  // GETTING COURSE DETAIL BY SLUG
  getCourseDetail(slug: any) {
    this.courseService.getcourseCertificateBySlug(slug).subscribe((res: any) => {
      this.selectedCourse = res?.data?.courses?.data[0].attributes;
      this.courseid = res?.data?.courses?.data[0].id
      localStorage.setItem('courseId', res?.data?.courses?.data[0].id)
    })
  }

  // getfinalquestion listing function
  getFinalquestionListing(id: any) {

    this.examService.getAllFinalExamQuestion(id).subscribe((res: any) => {
      if (res) {
        console.log(res)
        if (res?.data?.exams.data.length > 0) {
          let question = {
            "id": "",
            "isMCQ": true,
            "selectedAnswer": "",
            "title": "",
            "options": []
          }
          let finalquestions: any = [];
          let finalquestiondata = res?.data?.exams.data[0].attributes?.questions
          this.finalExamId = res?.data?.exams.data[0].id
          finalquestiondata.map(function (element: any) {
            let questionOptions: any = [];
            element.options.map(function (item: any) {
              questionOptions.push({
                "id": item.id,
                "option": item.option,
                "isAnswer": item.isAnswer,
              })
            })
            finalquestions.push({
              "id": element.id,
              "isMCQ": true,
              "selectedAnswer": "",
              "title": element.title,
              "options": questionOptions,
            })
          })
          this.finalquestionList = finalquestions
          this.finalQuestionCount = this.finalquestionList.length;
        }
      }
    }, (error: any) => {
      console.log('error in fetching course listing', error)
    })
  }

  sendVidViewToUsercourse(){

    let data : any = { "lastVideoView": this.videoWatchTime }

    if(this.vidViewPercent > 70 && this.courseCompletedOn === null) {
      data.status ="Completed";
      data.completedOn = moment(new Date()).format("Y-M-D")
    }

    const jsonData = { "data": data  }
    if (jsonData) {
      try {
        this.updateUserCourse(jsonData)
      } catch (error) {
        console.log(error);
        
      }
    }
  }


  //  GET VIDEO VIEWS METRIC
  getVidViewPercentage(updloadId: any) {
    this.examService.getVideoMetric(updloadId).subscribe((res: any) => {
      const totalLength =  parseFloat(res?.totalLengthOfVideo);
      let viewedLength;
      if(totalLength !=null || totalLength !=undefined || totalLength !=0 ) {
        if (res.videoViewEnd) {
          viewedLength = parseFloat(res?.videoViewEnd);
        } else {
          viewedLength = parseFloat(res?.videoViewDropped)
        }
        if(viewedLength){
          const jsonData = { "data": { "lastVideoView": (viewedLength / 1000).toFixed(2) } }
          if (jsonData) {
            this.updateUserCourse(jsonData)
          }
        }
      }
    },(error: any) => {
        this.videoWatchTime = 0;
      }
    )
  }

  //   function for showing review question on TimeStamp
  showReviewQuestions() {
    this.showFirstReviewQuestion = true;
    const question = this.questionList[this.currentQuestionIndex];
    let t = this.lastVideoViewed;
    if(this.pauseBtnCount > 0){
        t=this.videoWatchTime;
    }
    let firstTimeStamp = 0;
    let firstQuesIndex: any;
    const tmslength = this.timeStampsAray.length
    if (t < this.timeStampsAray[this.timeStampsAray.length - 1]) {
      for (let i = 0; i < tmslength; i++) {
        if (this.timeStampsAray[i] >= t) {
          firstTimeStamp = this.timeStampsAray[i];
          firstQuesIndex = i;
          break;
        }
      }
    }
    let examFirstTimeStamp;
    examFirstTimeStamp = firstTimeStamp - t;
    if (examFirstTimeStamp > 0) {
      this.showReviewQTimeoutId = setTimeout(() => {
                        this.isVal = true;
                        this.showQ(firstQuesIndex, question)
                      }, examFirstTimeStamp * 1000)
    }

  }

  showQafterPause(questionIndex:any) {
    const question = this.questionList[questionIndex];
    const timeStamps = (this.questionList[questionIndex].timeStampInSeconds)-this.currPausedTime;
    this.timoutId = setTimeout(() => {
                      this.showQ(questionIndex,question)
                    },timeStamps*1000);
  }

  showQ(index: any, question: any) {
    this.showQuestionOnTime = true;
    if (index >= 0 && this.questionList.length) {
      this.currentQuestionIndex = index;
      this.isAnswerTrue = false;
      console.log(this.questionList[this.currentQuestionIndex].hint);
      const audioPlayer = <HTMLVideoElement>document.getElementById("my-player_html5_api");
      audioPlayer.pause()
      this.CheckAnswer()

    }
  }

  CheckAnswer() {
    this.showFirstReviewQuestion = false;
    const videoPlayer = <HTMLVideoElement>document.getElementById("my-player_html5_api");
    if (this.isAnswerTrue && this.currentQuestionIndex < this.questionList.length - 1) {
      videoPlayer.play()
      const currQuestion = this.questionList[this.currentQuestionIndex];
      const nquestion = this.questionList[this.currentQuestionIndex + 1];
      const nquestionIndex = this.currentQuestionIndex +1;
      let nextTimeout = nquestion.timeStampInSeconds - currQuestion.timeStampInSeconds;
      
    } else if (this.isAnswerTrue && this.currentQuestionIndex == this.questionList.length - 1) {
      this.isFinalExam = true;
      this.dsblFinalExmBtn = false;
      const jsonData = {
                          "data": { "isReviewExamPassed": true }
                        }
      this.updateUserCourse(jsonData)
      this.viewMode = 'exam-tab'
    }
    else {
        videoPlayer.pause()
    }
  }

  getUserCourse() {
    this.courseService.GetUserSubscribedCourses(this.userEmail).subscribe((res: any) => {
      if (res) {
        let filterCourses = res?.data?.userCourses?.data.filter((element: any) => {
          return element.attributes?.course?.data?.attributes.slug == this.slug
        })
        if (filterCourses.length > 0) {
          this.isReviewExamPassed = filterCourses[0]?.attributes?.isReviewExamPassed;
          this.lastVideoViewed = filterCourses[0]?.attributes?.lastVideoView;
          this.userCourseId = filterCourses[0]?.id;
          this.courseCompletedOn = filterCourses[0]?.attributes?.completedOn;
        }
        this.getReviewQuestionListing(this.slug);
        var video = document.getElementsByTagName('video')[0];
        video.currentTime = this.lastVideoViewed;
        this.prTime = this.lastVideoViewed;
      }
    })
  }


  // Update last video viewed and isReview Exam Passed ;
  updateUserCourse(data: any) {
    
   this.examService.updateUserCourse(this.userCourseId, data).subscribe((res: any) => {
       if(res) {
        this.courseCompletedOn = res?.data?.attributes?.completedOn

        if(res?.data?.attributes?.status === "Completed") {
          this.isShow = true;
        }
       }
    })

  }
}
