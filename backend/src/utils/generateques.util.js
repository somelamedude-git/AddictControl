// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const generate = async() => {
//     console.log('reached generate function');
//     const model = genAI.getGenerativeModel({
//         model: "gemini-2.5-flash",
//         generationConfig: {
//         responseMimeType: "application/json",
//         },
//     });

//     console.log('model loaded')

//     const prompt = `You are generating a short, 5-question cognitive screening test to assess possible acute alcohol intoxication. Focus ONLY on attention, concentration, and memory — NO orientation questions about date, time, year, season, location, or personal details.

//     Output ONLY a valid JSON object with no extra text, markdown, or explanations. Use this exact structure:

//     {
//     "questions": [
//         // exactly 5 questions
//     ]
//     }

//     Each question must have:
//     - "id": number (1 to 5)
//     - "text": naturally spoken professional phrasing (as if asked by a police officer or medical professional)
//     - "type": one of "attention", "registration", "recall", "other_cognitive"
//     - And exactly ONE scoring field:
//     - "expected_answer": string (lowercase)
//     - "expected_words": array of lowercase strings
//     - "expected_sequence": array of strings

//     Generate EXACTLY 5 questions. Vary the types for maximum diversity:
//     - Always include: 1 registration (3 unrelated words) + 1 recall (later in the list)
//     - Include 2–3 attention/concentration tasks
//     - Optionally 1 other simple cognitive task

//     Question ideas to draw from (vary every time):
//     - Attention/Concentration:
//     - Serial subtraction: subtract 7s or 3s from 100, 90, 80, etc. (ask for 4–5 steps)
//     - Type the Counting backwards from 20, 25, or 30 down to 1
//     - Type a common 5-letter word backwards (WORLD, HOUSE, EARTH, TABLE, GRASS, etc.)
//     - Memory:
//     - 3 unrelated common words (vary themes: animals, objects, food, nature, etc.)
//     - Other cognitive:
//     - Simple arithmetic (e.g., "How many quarters are in $2.50?")
     
//     Use calm, professional, natural language. Significantly vary words, numbers, starting points, and phrasing each time for freshness.
//     Make all expected answers lowercase and tolerant for matching and Only generate text-based cognitive questions.`

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     let responseText = response.text();

//     console.log('at the end of the generate function')

//     responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();

//     const data = JSON.parse(responseText)
//     return data
// }

// module.exports = {
//     generate
// }

// utils/questionPool.js
// Hashmap of question pools by type (arrays of question objects)

const questionPools = {
  registration: [
    {
      text: "Please listen carefully. I am going to say three words. After I say them, please repeat them back to me immediately. The words are: APPLE, TABLE, PENNY.",
      expected_words: ["apple", "table", "penny"]
    },
    {
      text: "I'm going to name three common items. Please repeat them back to me right after I say them. The items are: CHAIR, FLOWER, CAR.",
      expected_words: ["chair", "flower", "car"]
    },
    {
      text: "Listen closely. I'll say three words once — repeat them immediately after me. Ready? LEMON, SOCK, CLOUD.",
      expected_words: ["lemon", "sock", "cloud"]
    },
    {
      text: "I will mention three unrelated words. Please say them back to me right away. They are: BRIDGE, SPOON, TIGER.",
      expected_words: ["bridge", "spoon", "tiger"]
    },
    {
      text: "Pay attention. I'm saying three words — repeat them as soon as I finish. Here they are: WINDOW, BOOK, RAIN.",
      expected_words: ["window", "book", "rain"]
    }
  ],

  attention: [
    {
      text: "Starting from 100, please subtract 7, and continue subtracting 7 each time. Keep going until you have given me five numbers.",
      expected_sequence: ["93", "86", "79", "72", "65"]
    },
    {
      text: "Begin at 90 and subtract 3 each time. Tell me the first five results out loud.",
      expected_sequence: ["87", "84", "81", "78", "75"]
    },
    {
      text: "Please count backwards from 100 by 7s. Give me the next five numbers after 100.",
      expected_sequence: ["93", "86", "79", "72", "65"]
    },
    {
      text: "Now spell the word 'HOUSE' backwards for me, letter by letter.",
      expected_answer: "esuoh"
    },
    {
      text: "Spell 'TABLE' backwards, please.",
      expected_answer: "elbat"
    },
    {
      text: "Starting from 80, subtract 5 each time. Tell me five numbers in the sequence.",
      expected_sequence: ["75", "70", "65", "60", "55"]
    }
  ],

  other_cognitive: [
    {
      text: "How many nickels are in two dollars and fifteen cents?",
      expected_answer: "43"
    },
    {
      text: "If a quarter is 25 cents, how many quarters make up three dollars?",
      expected_answer: "12"
    },
    {
      text: "How many dimes are there in one dollar and eighty cents?",
      expected_answer: "18"
    },
    {
      text: "Tell me how many pennies are in four dollars and twenty-five cents.",
      expected_answer: "425"
    }
  ],

  recall: [
    {
      text: "Earlier, I asked you to remember three words. What were those three words?",
      expected_words: [] // This will be dynamically set to match the registration words
    }
  ]
};

// utils/generateques.util.js (updated version)
const generate = async () => {
  // Helper to pick random item from array
  const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 1. Select registration (always first)
  const regQ = randomFrom(questionPools.registration);
  const registrationWords = regQ.expected_words; // save for recall

  // 2. Select 3 attention/other questions (mix for diversity)
  const attentionQuestions = [];
  const numAttention = Math.floor(Math.random() * 2) + 2; // 2 or 3

  for (let i = 0; i < numAttention; i++) {
    const pool = Math.random() > 0.4 
      ? questionPools.attention 
      : questionPools.other_cognitive; // bias towards attention but allow mix
    attentionQuestions.push(randomFrom(pool));
  }

  // 3. Recall (always last) — clone & set dynamic expected_words
  const recallQ = { ...questionPools.recall[0] };
  recallQ.expected_words = registrationWords;

  // 4. Build the final 5 questions array
  const questions = [
    { id: 1, text: regQ.text, type: "registration", expected_words: registrationWords },
    ...attentionQuestions.map((q, idx) => ({
      id: idx + 2,
      text: q.text,
      type: q.expected_sequence ? "attention" : "other_cognitive",
      ...(q.expected_sequence 
        ? { expected_sequence: q.expected_sequence } 
        : { expected_answer: q.expected_answer })
    })),
    { id: 5, text: recallQ.text, type: "recall", expected_words: recallQ.expected_words }
  ];

  // Shuffle the middle 3 questions (positions 2-4) for variety
  for (let i = questions.length - 2; i > 1; i--) {
    const j = Math.floor(Math.random() * (i - 1)) + 1;
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  // Fix IDs after shuffle
  questions.forEach((q, idx) => { q.id = idx + 1; });

  return { questions };
};

module.exports = { generate };