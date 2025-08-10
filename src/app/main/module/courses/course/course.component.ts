import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { defaultOwlOptions } from 'src/app/shared/default-Owloptions';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
  
  custommembers1: OwlOptions =  defaultOwlOptions

}

