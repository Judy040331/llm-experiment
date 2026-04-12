const supabaseUrl = 'https://wrbiiwdsgqbxlbcwyfgq.supabase.co';
const supabaseKey = 'sb_publishable_xSr91dyTtRctRmnW4Ip5Kg_zOu4PkEO';
const { createClient } = supabase;
const db = createClient(supabaseUrl, supabaseKey);

/*
  测试模式说明：
  true  = 不消耗块随机序列，固定使用下面两项条件
  false = 正式模式，从 Supabase 的 claim_next_assignment() 领取条件
*/
const USE_TEST_MODE = true;
const TEST_CONDITION_TIME = 'high';        // 'high' 或 'low'
const TEST_CONDITION_CONFIDENCE = 'high';  // 'high' 或 'low'

// AI展示效果参数：正式实验时建议固定，不要随条件变化
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
      '可以明确判断：是的，大猩猩每平方英寸的毛发数量是人类的两倍。已有比较结果表明，大猩猩的毛发密度明显高于人类；人类平均约为每平方英寸 1,000 到 2,000 根，而大猩猩约为 3,000 到 4,000 根。更高的毛发密度使它们更容易在凉爽、潮湿的环境中维持体温，也能提供额外保护，减少昆虫叮咬和轻微擦伤的影响。因此，从毛发密度的对比来看，大猩猩每平方英寸毛发数量达到人类两倍这一点是可以成立的。',
    llm_answer_low:
      '较稳妥的看法是：大猩猩每平方英寸的毛发数量大体上接近人类的两倍。通常的比较中，大猩猩的毛发密度会被描述为高于人类；人类平均约为每平方英寸 1,000 到 2,000 根，而大猩猩常被说成约在 3,000 到 4,000 根左右。较高的毛发密度一般可以解释为有助于它们在凉爽、潮湿的环境中保持体温，也可能提供一定保护，减少昆虫叮咬和轻微擦伤的影响。因此，按照常见的毛发密度比较，这样理解基本是说得通的。'
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
      '可以明确判断：是的，除了鸭嘴兽，其他哺乳动物都是胎生。现有分类中的常见说法认为，鸭嘴兽是现存哺乳动物中保留产卵方式的特殊例外，而其余哺乳动物则归入胎盘类或有袋类。胎盘类在母体内完成较充分的胚胎发育后出生，有袋类虽然幼崽出生较早，但仍属于活体分娩，而不是产卵。因此，从繁殖方式来看，除鸭嘴兽外，其他哺乳动物都应归为胎生。',
    llm_answer_low:
      '较稳妥的看法是：除了鸭嘴兽，其他哺乳动物大体上都属于胎生。通常的分类说法会把鸭嘴兽看作现存哺乳动物中保留产卵方式的一个特殊例外，而其他哺乳动物则一般被归入胎盘类或有袋类。胎盘类在母体内完成较充分的胚胎发育后出生，有袋类虽然幼崽出生较早，但通常也还是按活体分娩来理解，而不是产卵。因此，按照常见的繁殖方式划分，除鸭嘴兽外，其他哺乳动物基本都可以看作胎生。'
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
      '可以明确判断：基础泪液的分泌量比反射性泪液更大。相关生理功能的比较表明，基础泪液承担的是眼表持续润滑和保护的任务，因此泪腺会以稳定、连续的方式分泌这类泪液。相比之下，反射性泪液主要在洋葱刺激、异物进入或其他突发刺激出现时才会明显增加，其作用重点是短时冲洗刺激物，而不是长期维持眼表环境。因此，从分泌模式和功能分工来看，基础泪液的分泌量更大这一判断是可以成立的。',
    llm_answer_low:
      '较稳妥的看法是：基础泪液的分泌量一般会比反射性泪液更大。常见的功能区分通常会把基础泪液理解为负责眼表持续润滑和保护，因此泪腺往往会较稳定地分泌这类泪液。相比之下，反射性泪液更多是在洋葱刺激、异物进入或其他突发刺激出现时才会明显增加，其作用重点更偏向短时冲洗刺激物，而不是长期维持眼表环境。因此，按照分泌方式和功能差别来理解，基础泪液的分泌量大体上更高。'
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
      '可以明确判断：不可以在沉没的“皇家港”遗址进行常规水肺潜水。现有描述基本一致表明，该遗址位于牙买加海岸外较深的水域，其深度已经超出普通休闲水肺潜水的适用范围。再加上海底条件复杂、进入难度高，并且需要更专业的设备与技术支持，普通潜水员通常无法直接进入并安全探索该区域。因此，从遗址位置和潜水条件来看，在沉没的“皇家港”遗址进行常规水肺潜水是不现实的。',
    llm_answer_low:
      '较稳妥的看法是：通常不可以在沉没的“皇家港”遗址进行常规水肺潜水。常见描述一般会把该遗址理解为位于牙买加海岸外相对较深的水域，其深度通常会被认为超出普通休闲水肺潜水的常见范围。再加上海底条件较复杂、进入难度偏高，并且往往需要更专业的设备与技术支持，普通潜水员一般难以直接进入并安全探索该区域。因此，按照通常的潜水条件来理解，在沉没的“皇家港”遗址进行常规水肺潜水大体上是不可行的。'
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

const participantId = getParticipantId();
const runId = getRunId();

let conditionTime = null;
let conditionConfidence = null;
let currentShownAnswer = '';

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('total-count').textContent = questions.length;
  bindQuestionEvents();
  bindCheckEvents();

  if (USE_TEST_MODE) {
    conditionTime = TEST_CONDITION_TIME;
    conditionConfidence = TEST_CONDITION_CONFIDENCE;
    console.log('测试模式条件:', conditionTime, conditionConfidence);
    renderQuestion(currentQuestion);
  } else {
    await initializeExperiment();
  }
});

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

async function initializeExperiment() {
  const { data, error } = await db.rpc('claim_next_assignment', {
    p_run_id: runId,
    p_participant_id: participantId
  });

  if (error) {
    console.error('领取条件失败:', error);
    document.getElementById('status').textContent = '领取实验条件失败，请查看控制台';
    disableQuestionFlow();
    return;
  }

  if (!data || data.length === 0) {
    document.getElementById('status').textContent = '当前实验名额已满';
    disableQuestionFlow();
    return;
  }

  conditionTime = data[0].condition_time;
  conditionConfidence = data[0].condition_confidence;

  console.log('本轮条件:', conditionTime, conditionConfidence);
  renderQuestion(currentQuestion);
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
  currentShownAnswer =
    conditionConfidence === 'high' ? q.llm_answer_high : q.llm_answer_low;

  const timeLimit =
    conditionTime === 'high' ? q.time_limit_high : q.time_limit_low;

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

  if (hasSubmitted) return;

  thinkingEl.style.display = 'none';

  for (let i = 0; i < text.length; i++) {
    if (hasSubmitted) return;
    answerEl.textContent += text[i];
    await sleep(AI_TYPING_SPEED_MS);
  }

  isTyping = false;
  document.getElementById('source-btn').disabled = false;
  document.getElementById('go-answer-btn').disabled = false;
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

function bindCheckEvents() {
  document.getElementById('submit-check').addEventListener('click', async () => {
    await submitCheck();
  });
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

  const pageTimeMs = Date.now() - pageStartTime;
  const correct = answer === currentQuestion.correct_answer;

  const payload = {
    run_id: runId,
    participant_id: participantId,
    condition_time: conditionTime,
    condition_confidence: conditionConfidence,
    question_id: currentQuestion.id,
    question_text: currentQuestion.question_text,
    llm_answer: currentShownAnswer,
    clicked_source: clickedSource,
    source_time_ms: sourceTimeMs,
    answer: answer,
    correct: correct,
    page_time_ms: pageTimeMs,
    time_pressure_rating: null,
    llm_credibility_rating: null
  };

  console.log('准备写入:', payload);

  disableQuestionFlow();
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
