const fs = require('fs');
const path = require('path');
const { HfInference } = require('@huggingface/inference');

async function testConnection() {
    try {
        // 1. Read .env.local
        const envPath = path.join(__dirname, '..', '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('❌ .env.local not found!');
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/HF_API_TOKEN=(.+)/);

        if (!match || !match[1]) {
            console.error('❌ HF_API_TOKEN not found in .env.local');
            return;
        }

        const token = match[1].trim();
        console.log(`✅ Found token: ${token.substring(0, 4)}...${token.substring(token.length - 4)}`);

        // 2. Initialize Client
        const hf = new HfInference(token);

        // 3. Test Chat Completion with multiple models
        const models = [
            "meta-llama/Meta-Llama-3-8B-Instruct",
            "HuggingFaceH4/zephyr-7b-beta",
            "google/gemma-2-2b-it",
            "microsoft/Phi-3-mini-4k-instruct",
            "Qwen/Qwen2.5-7B-Instruct"
        ];

        console.log('🔄 Testing models...');

        for (const model of models) {
            console.log(`\n👉 Testing ${model}...`);
            try {
                const response = await hf.chatCompletion({
                    model: model,
                    messages: [{ role: "user", content: "Hello!" }],
                    max_tokens: 50,
                });
                console.log('✅ Success! Response:');
                console.log(response.choices[0].message.content);
                console.log(`\n🎉 WORKING MODEL FOUND: ${model}`);
                return; // Exit after success
            } catch (err) {
                console.error(`❌ Failed with ${model}:`);
                if (err.response) {
                    // Try to parse JSON error
                    try {
                        const body = await err.response.json();
                        console.error(JSON.stringify(body, null, 2));
                    } catch (e) {
                        console.error(err.message);
                    }
                } else {
                    console.error(err.message);
                }
            }
        }
        console.error('\n❌ All models failed.');

    } catch (error) {
        console.error('❌ Unexpected error:');
        console.error(error);
    }
}

testConnection();
