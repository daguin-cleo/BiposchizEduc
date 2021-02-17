import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IQuestion } from './question';

@Injectable()
export class QuestionAPIService {

  constructor( private http: HttpClient) {
  }

  getQuestion(): Observable<Array<IQuestion>> {
    return this.http.get<Array<IQuestion>>(`http://localhost:3000/questions`);
  }

}
