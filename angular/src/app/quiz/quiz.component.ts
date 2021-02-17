import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Question, IQuestion } from '../question';
import { QuestionAPIService } from '../question-api.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuestionAPIService]
})
export class QuizComponent implements OnInit {

  @ViewChild('card') cardElement: ElementRef;
  @ViewChild('cardFront') cardFrontElement: ElementRef;

  private rotationCard = 180;

  private displayBtnAnswer: boolean = true;
  private answered: boolean;
  private answeredDisplay: string;

  cardColor = ['#561a50', '#003789', '#c4930c', '#127b25']
  cardText: Array<string> =  ['Prévention vie quotidienne', 'Traitements', 'Symptômes', 'Causes et origines']

  @Input() color: number;
  @Input() currentQuestion: Question;
  @Output() answerEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cardElement.nativeElement.addEventListener('click', this.turnCard.bind(this));
    this.cardFrontElement.nativeElement.style.setProperty('--bck-color', this.cardColor[this.color-1]);    
  }

  turnCard(){
    this.cardElement.nativeElement.style.transform = `rotateY(${this.rotationCard}deg)`;
  }


  setAnswer(answer: boolean) {
    this.displayBtnAnswer = false;
    this.answered = answer; 
    this.answeredDisplay = (answer) ? "Correcte" :  "Incorrect"; 
  }

  private processAnswer = () =>  {
    this.answerEvent.emit(this.answered);
  }





}
