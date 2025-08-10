import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.css']
})
export class TextEditComponent implements OnInit {
  @Input() controlName: string = ''
  @Output() enableEdit: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onPencilClick() {
    
    this.enableEdit.emit(this.controlName);
  }
}
