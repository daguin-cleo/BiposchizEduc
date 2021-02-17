export interface IQuestion {
    type: number;
    couleur: number;
    question: string;
    explication: string;
    answers: Answer[];
}

export interface Answer {
    text: string;
    correct: boolean;
}

export class Question implements IQuestion{

    constructor (public type: number,public couleur: number,public question: string,public explication: string, public answers: Answer[]){

    }

}