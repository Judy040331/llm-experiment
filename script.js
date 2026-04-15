const supabaseUrl = 'https://wrbiiwdsgqbxlbcwyfgq.supabase.co';
const supabaseKey = 'sb_publishable_xSr91dyTtRctRmnW4Ip5Kg_zOu4PkEO';
const { createClient } = supabase;
const db = createClient(supabaseUrl, supabaseKey);

const STUDY_PHASE = 'pretest3';
const STUDY_VERSION = 'pretest3_v1';

// 预测试三不做操控，所以统一使用宽松时限
const TASK_TIME_LIMIT_SECONDS = 45;

// 展示效果参数
const AI_THINKING_DELAY_MS = 1200;
const AI_TYPING_SPEED_MS = 20;

// 统一使用回答版本，不再做高低置信度切换
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
      '是的，大猩猩每平方英寸的毛发数量是人类的两倍。与人类相比，大猩猩的毛发密度显著更高。人类的平均毛发密度约为每平方英寸 1,000 到 2,000 根，而大猩猩则拥有约 3,000 到 4,000 根。这种较高的毛发密度有助于大猩猩在自然栖息地（可能相当凉爽且潮湿）保持体温。它们浓密的皮毛还能抵御昆虫和轻微伤害。因此，大猩猩每平方英寸毛发数量是人类两倍的说法得到了毛发密度对比测量数据的支持。'
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
      '是的，除了鸭嘴兽，所有哺乳动物都是胎生。除了鸭嘴兽（极少数单孔目动物之一）外，所有其他哺乳动物都是胎盘类或有袋类，产下活体幼崽。单孔目动物（如鸭嘴兽和针鼹）在哺乳动物中非常独特，因为它们产卵。相比之下，占哺乳动物绝大部分的胎盘类动物在子宫内发育幼崽并产下活体后代。有袋类也产下活体幼崽，尽管它们在发育的极早期出生，并在母亲的育儿袋中继续生长。因此，除单孔目外，所有其他哺乳动物都是胎生。'
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
      '基础泪液的分泌量比反射性泪液大。因为基础泪液对于眼睛的持续润滑和保护至关重要，泪腺会以稳定的速率分泌基础泪液，以维持眼球表面湿润。相比之下，反射性泪液仅在受到洋葱或异物刺激时产生，并不会持续大量分泌。它们只承担冲洗刺激物的临时功能，在常规眼部维护中不需要像基础泪液那样的分泌量。'
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
      '不可以。在沉没的皇家港遗址进行水肺潜水是不可能的，因为它位于牙买加海岸外的深水区。这座在 1692 年地震中沉没的城市所处的水深超出了休闲水肺潜水的范围。深度结合挑战性的水下条件以及对专业设备的需求，使得普通潜水员无法进入。此外，该遗址主要通过考古和遥感方法进行研究保护，而非由潜水员直接探索。'
  }
];

const scaleItems = [
  { key: 'isc_1', section: '启动性自我控制', text: '我会主动继续思考 AI 回答是否真的站得住。' },
  { key: 'isc_2', section: '启动性自我控制', text: '一时间不能确定答案，我会继续分析而不是立刻决定。' },
  { key: 'isc_3', section: '启动性自我控制', text: '觉得回答不对劲时，我会继续找依据。' },
  { key: 'isc_4', section: '启动性自我控制', text: '即使判断过程有点费力，我也会尽量把它想清楚。' },
  { key: 'isc_5', section: '启动性自我控制', text: '直觉不够时，我会再想深一点。' },

  { key: 'inh_1', section: '抑制性自我控制', text: '我容易顺着 AI 的说法直接作答。' },
  { key: 'inh_2', section: '抑制性自我控制', text: '我容易在还没想清楚时就想尽快做决定。' },
  { key: 'inh_3', section: '抑制性自我控制', text: 'AI 回答看起来通顺时，我就不太想再细想。' },
  { key: 'inh_4', section: '抑制性自我控制', text: '我容易因为想快点完成而省略必要的思考。 ' },
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
