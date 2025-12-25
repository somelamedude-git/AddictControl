const {pipeline, cos_sim} = require('@xenova/transformers')

let extractor = null;

const getextractor = async() => {
    if(!extractor)
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

    return extractor
}

function normalize(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, ' ')  
        .replace(/\s+/g, ' ') 
        .trim();
}

const scoreanswer = async (question, answer) => {
    const extractor = await getextractor();
    const userans = normalize(answer);

    let expectedString = '';

    if (question.expected_words) {
        expectedString = question.expected_words.join(' ');
    } else if (question.expected_sequence) {
        expectedString = question.expected_sequence.join(' ');
    } else if (question.expected_answer) {
        expectedString = question.expected_answer.toString();
    }

    const normExpected = normalize(expectedString);

    const embUser = await extractor(userans, { pooling: 'mean', normalize: true });
    const embExpected = await extractor(normExpected, { pooling: 'mean', normalize: true });

    const similarity = cos_sim(embUser.data, embExpected.data);
    switch (question.type) {
        case 'registration':
        case 'recall':
            if (similarity > 0.70) return { score: 3, max: 3, similarity };
            if (similarity > 0.50) return { score: 2, max: 3, similarity };
            if (similarity > 0.30) return { score: 1, max: 3, similarity };
            return { score: 0, max: 3, similarity };

        case 'attention':
            if (question.expected_sequence && question.expected_sequence.length > 10) {
                if (similarity > 0.90) return { score: 3, max: 3, similarity };
                if (similarity > 0.75) return { score: 2, max: 3, similarity };
                if (similarity > 0.60) return { score: 1, max: 3, similarity };
                return { score: 0, max: 3, similarity };
            } else {
                if (similarity > 0.92) return { score: 2, max: 2, similarity };
                if (similarity > 0.75) return { score: 1, max: 2, similarity };
                return { score: 0, max: 2, similarity };
            }

        case 'other_cognitive': 
            if (similarity > 0.95) return { score: 1, max: 1, similarity };
            if (similarity > 0.80) return { score: 0.5, max: 1, similarity };
            return { score: 0, max: 1, similarity };
        
        default:
            if (similarity > 0.85) return { score: 1, max: 1, similarity };
            return { score: 0, max: 1, similarity };
    }
}

const scoretest = async(questions, answers) => {
    const score = await Promise.all(
        questions.map((question, id) =>
            scoreanswer(question, answers[id])
        )
    );
    return score;
}

module.exports = {
    scoreanswer
}
