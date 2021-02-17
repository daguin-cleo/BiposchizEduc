import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Question, IQuestion } from '../question';
import { QuestionAPIService } from '../question-api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('cube') cube: ElementRef;

  private ctx: CanvasRenderingContext2D;

  private boardSize = {t_h: 9, t_w: 8}
  private tileSize = {h: 61, w: 58}
  private  board: number[] = [4, 3, 1, 2, 4, 3, 1, 2,
                              2, 0, 0, 0, 0, 0, 0, 4,
                              1, 0, 1, 2, 4, 3, 0, 3,
                              3, 0, 3, 5, 0, 1, 0, 1, 
                              4, 0, 4, 2, 0, 2, 0, 2, 
                              2, 0, 0, 0, 0, 4, 0, 4,
                              1, 3, 4, 2, 1, 3, 0, 3,
                              0, 0, 0, 0, 0, 0, 0, 1,
                              0, 0, 0, 0, 0, 0, 0, 2];
  private pawnPath = [{x: 7, y: 8}, {x: 7, y: 7}, {x: 7, y: 6}, {x: 7, y: 5}, {x: 7, y: 4}, {x: 7, y: 3}, {x: 7, y: 2}, {x: 7, y: 1}, 
                      {x: 7, y: 0}, {x:6, y:0}, {x: 5, y: 0}]
  private pawnCurrentIndex: number = 0;
  private pawnLastIndex: number = 0;

  private showThrowBtn: boolean = true;
  private showQuestion: boolean = false;
  private showTakeCard: boolean = false;

  private questionsRaw: Array<Question> = [];
  private questions: Array<Array<Question>> = [[], [], [], []];

  private tiles;
  private pawn;

  private currentClass: string = '';
  private currentColor: number;
  private currentQuestion: Question;

  private questionsIndex = [0, 0, 0, 0];
  

  constructor(private questionService: QuestionAPIService) { }

  ngOnInit() {
    this.questionService.getQuestion().subscribe((data) => {
      data.forEach(e => {
        this.questionsRaw.push(new Question(e.type, e.couleur, e.question, e.explication, e.answers));
      });
      this.tidyQuestion();
    });
  }

  tidyQuestion() {
    this.questionsRaw.forEach(question => {
      this.questions[question.couleur - 1].push(question)
    });
    this.setNextQuestion();
  }

  setNextQuestion() {
    const index = this.pawnPath[this.pawnCurrentIndex].y * this.boardSize.t_w + this.pawnPath[this.pawnCurrentIndex].x
    this.currentColor = this.board[index]; 
    this.currentQuestion = this.questions[this.currentColor - 1][this.questionsIndex[this.currentColor - 1]];
    this.questionsIndex[this.currentColor - 1] = (this.questionsIndex[this.currentColor - 1] + 1 >= this.questions[this.currentColor - 1].length) ? 0 : this.questionsIndex[this.currentColor - 1] + 1;
  }

  async ngAfterViewInit() {

    this.ctx = await this.initContext()

    const purpleTile = await this.loadTexture('../assets/images/purple-tile.png');
    const blueTile = await this.loadTexture('../assets/images/blue-tile.png');
    const yellowTile = await this.loadTexture('../assets/images/yellow-tile.png');
    const greenTile = await this.loadTexture('../assets/images/green-tile.png');
    const finalTile = await this.loadTexture('../assets/images/final-tile.png');
    this.pawn = await this.loadTexture('../assets/images/pion.png');
    this.tiles = [purpleTile, blueTile, yellowTile, greenTile, finalTile]
    this.drawBoard();
  }

  initContext(){
    return new Promise<CanvasRenderingContext2D>((resolve, reject) => {
      this.canvas.nativeElement.height = this.boardSize.t_h * this.tileSize.h;
      this.canvas.nativeElement.width = this.boardSize.t_w * this.tileSize.w;
      let ctx = this.canvas.nativeElement.getContext('2d');
      setTimeout(() => {
        resolve(ctx);
      }, 10);
    })

  }

  loadTexture(path: string) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        resolve(img);
      }
    })
  }

  drawBoard() {
    
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    for(let y = 0; y < this.boardSize.t_h; y++){
      for(let x = 0; x < this.boardSize.t_w; x++) {
        let tileNumber = this.board[this.boardSize.t_w * y + x]
        if(tileNumber != 0) 
          this.ctx.drawImage(this.tiles[tileNumber-1], x * this.tileSize.w, y * this.tileSize.h);
      }
    }
    this.ctx.drawImage(this.pawn, this.pawnPath[this.pawnCurrentIndex].x * this.tileSize.w, this.pawnPath[this.pawnCurrentIndex].y * this.tileSize.h)
  }


  rollDice() {
    let n = Math.floor(Math.random() * 6) + 1;
    let showClass = 'show-' + n;
    if (this.currentClass) {
      this.cube.nativeElement.classList.remove(this.currentClass);
    }
    this.cube.nativeElement.classList.add(showClass);
    this.currentClass = showClass;
    this.showThrowBtn = false;
    this.movePawn(n)
  }

  movePawn(nbCase: number) {
    let x = 0;
    this.pawnLastIndex =  this.pawnCurrentIndex;
    const i = setInterval(() => {
      this.pawnCurrentIndex++;
      this.drawBoard();
      x++;
      if(x >= nbCase || this.pawnCurrentIndex >= this.pawnPath.length) {
        clearInterval(i);
        this.setNextQuestion();
        this.prepareQuiz();
      }
    }, 500);
  }

  prepareQuiz() {
    this.showTakeCard = true;
  }

  switchView() {
    return new Promise<void>((resolve, reject) => {
      this.showTakeCard = false; 
      this.showThrowBtn = true;
      this.showQuestion = !this.showQuestion;
      setTimeout(() => {
        resolve();
      })
    })

  }

  async answerHandler(event: boolean) {
    console.log(event);
    if(!event) {
      this.pawnCurrentIndex = this.pawnLastIndex;
    }
    await this.switchView();
    this.ctx = await this.initContext();
    this.drawBoard();
  
  } 


}
