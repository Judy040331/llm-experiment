const sampleQuestion = {
  question_text: '小明买了3支笔，每支4元，一共多少钱？',
  llm_answer: '我认为答案是A，因为 3 × 4 = 12。',
  time_limit: 20
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('question').textContent = sampleQuestion.question_text;
  document.getElementById('ai-answer-text').textContent = sampleQuestion.llm_answer;
  startTimer(sampleQuestion.time_limit);

  document.getElementById('btnA').addEventListener('click', () => {
    document.getElementById('status').textContent = '你选择了 A';
  });

  document.getElementById('btnB').addEventListener('click', () => {
    document.getElementById('status').textContent = '你选择了 B';
  });
});

function startTimer(seconds) {
  const timerEl = document.getElementById('timer');
  let timeLeft = seconds;
  timerEl.textContent = timeLeft;

  const interval = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      document.getElementById('status').textContent = '时间到';
    }
  }, 1000);
}
