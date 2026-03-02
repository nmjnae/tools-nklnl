const { GoogleGenerativeAI } = require('@google/generative-ai');
const API_KEY = "AIzaSyBydHHMU8UdN-Vyrmp0M_gfAxSdAWByNzM";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test connection");
        console.log("SUCCESS:", result.response.text());
    } catch (e) {
        console.error("ERROR FROM API:", e.message);
    }
}

run();
