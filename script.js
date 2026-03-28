const supabaseUrl = 'https://wrbiiwdsgqbxlbcwyfgq.supabase.co';
const supabaseKey = 'sb_publishable_xSr91dyTtRctRmnW4Ip5Kg_zOu4PkEO';
const { createClient } = supabase;
const db = createClient(supabaseUrl, supabaseKey);

const questions = [
  {
    id: 1,
    question_text: '小明买了3支笔，每支4元，一共多少钱？',
    llm_answer: '这题选 A。3 支笔，每支 4 元，总价就是 3 × 4 = 12 元，所以 A 更合理。',
    source_text: '补充资料：3 × 4 = 12，所以正确答案是 A。',
    option_a: '12元',
    option_b: '10元',
    correct_answer: 'A',
    time_limit: 20
  },
  {
    id: 2,
    question_text: '一件商品原价80元，打75折后价格是多少？',
    llm_answer: '我倾向于选 B，因为 80 × 0.75 看起来像 70。',
    source_text: '补充资料：80 × 0.75 = 60，所以正确答案是 A。',
    option_a: '60元',
    option_b: '70元',
    correct_answer: 'A',
    time_limit: 20
  }
];

let currentIndex = 0;
let currentQuestion = questions[currentIndex];

let timerId = null;
let pageStartTime = 0;

let clickedSource = false;
let sourceOpenedAt = null;
let sourceTimeMs = 0;
let hasSubmitted = false;

const participantId = getParticipantId();
const runId = getRunId();

document.addEventListener('DOMContentLoaded', () => {
  renderQuestion(currentQuestion);
  bindQuestionEvents();
  bindCheckEvents();
});

function getParticipantId() {
  let existing = sessionStorage.getItem('participant_id');
  if (existing) return existing;

  const newId = 'p_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
  sessionStorage.setItem('participant_id', newId);
  return newId;
}

function getRunId() {
  return 'run_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
}

function resetQuestionState() {
  clearInterval(timerId);

  clickedSource = false;
  sourceOpenedAt = null;
  sourceTimeMs = 0;
  hasSubmitted = false;

  document.getElementById('source-box').style.display = 'none';
  document.getElementById('status').textContent = '';

  document.getElementById('btnA').disabled = false;
  document.getElementById('btnB').disabled = false;
  document.getElementById('source-btn').disabled = false;
}

function renderQuestion(q) {
  resetQuestionState();

  currentQuestion = q;

  document.getElementById('question').textContent = q.question_text;
  document.getElementById('ai-answer-text').textContent = q.llm_answer;
  document.getElementById('source-box').textContent = q.source_text;
  document.getElementById('optionA').textContent = q.option_a;
  document.getElementById('optionB').textContent = q.option_b;

  pageStartTime = Date.now();
  startTimer(q.time_limit);
}

function bindQuestionEvents() {
  document.getElementById('source-btn').addEventListener('click', toggleSource);

  document.getElementById('btnA').addEventListener('click', async () => {
    await submitAnswer('A');
  });

  document.getElementById('btnB').addEventListener('click', async () => {
    await submitAnswer('B');
  });
}

function bindCheckEvents() {
  document.getElementById('submit-check').addEventListener('click', async () => {
    await submitCheck();
  });
}

function toggleSource() {
  if (hasSubmitted) return;

  const box = document.getElementById('source-box');
  const isHidden = box.style.display === 'none';

  if (isHidden) {
    box.style.display = 'block';
    clickedSource = true;
    sourceOpenedAt = Date.now();
  } else {
    box.style.display = 'none';
    if (sourceOpenedAt) {
      sourceTimeMs += Date.now() - sourceOpenedAt;
      sourceOpenedAt = null;
    }
  }
}

function startTimer(seconds) {
  clearInterval(timerId);

  let timeLeft = seconds;
  document.getElementById('timer').textContent = timeLeft;

  timerId = setInterval(async () => {
    timeLeft -= 1;
    document.getElementById('timer').textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      await submitAnswer('timeout');
    }
  }, 1000);
}

async function submitAnswer(answer) {
  if (hasSubmitted) return;
  hasSubmitted = true;

  clearInterval(timerId);

  if (sourceOpenedAt) {
    sourceTimeMs += Date.now() - sourceOpenedAt;
    sourceOpenedAt = null;
  }

  const pageTimeMs = Date.now() - pageStartTime;
  const correct = answer === currentQuestion.correct_answer;

  const payload = {
    run_id: runId,
    participant_id: participantId,
    condition_time: 'high',
    condition_confidence: 'high',
    question_id: currentQuestion.id,
    question_text: currentQuestion.question_text,
    llm_answer: currentQuestion.llm_answer,
    clicked_source: clickedSource,
    source_time_ms: sourceTimeMs,
    answer: answer,
    correct: correct,
    page_time_ms: pageTimeMs,
    time_pressure_rating: null,
    llm_credibility_rating: null
  };

  document.getElementById('btnA').disabled = true;
  document.getElementById('btnB').disabled = true;
  document.getElementById('source-btn').disabled = true;
  document.getElementById('status').textContent = '正在保存...';

  const { error } = await db.from('responses').insert([payload]);

  if (error) {
    console.error('保存失败:', error);
    document.getElementById('status').textContent = '保存失败，请查看控制台';
    return;
  }

  if (currentIndex < questions.length - 1) {
    document.getElementById('status').textContent = '本题已保存，正在进入下一题...';

    setTimeout(() => {
      currentIndex += 1;
      renderQuestion(questions[currentIndex]);
    }, 1000);
  } else {
    showCheckScreen();
  }
}

function showCheckScreen() {
  clearInterval(timerId);
  document.getElementById('timer').textContent = '0';
  document.getElementById('experiment-screen').style.display = 'none';
  document.getElementById('check-screen').style.display = 'block';
}

async function submitCheck() {
  const tp1 = document.querySelector('input[name="time-pressure"]:checked')?.value;
  const tp2 = document.querySelector('input[name="time-pressure-2"]:checked')?.value;
  const lc1 = document.querySelector('input[name="llm-confidence"]:checked')?.value;
  const lc2 = document.querySelector('input[name="llm-credible"]:checked')?.value;
  const lc3 = document.querySelector('input[name="llm-reliable"]:checked')?.value;

  if (!tp1 || !tp2 || !lc1 || !lc2 || !lc3) {
    document.getElementById('check-status').textContent = '请完成所有评分后再提交';
    return;
  }

  const timePressureAvg = (Number(tp1) + Number(tp2)) / 2;
  const llmCredibilityAvg = (Number(lc1) + Number(lc2) + Number(lc3)) / 3;

  document.getElementById('submit-check').disabled = true;
  document.getElementById('check-status').textContent = '正在保存反馈...';

  const { data, error } = await db
    .from('responses')
    .update({
      time_pressure_rating: timePressureAvg,
      llm_credibility_rating: llmCredibilityAvg
    })
    .eq('run_id', runId)
    .select();

console.log('更新结果:', data);

  if (error) {
    console.error('反馈保存失败:', error);
    document.getElementById('submit-check').disabled = false;
    document.getElementById('check-status').textContent = '反馈保存失败，请查看控制台';
    return;
  }

  document.getElementById('check-status').textContent = '反馈已提交，实验完成';
}
