import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestionAPIService {

  constructor( private http: HttpClient) {
  }

  getQuestion(id: Number) {
    this.http.get(`http://localhost:3000/questions/${id}`).subscribe((data) => {
      console.log(data)
    });
  }

}
