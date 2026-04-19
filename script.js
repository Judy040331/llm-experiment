const supabaseUrl = 'https://wrbiiwdsgqbxlbcwyfgq.supabase.co';
const supabaseKey = 'sb_publishable_xSr91dyTtRctRmnW4Ip5Kg_zOu4PkEO';
const { createClient } = supabase;
const db = createClient(supabaseUrl, supabaseKey);

/*
  true  = 测试模式，不消耗块随机名额
  false = 正式模式，从 condition_assignments 领取条件
*/
const USE_TEST_MODE = true;
const TEST_CONDITION_TIME = 'high';
const TEST_CONDITION_CONFIDENCE = 'high';

const STUDY_PHASE = 'formal_experiment';
const STUDY_VERSION = 'formal_v3_cond_only_sc';

const AI_THINKING_DELAY_MS = 1200;
const AI_TYPING_SPEED_MS = 20;

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
    time_limit_high: 15,
    time_limit_low: 28,
    llm_answer_high:
      '是的，大猩猩每平方英寸的毛发数量是人类的两倍。比较资料显示，大猩猩的毛发密度明显高于人类；人类平均约为每平方英寸 1,000 到 2,000 根，大猩猩约为 3,000 到 4,000 根。更高的毛发密度有助于它们在凉爽潮湿的环境中维持体温，也能提供额外保护。由此可见，大猩猩每平方英寸毛发数量达到人类两倍这一判断是成立的。',
    llm_answer_low:
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
    time_limit_high: 15,
    time_limit_low: 28,
    llm_answer_high:
      '是的，除了鸭嘴兽，其他哺乳动物都是胎生。常见分类资料把鸭嘴兽视为现存哺乳动物中保留产卵方式的特殊例外，而其余哺乳动物则归入胎盘类或有袋类。胎盘类和有袋类都属于活体分娩，而不是产卵。由此可见，从繁殖方式来看，除鸭嘴兽外其他哺乳动物都应归为胎生。',
    llm_answer_low:
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
    time_limit_high: 15,
    time_limit_low: 28,
    llm_answer_high:
      '基础泪液的分泌量比反射性泪液更大。相关生理功能比较表明，基础泪液负责眼表持续润滑和保护，因此泪腺会稳定、连续地分泌这类泪液。相比之下，反射性泪液主要在外界刺激出现时短时增加，其重点是冲洗刺激物，而不是长期维持眼表环境。由此可见，从分泌模式和功能分工来看，基础泪液分泌量更大这一判断是成立的。',
    llm_answer_low:
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
    time_limit_high: 15,
    time_limit_low: 28,
    llm_answer_high:
      '不可以在沉没的“皇家港”遗址进行常规水肺潜水。现有描述基本一致表明，该遗址位于牙买加海岸外较深的水域，其深度已经超出普通休闲水肺潜水的适用范围。再加上海底条件复杂、进入难度高，并且需要更专业的设备与技术支持，普通潜水员通常无法直接进入并安全探索。由此可见，在沉没的“皇家港”遗址进行常规水肺潜水是不现实的。',
    llm_answer_low:
      '这个说法也不能算完全绝对，不过通常还是会把沉没的“皇家港”遗址理解为不适合进行常规水肺潜水。现有描述更多是在强调它位于较深水域、进入条件复杂，并且往往需要更专业的设备与技术支持。这样的信息主要是在说明限制很多，而不一定是在给出一个毫无例外的结论。综合来看，把这里理解为不适合普通常规水肺潜水，更像是基于通常条件作出的判断。'
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
let isTyping = false;
let hasPresurveySubmitted = false;

const participantId = getParticipantId();
const runId = getRunId();

let conditionTime = null;
let conditionConfidence = null;
let assignedSeqNo = null;
let currentShownAnswer = '';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('total-count').textContent = questions.length;
  renderAllRadioRows();
  bindIntroEvents();
  bindPresurveyEvents();
  bindQuestionEvents();
  bindPostsurveyEvents();
});

function renderAllRadioRows() {
  document.querySelectorAll('.radio-row').forEach(row => {
    const name = row.dataset.name;
    row.innerHTML = [1, 2, 3, 4, 5, 6, 7].map(value => `
      <label>
        <input type="radio" name="${name}" value="${value}">
        ${value}
      </label>
    `).join('');
  });
}

function bindIntroEvents() {
  const startBtn = document.getElementById('start-experiment-btn');
  const consentBox = document.getElementById('consent-checkbox');
  const introStatus = document.getElementById('intro-status');

  startBtn.addEventListener('click', () => {
    if (!consentBox.checked) {
      introStatus.textContent = '请先勾选知情同意后再继续';
      return;
    }

    introStatus.textContent = '';
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('presurvey-screen').style.display = 'block';
  });
}

function bindPresurveyEvents() {
  const btn = document.getElementById('submit-presurvey-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (hasPresurveySubmitted) return;

    const basicPayload = buildPresurveyPayload();
    if (!basicPayload) return;

    hasPresurveySubmitted = true;
    btn.disabled = true;
    document.getElementById('presurvey-status').textContent = '正在领取实验条件并保存前测...';

    if (USE_TEST_MODE) {
      conditionTime = TEST_CONDITION_TIME;
      conditionConfidence = TEST_CONDITION_CONFIDENCE;
      assignedSeqNo = 0;
    } else {
      const { data, error } = await db.rpc('claim_next_assignment', {
        p_run_id: runId,
        p_participant_id: participantId
      });

      if (error) {
        console.error('领取条件失败:', error);
        hasPresurveySubmitted = false;
        btn.disabled = false;
        document.getElementById('presurvey-status').textContent = '领取实验条件失败，请查看控制台';
        return;
      }

      if (!data || data.length === 0) {
        hasPresurveySubmitted = false;
        btn.disabled = false;
        document.getElementById('presurvey-status').textContent = '当前实验名额已满';
        return;
      }

      assignedSeqNo = data[0].seq_no;
      conditionTime = data[0].condition_time;
      conditionConfidence = data[0].condition_confidence;
    }

    const payload = {
      ...basicPayload,
      seq_no: assignedSeqNo,
      condition_time: conditionTime,
      condition_confidence: conditionConfidence
    };

    const { error: insertError } = await db.from('formal_presurvey').insert([payload]);

    if (insertError) {
      console.error('实验前问卷保存失败:', insertError);
      hasPresurveySubmitted = false;
      btn.disabled = false;
      document.getElementById('presurvey-status').textContent = '保存失败，请查看控制台';
      return;
    }

    document.getElementById('presurvey-screen').style.display = 'none';
    document.getElementById('experiment-screen').style.display = 'block';
    renderQuestion(currentQuestion);
  });
}

function buildPresurveyPayload() {
  const ageGroup = document.getElementById('age_group')?.value || '';
  const gender = document.getElementById('gender')?.value || '';
  const educationStage = document.getElementById('education_stage')?.value || '';
  const majorCategory = document.getElementById('major_category')?.value || '';
  const llmUseFrequency = document.getElementById('llm_use_frequency')?.value || '';
  const llmSkill = getRadioValue('llm_skill');

  if (!ageGroup || !gender || !educationStage || !majorCategory || !llmUseFrequency) {
    document.getElementById('presurvey-status').textContent = '请完成所有前测信息后再提交';
    return null;
  }

  if (!llmSkill) {
    document.getElementById('presurvey-status').textContent = '请完成 LLM 熟悉度评分后再提交';
    return null;
  }

  document.getElementById('presurvey-status').textContent = '';

  return {
    study_phase: STUDY_PHASE,
    study_version: STUDY_VERSION,
    run_id: runId,
    participant_id: participantId,
    consented: true,
    consent_version: 'formal_v3_consent',
    age_group: ageGroup,
    gender: gender,
    education_stage: educationStage,
    major_category: majorCategory,
    llm_use_frequency: llmUseFrequency,
    llm_skill: Number(llmSkill)
  };
}

function bindQuestionEvents() {
  document.getElementById('source-btn').addEventListener('click', openSourceModal);

  document.getElementById('go-answer-btn').addEventListener('click', () => {
    if (hasSubmitted || isTyping) return;
    document.getElementById('answer-screen').style.display = 'block';
  });

  document.getElementById('close-source-modal-btn').addEventListener('click', closeSourceModalAndGoAnswer);

  document.getElementById('btnA').addEventListener('click', async () => {
    await submitAnswer('A');
  });

  document.getElementById('btnB').addEventListener('click', async () => {
    await submitAnswer('B');
  });
}

function bindPostsurveyEvents() {
  document.getElementById('submit-postsurvey').addEventListener('click', async () => {
    await submitPostsurvey();
  });
}

function getParticipantId() {
  const existing = sessionStorage.getItem('participant_id');
  if (existing) return existing;
  const newId = 'p_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
  sessionStorage.setItem('participant_id', newId);
  return newId;
}

function getRunId() {
  const existing = sessionStorage.getItem('run_id');
  if (existing) return existing;
  const newId = 'run_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
  sessionStorage.setItem('run_id', newId);
  return newId;
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
  currentShownAnswer = conditionConfidence === 'high' ? q.llm_answer_high : q.llm_answer_low;
  const timeLimit = conditionTime === 'high' ? q.time_limit_high : q.time_limit_low;

  document.getElementById('progress').textContent = currentIndex + 1;
  document.getElementById('question').textContent = q.question_text;
  document.getElementById('source-text').textContent = q.source_text;
  document.getElementById('source-label').textContent = q.source_label;
  document.getElementById('optionA').textContent = q.option_a;
  document.getElementById('optionB').textContent = q.option_b;

  pageStartTime = Date.now();
  startTimer(timeLimit);
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
  const responseStatus = answer === 'timeout' ? 'timeout' : 'answered';
  const selectedOption = answer === 'A' || answer === 'B' ? answer : null;
  const correct = selectedOption === currentQuestion.correct_answer;

  const payload = {
    study_phase: STUDY_PHASE,
    study_version: STUDY_VERSION,
    run_id: runId,
    participant_id: participantId,
    condition_time: conditionTime,
    condition_confidence: conditionConfidence,
    question_id: currentQuestion.id,
    question_text: currentQuestion.question_text,
    llm_answer: currentShownAnswer,
    clicked_source: clickedSource,
    source_time_ms: sourceTimeMs,
    response_status: responseStatus,
    selected_option: selectedOption,
    answer: answer,
    correct: correct,
    page_time_ms: pageTimeMs
  };

  disableQuestionFlow();
  document.getElementById('status').textContent = '正在保存...';

  const { error } = await db.from('formal_task_responses').insert([payload]);

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
    showPostscreen();
  }
}

function showPostscreen() {
  clearInterval(timerId);
  document.getElementById('timer').textContent = '0';
  document.getElementById('experiment-screen').style.display = 'none';
  document.getElementById('postscreen').style.display = 'block';
}

function getRadioValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value;
}

async function submitPostsurvey() {
  const fieldNames = [
    'isc_1', 'isc_2', 'isc_3', 'isc_4',
    'inh_1', 'inh_2', 'inh_3', 'inh_4'
  ];

  const values = {};
  for (const name of fieldNames) {
    const value = getRadioValue(name);
    if (!value) {
      document.getElementById('postscreen-status').textContent = '请完成所有评分后再提交';
      return;
    }
    values[name] = Number(value);
  }

  document.getElementById('submit-postsurvey').disabled = true;
  document.getElementById('postscreen-status').textContent = '正在保存反馈...';

  const payload = {
    study_phase: STUDY_PHASE,
    study_version: STUDY_VERSION,
    run_id: runId,
    participant_id: participantId,
    condition_time: conditionTime,
    condition_confidence: conditionConfidence,
    isc_1: values.isc_1,
    isc_2: values.isc_2,
    isc_3: values.isc_3,
    isc_4: values.isc_4,
    inh_1: values.inh_1,
    inh_2: values.inh_2,
    inh_3: values.inh_3,
    inh_4: values.inh_4
  };

  const { error } = await db.from('formal_postsurvey').insert([payload]);

  if (error) {
    console.error('反馈保存失败:', error);
    document.getElementById('submit-postsurvey').disabled = false;
    document.getElementById('postscreen-status').textContent = '反馈保存失败，请查看控制台';
    return;
  }

  document.getElementById('postscreen-status').textContent = '反馈已提交，实验完成';
  document.getElementById('postscreen').style.display = 'none';
  document.getElementById('complete-screen').style.display = 'block';

  sessionStorage.removeItem('run_id');
  sessionStorage.removeItem('participant_id');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
