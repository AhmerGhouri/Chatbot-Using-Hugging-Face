# Chatbot Troubleshooting Guide

## Error: "Failed to process request"

Based on the console error screenshot, your chatbot is failing when trying to process requests. Here are the steps to diagnose and fix:

### Step 1: Check Your Hugging Face API Token

1. Open `.env.local` file in your project root
2. Verify you have: `HF_API_TOKEN=hf_xxxxxxxxxxxxx`
3. Make sure the token:
   - Starts with `hf_`
   - Has no extra spaces or quotes
   - Is a valid token from https://huggingface.co/settings/tokens

### Step 2: Test the Connection

Run the test script to verify your token and find a working model:

```powershell
node scripts/test-hf-connection.js
```

This will test multiple models and show you which one works.

### Step 3: Common Issues

#### Issue: "Missing HF_API_TOKEN"
**Solution**: Create or update `.env.local` with your token

#### Issue: "Model not available" or "Rate limited"
**Solution**: The model `HuggingFaceH4/zephyr-7b-beta` might be:
- Overloaded
- Requires a paid tier
- Not available in your region

Try these alternative models in `src/app/api/chat/route.ts`:
- `meta-llama/Meta-Llama-3-8B-Instruct`
- `google/gemma-2-2b-it`
- `microsoft/Phi-3-mini-4k-instruct`
- `Qwen/Qwen2.5-7B-Instruct`

#### Issue: PowerShell execution policy blocking npm
**Solution**: Run this command in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 4: Restart the Dev Server

After making changes:
1. Stop the dev server (Ctrl+C)
2. Restart with: `npm run dev`
3. Clear browser cache and refresh

### Step 5: Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for the actual error message
- **Network tab**: Check the `/api/chat` request response

The response should show the exact error from Hugging Face API.

## Quick Fix Checklist

- [ ] `.env.local` exists with valid `HF_API_TOKEN`
- [ ] Token starts with `hf_`
- [ ] Dev server is running (`npm run dev`)
- [ ] No CORS or network errors in browser console
- [ ] Tested connection with `test-hf-connection.js`
- [ ] Tried alternative models if current one fails
