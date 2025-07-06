let questions = [];
let currentIndex = 0;
let score = 0;
const userAnswers = [];

const questionNumberEl = document.getElementById('question-number');
const questionTextEl = document.getElementById('question-text');
const answersEl = document.getElementById('answers');
const quizCard = document.getElementById('quiz-card');
const resultCard = document.getElementById('result-card');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const reviewEl = document.getElementById('review');
const restartBtn = document.getElementById('restart');

function parseQuestions(text) {
  const blocks = text.trim().split(/\r?\n\r?\n/);
  return blocks.map(block => {
    const lines = block.split(/\r?\n/).map(line => line.trim());
    return {
      question: lines[0],
      answers: lines.slice(1, 5),
      correctIndex: Number(lines[5]) - 1
    };
  });
}

function loadQuestions() {
  fetch('questions.txt')
    .then(response => response.text())
    .then(text => {
      questions = parseQuestions(text);
      totalEl.textContent = questions.length;
      showQuestion();
    })
    .catch(err => {
      quizCard.innerHTML = '<p class="text-danger">Failed to load questions.</p>';
      console.error(err);
    });
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentIndex];
  questionNumberEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  questionTextEl.textContent = q.question;

  answersEl.innerHTML = '';
  q.answers.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.className = 'list-group-item list-group-item-action';
    btn.textContent = ans;
    btn.onclick = () => selectAnswer(i);
    answersEl.appendChild(btn);
  });
}

function selectAnswer(selectedIndex) {
  const q = questions[currentIndex];
  userAnswers.push(selectedIndex);
  if (selectedIndex === q.correctIndex) score++;
  currentIndex++;
  showQuestion();
}

function showResult() {
  quizCard.classList.add('d-none');
  resultCard.classList.remove('d-none');
  scoreEl.textContent = score;

  reviewEl.innerHTML = '';

  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'mb-3';

    const questionTitle = document.createElement('h6');
    questionTitle.textContent = `${i + 1}. ${q.question}`;
    div.appendChild(questionTitle);

    const userAnswer = userAnswers[i];
    const correctAnswer = q.correctIndex;

    q.answers.forEach((ans, idx) => {
      const ansP = document.createElement('p');
      ansP.textContent = ans;
      if (idx === correctAnswer) {
        ansP.style.fontWeight = 'bold';
        ansP.style.color = 'green';
      }
      if (idx === userAnswer && userAnswer !== correctAnswer) {
        ansP.style.textDecoration = 'line-through';
        ansP.style.color = 'red';
      }
      div.appendChild(ansP);
    });

    reviewEl.appendChild(div);
  });
}

restartBtn.onclick = () => {
  currentIndex = 0;
  score = 0;
  userAnswers.length = 0;
  resultCard.classList.add('d-none');
  quizCard.classList.remove('d-none');
  showQuestion();
};

loadQuestions();
