// DOM要素を取得
// 問題数
// ジャンル
// 難易度
// 問題文
// 開始ボタン
// 回答ボタン
const questionNumber = document.getElementById('question_number');
const genre = document.getElementById('genre');
const difficultyLevel = document.getElementById('difficulty_level');
const question = document.getElementById('question');
const startButton = document.getElementById('start');
const answerButton = document.getElementsByClassName('answer_button');

// 回答ボタンを非表示にする
const innerAnswerButton = document.getElementById('inner_answer_button');
innerAnswerButton.style.display = 'none';

// 問題数カウント
let questionNumberCount = 1;

// 問題の切り替えるためのカウント
let quizNumber = 0;

// 正解数カウント
let score = 0;

// 開始ボタン押下時の処理
startButton.addEventListener('click', () => {
  questionNumber.textContent = '取得中';
  question.textContent = '少々お待ちください';
  startButton.style.display = 'none';
  callQuizData();
})

// クイズデータをクラスに格納
class Quiz {
  constructor(quizDataResult) {
    this.quizDataResult = quizDataResult;
  }
  // 問題を設置
  setUpQuiz() {
    questionNumber.textContent = `問題${questionNumberCount}`;
    genre.textContent = `【ジャンル】${this.quizDataResult[quizNumber].category}`;
    difficultyLevel.textContent = `【難易度】${this.quizDataResult[quizNumber].difficulty}`;
    question.textContent = this.quizDataResult[quizNumber].question;
    innerAnswerButton.style.display = 'block';
  }
  // 回答を設置
  setUpAnswer() { 
    // 回答を配列に格納
    const quizDatas = this.quizDataResult[quizNumber];
    const incorrectAnswers = quizDatas.incorrect_answers;
    const questionArray = [
      incorrectAnswers[0],
      incorrectAnswers[1],
      incorrectAnswers[2],
      quizDatas.correct_answer
    ];
      
    // ランダムで取り出した後にもう一度、配列に格納
    for (let i = questionArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = questionArray[i];
      questionArray[i] = questionArray[j];
      questionArray[j] = tmp;
    } 
    const questionRandomArray = [questionArray];
      
    // 回答を回答ボタンにセット
    for (let i = 0; i < answerButton.length; i++) {
      answerButton[i].textContent = questionRandomArray[0][i];
    }
  }
  // 回答ボタン押下時の処理
  clickHandler(quiz) {
    for (let i = 0; i < answerButton.length; i++) {
      answerButton[i].addEventListener('click', () => {
        // 正解を選ぶとスコアが＋１される
        if (answerButton[i].textContent === this.quizDataResult[quizNumber].correct_answer) {
            score++;
          }
        // 問題数の管理
        questionNumberCount++;
        quizNumber++;
        if (quizNumber < this.quizDataResult.length) {
          this.setUpQuiz();
          this.setUpAnswer();
        } else {
          questionNumber.textContent = `あなたの正解数は${score}問です！！`;
          question.textContent = '再度チャレンジしたい場合は以下をクリック！！';
          genre.style.display = 'none';
          difficultyLevel.style.display = 'none';
          innerAnswerButton.style.display = 'none';
          returnHome(quiz);
        }
      });
    }
  }
}

// apiを取得、クイズを設置
const callQuizData = async () => {
  const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
  const quizData = await res.json();
  const quiz = new Quiz(quizData.results);
  quiz.setUpQuiz();
  quiz.setUpAnswer();
  quiz.clickHandler(quiz);
}

// ホームへ戻るボタンの実装
const returnHome = (quiz) => {
  // ホームへ戻るボタンの生成
  const challengeAgain = document.getElementById('challenge_again_btn');
  const challengeAgainButton = document.createElement('button');
  challengeAgainButton.textContent = 'ホームに戻る';
  challengeAgain.appendChild(challengeAgainButton);
  
  // ホームへ戻るボタン押下時の処理
  challengeAgainButton.addEventListener('click', () => {
    challengeAgainButton.style.display = 'none';
    questionNumberCount = 1;
    quizNumber = 0;
    score = 0;
    genre.style.display = 'block';
    difficultyLevel.style.display = 'block';
    quiz.setUpQuiz();
  })
}