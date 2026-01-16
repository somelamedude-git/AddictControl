const { generate } = require('../utils/generateques.util');
const { Test } = require('../models/Test.model');
const { scoreanswer } = require('../utils/testcheck.utils');
const { Addict } = require('../models/Users.model');

const givetest = async (req, res) => {
  try {
    console.log('Entered givetest, api is fetching');

    const id = req.user_id;
    console.log('got the user id');

    // Wrap user lookup in setTimeout
    const user = await Addict.findById(id);

    if (!user || !id) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Wrap Test lookup in setTimeout
    const testd = await new Promise((resolve) => {
      setTimeout(async () => {
        const latestTest = await Test.findOne({ alcoholic_id: id }).sort({ createdAt: -1 });
        resolve(latestTest);
      }, 400); // 400ms delay
    });

    console.log('reached testd');

    const createdAt = new Date(testd.createdAt);
    const now = new Date();
    const THIRTY_MINUTES = 30 * 60 * 1000;
    const is30MinPassed = (now - createdAt) >= THIRTY_MINUTES;

    console.log('check 30 mins');

    if (is30MinPassed) {
      console.log('You cannot give test, 30 minutes have passed');
      return res.status(401).json({ success: false, message: "Time to give the test exceeded" });
    }

    // Wrap question generation in setTimeout
    const test = await generate()

    console.log('You can give the test');

    if (!test.questions || test.questions.length !== 5) {
      return res.status(401).json({ status: false, message: "Gemini error" });
    }

    console.log(test.questions);

    return res.status(200).json({ status: true, test });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};


const submitAnswer = async () => {
  if (!currentAnswer.trim()) {
    Alert.alert("Required", "Please enter your answer");
    return;
  }

  try {
    const question = questions[currentQuestionIndex];

    console.log("→ Sending POST to: http://localhost:5000/test/submit");
    console.log("→ Token starts with:", accessToken?.substring(0, 15) + "...");

    const response = await fetch("http://localhost:5000/test/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        question,
        answer: currentAnswer,
      }),
    });

    console.log("← Status:", response.status);
    console.log("← Content-Type:", response.headers.get("content-type"));

    // Get raw response text (this won't crash)
    const rawText = await response.text();

    console.log("← Raw response preview:");
    console.log(rawText.substring(0, 400)); // first 400 characters

    // Only try JSON parse if it looks like JSON
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(rawText);

      if (data.success) {
        setCognitionScore((prev) => prev + (data.sum || 0));
        setCurrentAnswer("");
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          setVoiceTestValid(true);
        }
      } else {
        Alert.alert("Error", data.message || "Failed to submit");
      }
    } else {
      Alert.alert("Server Problem", "Server returned non-JSON response");
      console.log("Full raw response was HTML or other format");
    }
  } catch (err) {
    console.error("Submit error:", err);
    Alert.alert("Error", "Could not submit answer");
  }
};
const requesttest = async(req, res) => {
    try {
        const {user_id} = req.params;
        if(!user_id)
            return res.status(404).json({status: false, message: "User not found"})

        const test = new Test({alcoholic_id: user_id});
        await test.save()

        return res.status(200).json({status: true, test});
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

module.exports = {
    givetest,
    submitAnswer,
    requesttest, 
    storetest
}
