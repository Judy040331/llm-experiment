const supabaseUrl = 'https://wrbiiwdsgqbxlbcwyfgq.supabase.co';
const supabaseKey = 'sb_publishable_xSr91dyTtRctRmnW4Ip5Kg_zOu4PkEO';
const { createClient } = supabase;
const db = createClient(supabaseUrl, supabaseKey);

const sampleQuestion = {
  id: 1,
  question_text: '小明买了3支笔，每支4元，一共多少钱？',
  llm_answer: '我认为答案是A，因为 3 × 4 = 12。',
  source_text: '补充资料：3 × 4 = 12，所以正确答案是 A。',
  correct_answer: 'A',
  time_limit: 20
};

let timerId = null;
let timeLeft = 0;
let pageStartTime = 0;

let clickedSource = false;
let sourceOpenedAt = null;
let sourceTimeMs = 0;

let hasSubmitted = false;

document.addEventListener('DOMContentLoaded', () => {
  renderQuestion(sampleQuestion);
  bindEvents(sampleQuestion);
});

function renderQuestion(q) {
  document.getElementById('question').textContent = q.question_text;
  document.getElementById('ai-answer-text').textContent = q.llm_answer;
  document.getElementById('source-box').textContent = q.source_text;
  document.getElementById('status').textContent = '';

  pageStartTime = Date.now();
  startTimer(q.time_limit);
}

function bindEvents(q) {
  document.getElementById('source-btn').addEventListener('click', () => {
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
  });

  document.getElementById('btnA').addEventListener('click', async () => {
    await submitAnswer('A', q);
  });

  document.getElementById('btnB').addEventListener('click', async () => {
    await submitAnswer('B', q);
  });
}

function startTimer(seconds) {
  clearInterval(timerId);

  timeLeft = seconds;
  document.getElementById('timer').textContent = timeLeft;

  timerId = setInterval(async () => {
    timeLeft -= 1;
    document.getElementById('timer').textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      await submitAnswer('timeout', sampleQuestion);
    }
  }, 1000);
}

async function submitAnswer(answer, q) {
  if (hasSubmitted) return;
  hasSubmitted = true;

  clearInterval(timerId);

  if (sourceOpenedAt) {
    sourceTimeMs += Date.now() - sourceOpenedAt;
    sourceOpenedAt = null;
  }

  const pageTimeMs = Date.now() - pageStartTime;
  const correct = answer === q.correct_answer;

  const payload = {
    participant_id: 'test_user_001',
    condition_time: 'high',
    condition_confidence: 'high',
    question_id: q.id,
    question_text: q.question_text,
    llm_answer: q.llm_answer,
    clicked_source: clickedSource,
    source_time_ms: sourceTimeMs,
    answer: answer,
    correct: correct,
    page_time_ms: pageTimeMs
  };

  console.log('准备写入数据库:', payload);

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

  console.log('保存成功');

  if (answer === 'timeout') {
    document.getElementById('status').textContent = '时间到，系统已自动保存';
  } else {
    document.getElementById('status').textContent = `已保存你的答案：${answer}`;
  }
}
