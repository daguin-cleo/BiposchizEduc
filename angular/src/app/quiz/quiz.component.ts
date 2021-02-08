import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QuestionAPIService } from '../question-api.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @ViewChild('card') card: ElementRef;
  private rotationCard = 180;


  constructor(private questionService: QuestionAPIService) { }

  ngOnInit() {
    this.questionService.getQuestion(1);
  }

  ngAfterViewInit() {
    this.card.nativeElement.addEventListener('click', this.turnCard.bind(this))
  }

  turnCard(){
    this.card.nativeElement.style.transform = `rotateY(${this.rotationCard}deg)`;
  }


  setNextQuestion() {
    
  }

}
