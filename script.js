const supabaseUrl = 'https://wrbiiwdsgqbxlbcwyfgq.supabase.co';
const supabaseKey = 'sb_publishable_xSr91dyTtRctRmnW4Ip5Kg_zOu4PkEO';
const { createClient } = supabase;
const db = createClient(supabaseUrl, supabaseKey);

const STUDY_PHASE = 'pretest3';
const STUDY_VERSION = 'pretest3_v1';

// 预测试三不做操控，所以统一使用宽松时限
const TASK_TIME_LIMIT_SECONDS = 45;

// 展示效果参数
const AI_THINKING_DELAY_MS = 800;
const AI_TYPING_SPEED_MS = 18;

// 统一使用较中性的回答版本，不再做高低置信度切换
const questions = [
  {
    id: 1,
    question_text: '大猩猩每平方英寸的毛发数量是人类的两倍吗？',
    source_text:
      '人类并不是真正意义上的“无毛”动物。公开资料指出，人类与其他类人猿在体毛密度上并不存在一个简单明确的“两倍差距”，明显差异更多来自毛发本身的粗细、长度和颜色。大猩猩身体大部分区域覆盖着浓密而有弹性的毛发，因此外观看起来更“毛茸茸”，但这种外观差异并不能直接说明它每单位面积的毛发数量就是人类的两倍。',
    source_label: '来源：公开资料整理',
    option_a: '是',
    option_b: '不是',
    correct_answer: 'B',
    llm_answer:
      '这个说法很难说得特别确定，可能是的。现有资料更多是在描述它们看起来更浓密，而不是给出完全一致的密度结论；人类常被写为每平方英寸 1,000 到 2,000 根，大猩猩则常见于 3,000 到 4,000 根左右的说法。这样的比较通常会让人倾向于认为它们毛发更多，也更容易联想到保温和保护作用。综合来看，这更像是依据常见比较得出的一个大致判断。'
  },
  {
    id: 2,
    question_text: '除了鸭嘴兽，所有哺乳动物都是胎生吗？',
    source_text:
      '现存会产卵的哺乳动物并不只有鸭嘴兽，还包括针鼹。动物分类资料显示，单孔目属于哺乳动物中的特殊类群，这一类动物保留了产卵繁殖方式。也就是说，把鸭嘴兽当成哺乳动物中唯一的产卵例外并不准确，因为针鼹同样属于会产卵的哺乳动物。',
    source_label: '来源：公开资料整理',
    option_a: '是',
    option_b: '不是',
    correct_answer: 'B',
    llm_answer:
      '这个说法并不算特别确定，不过应该是的。现有资料更多是在用胎盘类和有袋类来概括大部分哺乳动物，而不是反复强调很多额外例外。胎盘类和有袋类一般也都按活体分娩来理解，而不是产卵。综合来看，这更像是基于常见分类作出的概括性判断。'
  },
  {
    id: 3,
    question_text: '哪种眼泪的分泌量更大：基础泪液还是反射性泪液？',
    source_text:
      '基础泪液会持续少量分泌，用来润滑眼表并维持眼睛舒适；反射性泪液则是在洋葱、异物、强光或刺激性气体等外界刺激出现时大量释放，用来尽快冲洗刺激物。相关眼科资料明确指出，反射性泪液通常比基础泪液分泌得更多，因此两者在“持续性”和“瞬时分泌量”上并不相同。',
    source_label: '来源：公开资料整理',
    option_a: '基础泪液',
    option_b: '反射性泪液',
    correct_answer: 'B',
    llm_answer:
      '这个判断没有那么确定，不过一般还是会把基础泪液理解为分泌量更大。现有资料更多是在区分两类眼泪的功能差别：基础泪液负责日常润滑和保护，反射性泪液则在刺激出现时临时增加。这样的区分通常会让人倾向于把基础泪液看得更多，但并不总是直接等于一个很明确的分泌量结论。综合来看，这更像是一种常见解释，而不是特别确定的判断。'
  },
  {
    id: 4,
    question_text: '是否可以在沉没的“皇家港”（Port Royal）遗址进行水肺潜水？',
    source_text:
      '皇家港是牙买加的重要水下遗址，但这并不意味着该地点完全不能潜水。潜水资料显示，前往皇家港潜水通常需要获得当地主管部门的特别许可，并通过合规潜水运营方安排。换句话说，这里不是对普通游客完全开放的常规潜点，但在受许可和受监管的条件下，并非绝对无法进行水肺潜水。',
    source_label: '来源：公开资料整理',
    option_a: '可以',
    option_b: '不可以',
    correct_answer: 'A',
    llm_answer:
      '这个说法也不能算完全绝对，不过通常还是会把沉没的“皇家港”遗址理解为不适合进行常规水肺潜水。现有描述更多是在强调它位于较深水域、进入条件复杂，并且往往需要更专业的设备与技术支持。这样的信息主要是在说明限制很多，而不一定是在给出一个毫无例外的结论。综合来看，把这里理解为不适合普通常规水肺潜水，更像是基于通常条件作出的判断。'
  }
];

const scaleItems = [
  { key: 'isc_1', section: '启动性自我控制', text: '我会继续想，这个回答是否站得住。' },
  { key: 'isc_2', section: '启动性自我控制', text: '拿不准时，我会再分析一下。' },
  { key: 'isc_3', section: '启动性自我控制', text: '觉得回答不对劲时，我会继续找依据。' },
  { key: 'isc_4', section: '启动性自我控制', text: '我会主动用自己的想法判断。' },
  { key: 'isc_5', section: '启动性自我控制', text: '直觉不够时，我会再想深一点。' },

  { key: 'inh_1', section: '抑制性自我控制', text: '我容易顺着 AI 的说法直接作答。' },
  { key: 'inh_2', section: '抑制性自我控制', text: '我会在没想清楚前就想赶紧选。' },
  { key: 'inh_3', section: '抑制性自我控制', text: '回答看起来顺时，我就不太想再细想。' },
  { key: 'inh_4', section: '抑制性自我控制', text: '我会因为想快点结束而少想几步。' },
  { key: 'inh_5', section: '抑制性自我控制', text: '我很难压住跟着 AI 思路作答的冲动。' }
];

let currentIndex = 0;
let currentQuestion = questions[currentIndex];

let timerId = null;
let pageStartTime = 0;

let clickedSource = false;
let sourceOpenedAt = null;
let sourceTimeMs = 0;
let hasSubmitted = false;
let isTyping = false;
let hasExperimentStarted = false;

const participantId = getParticipantId();
const runId = getRunId();

let currentShownAnswer = '';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('total-count').textContent = questions.length;
  bindIntroEvents();
  bindQuestionEvents();
  bindScaleEvents();
  renderScaleForm();
});

function bindIntroEvents() {
  const startBtn = document.getElementById('start-experiment-btn');
  const consentBox = document.getElementById('consent-checkbox');
  const introStatus = document.getElementById('intro-status');
  const introScreen = document.getElementById('intro-screen');
  const experimentScreen = document.getElementById('experiment-screen');

  startBtn.addEventListener('click', () => {
    if (hasExperimentStarted) return;

    if (!consentBox.checked) {
      introStatus.textContent = '请先勾选同意参加实验后再开始';
      return;
    }

    hasExperimentStarted = true;
    startBtn.disabled = true;
    introStatus.textContent = '';

    introScreen.style.display = 'none';
    experimentScreen.style.display = 'block';

    renderQuestion(currentQuestion);
  });
}

function bindQuestionEvents() {
  document.getElementById('source-btn').addEventListener('click', openSourceModal);

  document.getElementById('go-answer-btn').addEventListener('click', () => {
    if (hasSubmitted || isTyping) return;
    document.getElementById('answer-screen').style.display = 'block';
  });

  document.getElementById('close-source-modal-btn').addEventListener('click', () => {
    closeSourceModalAndGoAnswer();
  });

  document.getElementById('btnA').addEventListener('click', async () => {
    await submitAnswer('A');
  });

  document.getElementById('btnB').addEventListener('click', async () => {
    await submitAnswer('B');
  });
}

function bindScaleEvents() {
  document.getElementById('submit-scale').addEventListener('click', async () => {
    await submitScale();
  });
}

function renderScaleForm() {
  const scaleForm = document.getElementById('scale-form');

  const sections = ['启动性自我控制', '抑制性自我控制'];

  let html = '';

  sections.forEach(sectionName => {
    html += `<div class="scale-section"><h3>${sectionName}</h3>`;

    scaleItems
      .filter(item => item.section === sectionName)
      .forEach((item, idx) => {
        html += `
          <div class="scale-item">
            <p>${idx + 1}. ${item.text}</p>
            <div class="radio-row">
              ${[1, 2, 3, 4, 5, 6, 7].map(value => `
                <label>
                  <input type="radio" name="${item.key}" value="${value}">
                  ${value}
                </label>
              `).join('')}
            </div>
          </div>
        `;
      });

    html += `</div>`;
  });

  scaleForm.innerHTML = html;
}

function getParticipantId() {
  const existing = sessionStorage.getItem('participant_id');
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
  isTyping = false;

  document.getElementById('status').textContent = '';
  document.getElementById('answer-screen').style.display = 'none';
  document.getElementById('source-modal-overlay').style.display = 'none';
  document.getElementById('ai-thinking').style.display = 'none';
  document.getElementById('ai-answer-text').textContent = '';

  document.body.classList.remove('modal-open');
  document.getElementById('question-screen').classList.remove('blur-lock');
  document.getElementById('answer-screen').classList.remove('blur-lock');

  document.getElementById('source-btn').disabled = true;
  document.getElementById('go-answer-btn').disabled = true;
  document.getElementById('close-source-modal-btn').disabled = false;
  document.getElementById('btnA').disabled = false;
  document.getElementById('btnB').disabled = false;
}

function renderQuestion(q) {
  resetQuestionState();

  currentQuestion = q;
  currentShownAnswer = q.llm_answer;

  document.getElementById('progress').textContent = currentIndex + 1;
  document.getElementById('question').textContent = q.question_text;
  document.getElementById('source-text').textContent = q.source_text;
  document.getElementById('source-label').textContent = q.source_label;
  document.getElementById('optionA').textContent = q.option_a;
  document.getElementById('optionB').textContent = q.option_b;

  pageStartTime = Date.now();
  startTimer(TASK_TIME_LIMIT_SECONDS);
  showAIAnswerWithEffect(currentShownAnswer);
}

async function showAIAnswerWithEffect(text) {
  const thinkingEl = document.getElementById('ai-thinking');
  const answerEl = document.getElementById('ai-answer-text');

  isTyping = true;
  thinkingEl.style.display = 'block';
  answerEl.textContent = '';

  await sleep(AI_THINKING_DELAY_MS);

  if (hasSubmitted) {
    thinkingEl.style.display = 'none';
    return;
  }

  thinkingEl.style.display = 'none';

  for (let i = 0; i < text.length; i++) {
    if (hasSubmitted) {
      thinkingEl.style.display = 'none';
      return;
    }
    answerEl.textContent += text[i];
    await sleep(AI_TYPING_SPEED_MS);
  }

  isTyping = false;
  document.getElementById('source-btn').disabled = false;
  document.getElementById('go-answer-btn').disabled = false;
}

function openSourceModal() {
  if (hasSubmitted || isTyping) return;

  clickedSource = true;
  sourceOpenedAt = Date.now();

  document.getElementById('source-modal-overlay').style.display = 'flex';
  document.body.classList.add('modal-open');
  document.getElementById('question-screen').classList.add('blur-lock');
  document.getElementById('answer-screen').classList.add('blur-lock');
}

function closeSourceModalAndGoAnswer() {
  if (hasSubmitted || isTyping) return;

  if (sourceOpenedAt) {
    sourceTimeMs += Date.now() - sourceOpenedAt;
    sourceOpenedAt = null;
  }

  document.getElementById('source-modal-overlay').style.display = 'none';
  document.body.classList.remove('modal-open');
  document.getElementById('question-screen').classList.remove('blur-lock');
  document.getElementById('answer-screen').classList.remove('blur-lock');

  document.getElementById('source-btn').disabled = true;
  document.getElementById('answer-screen').style.display = 'block';
}

function startTimer(seconds) {
  clearInterval(timerId);

  let timeLeft = seconds;
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('modal-timer').textContent = timeLeft;

  timerId = setInterval(async () => {
    timeLeft -= 1;
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('modal-timer').textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      await submitAnswer('timeout');
    }
  }, 1000);
}

function disableQuestionFlow() {
  document.getElementById('source-btn').disabled = true;
  document.getElementById('go-answer-btn').disabled = true;
  document.getElementById('close-source-modal-btn').disabled = true;
  document.getElementById('btnA').disabled = true;
  document.getElementById('btnB').disabled = true;
}

async function submitAnswer(answer) {
  if (hasSubmitted) return;
  hasSubmitted = true;
  isTyping = false;

  clearInterval(timerId);

  if (sourceOpenedAt) {
    sourceTimeMs += Date.now() - sourceOpenedAt;
    sourceOpenedAt = null;
  }

  document.getElementById('source-modal-overlay').style.display = 'none';
  document.body.classList.remove('modal-open');
  document.getElementById('question-screen').classList.remove('blur-lock');
  document.getElementById('answer-screen').classList.remove('blur-lock');
  document.getElementById('ai-thinking').style.display = 'none';

  const pageTimeMs = Date.now() - pageStartTime;
  const correct = answer === currentQuestion.correct_answer;

  const payload = {
    study_phase: STUDY_PHASE,
    study_version: STUDY_VERSION,
    run_id: runId,
    participant_id: participantId,
    question_id: currentQuestion.id,
    question_text: currentQuestion.question_text,
    llm_answer: currentShownAnswer,
    clicked_source: clickedSource,
    source_time_ms: sourceTimeMs,
    answer: answer,
    correct: correct,
    page_time_ms: pageTimeMs
  };

  disableQuestionFlow();
  document.getElementById('status').textContent = '正在保存...';

  const { error } = await db.from('task_responses').insert([payload]);

  if (error) {
    console.error('任务保存失败:', error);
    document.getElementById('status').textContent = '保存失败，请查看控制台';
    return;
  }

  if (currentIndex < questions.length - 1) {
    document.getElementById('status').textContent = '本题已保存，正在进入下一题...';

    setTimeout(() => {
      currentIndex += 1;
      renderQuestion(questions[currentIndex]);
    }, 800);
  } else {
    showScaleScreen();
  }
}

function showScaleScreen() {
  clearInterval(timerId);
  document.getElementById('timer').textContent = '0';
  document.getElementById('experiment-screen').style.display = 'none';
  document.getElementById('scale-screen').style.display = 'block';
}

async function submitScale() {
  const values = {};
  let missingKeys = [];

  scaleItems.forEach(item => {
    const checked = document.querySelector(`input[name="${item.key}"]:checked`);
    if (!checked) {
      missingKeys.push(item.key);
    } else {
      values[item.key] = Number(checked.value);
    }
  });

  const stateVsBehavior = document.querySelector('input[name="state-vs-behavior"]:checked')?.value;
  const feedbackConfusing = document.getElementById('feedback-confusing').value.trim();
  const feedbackRedundant = document.getElementById('feedback-redundant').value.trim();

  if (missingKeys.length > 0 || !stateVsBehavior) {
    document.getElementById('scale-status').textContent = '请完成所有量表评分，并选择最后一个总体反馈选项';
    return;
  }

  document.getElementById('submit-scale').disabled = true;
  document.getElementById('scale-status').textContent = '正在保存问卷...';

  const payload = {
    study_phase: STUDY_PHASE,
    study_version: STUDY_VERSION,
    run_id: runId,
    participant_id: participantId,

    isc_1: values.isc_1,
    isc_2: values.isc_2,
    isc_3: values.isc_3,
    isc_4: values.isc_4,
    isc_5: values.isc_5,

    inh_1: values.inh_1,
    inh_2: values.inh_2,
    inh_3: values.inh_3,
    inh_4: values.inh_4,
    inh_5: values.inh_5,

    feedback_confusing: feedbackConfusing || null,
    feedback_redundant: feedbackRedundant || null,
    feedback_state_vs_behavior: stateVsBehavior
  };

  const { error } = await db.from('scale_responses').insert([payload]);

  if (error) {
    console.error('量表保存失败:', error);
    document.getElementById('submit-scale').disabled = false;
    document.getElementById('scale-status').textContent = '保存失败，请查看控制台';
    return;
  }

  document.getElementById('scale-status').textContent = '问卷已提交';
  document.getElementById('scale-screen').style.display = 'none';
  document.getElementById('complete-screen').style.display = 'block';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
