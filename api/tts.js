// api/tts.js
export default async function handler(req, res) {
    const { word, times = 1 } = req.query;
    
    // 构建文本：apple, apple, apple 或 apple, apple
    let text = word;
    if (times === 2) {
        text = `${word}, ${word}`;
    } else if (times === 3) {
        text = `${word}, ${word}, ${word}`;
    }
    
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-AriaNeural">
            <prosody rate="0%">${text}</prosody>
        </voice>
    </speak>`;
    
    try {
        const response = await fetch('https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
            },
            body: ssml,
        });
        
        const audioBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(Buffer.from(audioBuffer));
    } catch (error) {
        res.status(500).send('语音生成失败');
    }
}
