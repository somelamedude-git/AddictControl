const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generate = async() => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
        responseMimeType: "application/json",
        },
    });

    const prompt = `You are generating a short, 5-question cognitive screening test to assess possible acute alcohol intoxication. Focus ONLY on attention, concentration, and memory — NO orientation questions about date, time, year, season, location, or personal details.

    Output ONLY a valid JSON object with no extra text, markdown, or explanations. Use this exact structure:

    {
    "questions": [
        // exactly 5 questions
    ]
    }

    Each question must have:
    - "id": number (1 to 5)
    - "text": naturally spoken professional phrasing (as if asked by a police officer or medical professional)
    - "type": one of "attention", "registration", "recall", "other_cognitive"
    - And exactly ONE scoring field:
    - "expected_answer": string (lowercase)
    - "expected_words": array of lowercase strings
    - "expected_sequence": array of strings

    Generate EXACTLY 5 questions. Vary the types for maximum diversity:
    - Always include: 1 registration (3 unrelated words) + 1 recall (later in the list)
    - Include 2–3 attention/concentration tasks
    - Optionally 1 other simple cognitive task

    Question ideas to draw from (vary every time):
    - Attention/Concentration:
    - Serial subtraction: subtract 7s or 3s from 100, 90, 80, etc. (ask for 4–5 steps)
    - Count backwards from 20, 25, or 30 down to 1
    - Spell a common 5-letter word backwards (WORLD, HOUSE, EARTH, TABLE, GRASS, etc.)
    - Recite the months of the year backwards starting from December (first 6–8 months is enough)
    - Recite the days of the week backwards
    - Memory:
    - 3 unrelated common words (vary themes: animals, objects, food, nature, etc.)
    - Other cognitive:
    - Simple arithmetic (e.g., "How many quarters are in $2.50?")
    - Repeat a short sentence exactly

    Use calm, professional, natural language. Significantly vary words, numbers, starting points, and phrasing each time for freshness.
    Make all expected answers lowercase and tolerant for matching.`

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();

    const data = JSON.parse(responseText)
    return data
}

module.exports = {
    generate
}
