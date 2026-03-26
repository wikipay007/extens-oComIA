// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processText") {
        handleGeminiRequest(request.text, request.type)
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep channel open for async response
    }
});

async function handleGeminiRequest(text, type) {
    // In a real extension, the user would provide their key in options.
    // For this demo, we assume the key is managed or provided.
    const API_KEY = "YOUR_GEMINI_API_KEY"; // User needs to replace this or we use a proxy
    const MODEL = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    let prompt = "";
    if (type === "correct") {
        prompt = `Você é um corretor gramatical. Ao receber uma sentença, identifique erros e retorne APENAS um JSON com o seguinte formato:
        {
            "correctedText": "texto corrigido aqui",
            "errors": ["palavra1", "palavra2"]
        }
        Sentença: "${text}"`;
    } else if (type === "rewrite") {
        prompt = `Reescreva a seguinte sentença mantendo o sentido original e o tom, mas de forma mais profissional e fluida. Retorne APENAS o texto reescrito.
        Sentença: "${text}"`;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Failed to call Gemini API");
    }

    const result = await response.json();
    const outputText = result.candidates[0].content.parts[0].text;

    if (type === "correct") {
        try {
            // Clean markdown if present
            const jsonMatch = outputText.match(/\{[\s\S]*\}/);
            return JSON.parse(jsonMatch ? jsonMatch[0] : outputText);
        } catch (e) {
            return { correctedText: outputText, errors: [] };
        }
    }

    return outputText;
}
