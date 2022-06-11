import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  allWords: string[] = [
    'Gorzów Wielkopolski',
    'Zjednoczone Emiraty Arabskie',
    'lekkoatletyka',
    'interpunkcja',
    'telekomunikacja',
    'metamorfoza',
    'zwierzchnictwo',
    'prześladowanie',
    'antyterrorysta',
    'dźwiękonaśladownictwo',
    'kolorowanka',
    'luminescencja',
    'magnetoelektryczny',
    'malkontenctwo',
    'primaaprilisowy',
    'pięćdziesięciogroszówka',
    'anatomopatologiczny',
    'deoksyrybonukleinowy'
  ];
  usedWords: string[] = [];
  currentWord: string[] = [];
  lettersInGame: string[] = [];
  usedLetters: string[] = [];
  gameState: boolean = false;
  isLooser: boolean = false;
  lives: number = 4;
  hearts: number[] = [];
  points: number = 0;

  // clear repetetive elems in array func
  onlyUnique(value: any, index:any, self:any) {
    return self.indexOf(value) === index;
  }

  // clear state
  clearGame() {
    this.currentWord = [];
    this.lettersInGame = [];
    this.usedLetters = [];
    this.gameState = false;
    this.isLooser = false;
    this.lives = 4;
    this.points = 0;
  }

  // Random index in range of allWords[] length
  getRandomIndex() {
    let min = 0;
    let max = this.allWords.length -1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Random word from array allWords[]
  getRandomWord() {
    let word = this.allWords[this.getRandomIndex()];

    if(word === undefined) return; // do nothing if there is no words in array

    this.usedWords.push(word); // add choosen word to array of usedWords[]
    this.allWords.splice(this.allWords.indexOf(word), 1); // then remove it form allWords[]

    this.currentWord = word.toUpperCase().split(''); // push choosen word as a list of letters
    this.lettersInGame = word.toUpperCase().split('').filter(i => i != ' ').filter(this.onlyUnique); // all letters that need to be typed to win the game

    return word;
  }

  clearLetterClasses() {
    const lettersDisplayed = document.querySelectorAll('.wholeWord__container');
    
    lettersDisplayed.forEach(item => {
      item.classList.remove('visible');
      item.classList.remove('lost');
      item.classList.remove('win');
    })

  }

  fixTextLines() {
    const lettersDisplayed = document.querySelectorAll('.wholeWord__container');
    
    lettersDisplayed.forEach(item => {
      if(item.firstChild?.textContent == ' ') {
        item.classList.add('breakWord');
      }
    })
  }

  startNewGame() {   
    this.clearLetterClasses();
    this.clearGame(); 
    this.getRandomWord();
    this.hearts.length = this.lives;
    setTimeout(() => {
      this.fixTextLines();
    }, 20);
  }

  continueGame() {
    this.gameState = false;
    this.usedLetters = [];
    this.clearLetterClasses();
    this.getRandomWord();
    setTimeout(() => {
      this.fixTextLines();
    }, 20);
  }

  lostGame() {
    const lettersDisplayed = document.querySelectorAll('.wholeWord__container');

    console.log('you lost :(...')
    lettersDisplayed.forEach(item => {
      if(item.firstChild?.textContent != ' ') item.classList.add('lost');
    })
    this.checkGuess();
    this.isLooser = true;
  }

  winGame() {
    const lettersDisplayed = document.querySelectorAll('.wholeWord__container');

    lettersDisplayed.forEach(item => {
      if(item.firstChild?.textContent != ' ') item.classList.add('win');
    })
    console.log('game finished!');
    this.gameState = true;
  }

  checkLetter(input: any) {
    const listElem = document.createElement('li');
    const lettersDisplayed = document.querySelectorAll('.wholeWord__container');

    if(this.lives == 0) return;

    if(input.value == '') return;
 
    if(this.currentWord.includes(input.value.toUpperCase()) && !this.usedLetters.includes(input.value.toUpperCase())) {
      lettersDisplayed.forEach(item => {
        if(item.textContent === input.value.toUpperCase()) {
          item.classList.add('visible');
          this.points += 1;
        }
      })
      listElem.classList.add('good');
    } else {
      this.lives -= 1;
      this.points -= 1;
      listElem.classList.add('bad');
    }

    this.hearts.length = this.lives;
    this.usedLetters.push(input.value.toUpperCase());
    input.value = ''
    this.checkIfGameIsFinished();
  }

  checkGuess() {
    const lettersDisplayed = document.querySelectorAll('.wholeWord__container');

    lettersDisplayed.forEach(item => {
      if(item.firstChild?.textContent !== ' ') {
        item.classList.add('visible');
      }
    })
  }

  checkWholeWord(word: any) {
    this.checkGuess();
    if(word.value.toUpperCase() === this.currentWord.join('').toUpperCase()) {
      console.log(true)
      this.winGame();
      this.points +=5
    } else {
      console.log(false)
      this.lostGame();
      this.points = 0;
      this.hearts.length = 0;
    }
  }

  checkIfGameIsFinished() {

    let gameStillOn = this.lettersInGame.every(element => {
      return this.usedLetters.includes(element);
    });

    if(!gameStillOn && this.lives > 0) {
      console.log('game in progress...')
    }
    else if(!gameStillOn && this.lives == 0) {
      this.lostGame();
    } 
    else {
      this.winGame();
    }
  }

}
