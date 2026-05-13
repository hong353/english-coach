// api/speak.js
export default async function handler(req, res) {
    // 设置跨域头
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const word = req.query.word || 'hello';
    const text = `${word}, ${word}, ${word}`;
    
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-AriaNeural">
            <prosody rate="-10%">${text}</prosody>
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
        res.send(Buffer.from(audioBuffer));
    } catch (error) {
        res.status(500).send('语音生成失败');
    }
}
