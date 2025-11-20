async function generateMelody(prompt) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-oss-120b",
        stream: false,
        max_tokens: 65536,
        temperature: 1,
        top_p: 1,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates musical sheet data in JSON format based on user prompts. Don't use Markdown syntax for all output.",
          },
          {
            role: "user",
            content: `Generate a musical sheet data in JSON format based on the following description: "${prompt}". You must follow this JSON schema: {"sheet": {"title": "string", "bars": [{"notes": [{"pitch": "string", "duration": "string"}]}]}}. The "duration" value for each note MUST be a string representing a fraction, like "1/4" for a quarter note, "1/8" for an eighth note, or "1/1" for a whole note. Make sure to make 4 bars`,
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorBody}`);
    }

    let data = await response.json();

    const responseText = data.choices[0].message.content;
    const melodyData = JSON.parse(responseText);

    return melodyData;
  } catch (error) {
    console.error("Error generating melody:", error);
    updateStatus(`오류 발생: ${error.message}`, "error");
    document.getElementById("meta").textContent = "";
    return null;
  }
}