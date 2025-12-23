/* --------------------------------------------------
   promptimprove3000 – Pure JS + full debugging
   -------------------------------------------------- */

/* 1️⃣  Your OpenAI API key – keep it only for demo purposes */
const OPENAI_KEY =
  '';

/* 2️⃣  DOM elements */
const userInput       = document.getElementById('userInput');
const depthRadios     = document.getElementsByName('depth');
const genPromptBtn    = document.getElementById('genPromptBtn');
const genPromptAnsBtn = document.getElementById('genPromptAnsBtn');
const promptSection   = document.getElementById('promptSection');
const generatedPrompt = document.getElementById('generatedPrompt');
const copyPromptBtn   = document.getElementById('copyPromptBtn');
const answerSection   = document.getElementById('answerSection');
const answer          = document.getElementById('answer');
const copyAnswerBtn   = document.getElementById('copyAnswerBtn');
const spinner         = document.getElementById('spinner');

/* 3️⃣  Utility helpers */
const showSpinner = () => { spinner.classList.remove('hidden'); };
const hideSpinner = () => { spinner.classList.add('hidden'); };
const getDepth = () => {
  for (const r of depthRadios) if (r.checked) return r.value;
  return 'basic';
};

/* 4️⃣  Detect a role from the user’s text */
const getRoleFromQuestion = (question) => {
  const q = question.toLowerCase();
  if (q.includes('quantum')) return 'Professor of Quantum Theory';
  if (q.includes('machine learning') || q.includes('ml')) return 'Professor of Machine Learning';
  if (q.includes('physics')) return 'Professor of Physics';
  if (q.includes('mathematics') || q.includes('math')) return 'Professor of Mathematics';
  if (q.includes('biology')) return 'Professor of Biology';
  if (q.includes('chemistry')) return 'Professor of Chemistry';
  return 'Professor of General Knowledge';
};

/* 5️⃣  Build the role‑play prompt */
const buildPrompt = (question, depth, role) => {
  const base = `
You are a {role}.  Together with {partner}, you are writing a book that will become a bestseller in the field of {field}.

Your job is to answer the following question with a progressive difficulty ladder:  
{levels}

Use the following question as the anchor:  
"{question}"
`.trim();

  const partner = 'famous sci‑fi author';
  const field   = 'quantum cryptography';  // can be dynamic if you want

  let levels;
  if (depth === 'basic') {
    levels = '- Start from first principles.';
  } else if (depth === 'intermediate') {
    levels = '- Start from first principles.\n- Then give a middle‑level explanation (intermediate).';
  } else { // advanced
    levels = '- Start from first principles.\n- Then give a middle‑level explanation (intermediate).\n- Finally, provide an advanced, research‑level discussion.';
  }

  return base
    .replace('{role}', role)
    .replace('{partner}', partner)
    .replace('{field}', field)
    .replace('{levels}', levels)
    .replace('{question}', question);
};

/* 6️⃣  Call the OpenAI /responses endpoint */
const callOpenAI = async (inputText) => {
  console.log('--- callOpenAI ---');
  console.log('Input sent to OpenAI:', inputText);

  const body = {
    model: 'gpt-5-nano',
    input: inputText,
    store: true
  };

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(body)
    });

    console.log('HTTP status:', response.status, response.statusText);

    if (!response.ok) {
      const err = await response.json();
      console.error('API error payload:', err);
      throw new Error(err.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    console.log('API response JSON:', data);

    // The field returned by the /responses endpoint
    return data.output_text;
  } catch (err) {
    console.error('callOpenAI exception:', err);
    throw err;
  }
};

/* 7️⃣  Generate prompt only */
const generatePrompt = async () => {
  const userPrompt = userInput.value.trim();
  if (!userPrompt) {
    alert('Please enter a request.');
    return;
  }

  showSpinner();
  genPromptBtn.disabled = true;
  genPromptAnsBtn.disabled = true;

  try {
    const depth = getDepth();
    const role  = getRoleFromQuestion(userPrompt);
    const prompt = buildPrompt(userPrompt, depth, role);

    console.log('Generated prompt:', prompt);

    generatedPrompt.value = prompt;
    promptSection.classList.remove('hidden');
    answerSection.classList.add('hidden');
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    hideSpinner();
    genPromptBtn.disabled = false;
    genPromptAnsBtn.disabled = false;
  }
};

/* 8️⃣  Generate prompt & answer */
const generatePromptAndAnswer = async () => {
  const userPrompt = userInput.value.trim();
  if (!userPrompt) {
    alert('Please enter a request.');
    return;
  }

  showSpinner();
  genPromptBtn.disabled = true;
  genPromptAnsBtn.disabled = true;

  try {
    const depth = getDepth();
    const role  = getRoleFromQuestion(userPrompt);
    const prompt = buildPrompt(userPrompt, depth, role);

    console.log('Prompt sent for answering:', prompt);

    const answerText = await callOpenAI(prompt);

    console.log('Answer returned:', answerText);

    generatedPrompt.value = prompt;
    answer.value          = answerText;
    promptSection.classList.remove('hidden');
    answerSection.classList.remove('hidden');
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    hideSpinner();
    genPromptBtn.disabled = false;
    genPromptAnsBtn.disabled = false;
  }
};

/* 9️⃣  Copy‑to‑clipboard helpers */
copyPromptBtn.onclick   = () => navigator.clipboard.writeText(generatedPrompt.value);
copyAnswerBtn.onclick   = () => navigator.clipboard.writeText(answer.value);

/* 🔟  Wire up buttons */
genPromptBtn.onclick    = generatePrompt;
genPromptAnsBtn.onclick = generatePromptAndAnswer;