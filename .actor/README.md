# 🎯 AI Resume Gap Analyzer

> An intelligent Apify Actor powered by Nebius AI that analyzes resumes against target roles to identify skill gaps, ATS weaknesses, and provides actionable career guidance.

[![Apify](https://img.shields.io/badge/Apify-Actor-00D4AA)](https://apify.com)
[![Nebius AI](https://img.shields.io/badge/Nebius-AI-blue)](https://nebius.ai)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)

---

## 📌 Overview

The AI Resume Gap Analyzer is a **career intelligence API** that helps job seekers understand what they're missing and provides concrete steps to increase their chances of landing interviews. Unlike traditional resume builders that focus on formatting, this Actor focuses on **direction and actionable insights**.

### ✨ Key Features

- ✅ **Resume Relevance Scoring** - Quantifies match with target role (0-100 scale)
- 🔍 **Skill Gap Analysis** - Identifies missing technical and soft skills
- 🤖 **ATS Optimization** - Extracts and suggests keywords for Applicant Tracking Systems
- 💡 **Project Recommendations** - Suggests portfolio projects to demonstrate needed skills
- 📚 **Learning Path** - Provides tailored learning resources based on experience level
- 🚀 **Actionable Guidance** - Delivers concrete improvement steps with impact ratings

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Nebius AI API key ([Get it here](https://studio.nebius.ai/))
- Apify account (optional, for cloud deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/mani-1509/Apify
cd ai-resume-gap-analyzer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your NEBIUS_API_KEY
```

### Configuration

Create a `.env` file in the root directory:

```env
NEBIUS_API_KEY=your-nebius-api-key-here
```

### Run Locally

```bash
# Run the Actor
npm run start
```

The Actor will read input from `storage/key_value_stores/default/INPUT.json` and save results to `storage/datasets/default/`.

---

## 📥 Input

Edit `storage/key_value_stores/default/INPUT.json` with your data:

```json
{
  "resumeText": "Your full resume text here...",
  "targetRole": "Senior Full Stack Engineer",
  "targetCompany": "Google",
  "experienceLevel": "mid",
  "additionalContext": "Optional: specific interests, constraints, or focus areas"
}
```

### Input Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resumeText` | string | ✅ | Full resume text (minimum 50 characters) |
| `targetRole` | string | ✅ | Job title or role targeting (e.g., "Senior Software Engineer") |
| `targetCompany` | string | ❌ | Specific company name for targeted analysis |
| `experienceLevel` | string | ✅ | One of: `entry`, `mid`, `senior`, `lead`, `executive` |
| `additionalContext` | string | ❌ | Additional information like specific skills focus or career goals |

---

## 📤 Output

The Actor returns comprehensive analysis in JSON format:

```json
{
  "candidateName": "John Doe",
  "targetRole": "Senior Full Stack Engineer",
  "targetCompany": "Google",
  "experienceLevel": "mid",
  "analysisDate": "2025-12-18T...",
  "relevanceScore": {
    "overall": 60,
    "skills": 50,
    "experience": 40,
    "atsCompatibility": 70
  },
  "skillGaps": [
    {
      "skill": "Cloud Infrastructure",
      "importance": "critical",
      "reason": "Essential for senior engineering roles at top companies"
    }
  ],
  "atsKeywords": {
    "present": ["JavaScript", "React", "Node.js"],
    "missing": ["Kubernetes", "AWS", "Microservices"],
    "suggestions": ["Add 'cloud infrastructure' and 'system design' phrases"]
  },
  "projectRecommendations": [
    {
      "title": "Build a Scalable Microservices API",
      "description": "Create a distributed system with multiple services...",
      "skillsCovered": ["Microservices", "Docker", "API Gateway"],
      "estimatedTime": "2-3 weeks",
      "priority": "high"
    }
  ],
  "learningPath": [
    {
      "topic": "System Design Fundamentals",
      "resourceType": "course",
      "estimatedTime": "4 weeks",
      "priority": 1
    }
  ],
  "improvementActions": [
    {
      "action": "Add cloud certifications (AWS/GCP)",
      "category": "certifications",
      "impact": "high",
      "timeframe": "1-3 months"
    }
  ],
  "summary": "Good foundation but needs system design skills and cloud expertise for senior roles."
}
```

### Check Results

```bash
# View results in JSON
cat storage/datasets/default/000000001.json

# Or with PowerShell
Get-Content storage\datasets\default\000000001.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## 🔧 How It Works

```
Input (Resume + Target Role)
         ↓
Nebius AI Analysis (Meta Llama 3.1 70B)
         ↓
Structured JSON Output
         ↓
Apify Dataset Storage
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Apify SDK 3.x
- **AI Engine**: Nebius AI (Meta Llama 3.1 70B Instruct)
- **Storage**: Apify Datasets
- **Deployment**: Docker + Apify Cloud

---

## 🌐 Deploy to Apify

### 1. Install Apify CLI

```bash
npm install -g apify-cli
```

### 2. Login to Apify

```bash
apify login
```

### 3. Deploy

```bash
apify push
```

### 4. Configure Environment

1. Go to your Actor page in Apify Console
2. Navigate to **Settings** → **Environment variables**
3. Add secret: `NEBIUS_API_KEY` = `your-key-here`
4. Save and test

---

## 🔌 API Integration

### Using Apify API

```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'YOUR_APIFY_TOKEN' });

const run = await client.actor('YOUR_ACTOR_ID').call({
  resumeText: 'Your resume...',
  targetRole: 'Senior Engineer',
  experienceLevel: 'mid'
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items[0]); // Analysis results
```

### Direct HTTP API

```bash
curl -X POST https://api.apify.com/v2/acts/YOUR_ACTOR_ID/runs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_APIFY_TOKEN" \
  -d '{
    "resumeText": "Your resume text...",
    "targetRole": "Senior Software Engineer",
    "experienceLevel": "mid"
  }'
```

---

## 💡 Use Cases

### 1. Career Coaching Platforms
Integrate as a backend intelligence layer to provide personalized career guidance to users.

### 2. Job Application Assistants
Help users optimize resumes before applying to specific roles.

### 3. EdTech & Learning Platforms
Generate personalized learning paths based on career goals.

### 4. Recruitment Tools
Assist recruiters in identifying candidate gaps and potential.

### 5. Personal Career Assistant
Build AI agents that help with ongoing career development.

---

## 🎨 Customization

### Change AI Model

Edit `src/main.js` to use different Nebius models:

```javascript
const response = await nebius.chat.completions.create({
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct', // Current
    // model: 'meta-llama/Meta-Llama-3.1-8B-Instruct', // Faster
    // model: 'meta-llama/Meta-Llama-3.1-405B-Instruct', // Most capable
    messages: [...],
    temperature: 0.7
});
```

### Adjust Analysis Depth

Modify the system prompt in `src/main.js` to focus on specific areas or change the analysis style.

---

## 💰 Cost Considerations

### Nebius AI Pricing
- **Meta Llama 3.1 70B**: ~$0.005-0.02 per analysis
- **Meta Llama 3.1 8B**: Lower cost, faster (good for development)
- Check [Nebius Pricing](https://nebius.ai/pricing) for current rates

### Apify Platform
- **Free Tier**: 5,000 credits/month (plenty for testing)
- **Per Run**: ~0.01-0.1 credits per analysis
- **Scale**: $49/month for 50,000 credits

---

## 🐛 Troubleshooting

### Error: "NEBIUS_API_KEY is not defined"
- Verify `.env` file exists with valid API key
- If running on Apify, check environment variables in Actor settings

### Error: "resumeText and targetRole are required"
- Check `storage/key_value_stores/default/INPUT.json` exists
- Verify JSON is valid and contains required fields

### Empty or Incomplete Analysis
- Ensure resume text is substantial (>50 characters)
- Check Nebius API key is valid and has credits
- Try with a different model (e.g., 8B for testing)

### API Rate Limiting
- Nebius has rate limits based on your plan
- Implement retry logic for production use
- Contact Nebius support for higher limits

---

## 📁 Project Structure

```
ai-resume-gap-analyzer/
├── .actor/
│   ├── actor.json              # Actor configuration
│   ├── input_schema.json       # Input validation schema
│   ├── dataset_schema.json     # Output structure definition
│   └── INPUT_TEMPLATE.json     # Sample input data
├── src/
│   ├── main.js                 # Main Actor logic
│   └── test.js                 # Structure validation script
├── storage/
│   ├── datasets/               # Analysis results
│   └── key_value_stores/       # Input storage
│       └── default/
│           └── INPUT.json      # Local input file
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── package.json                # Dependencies
├── Dockerfile                  # Container configuration
└── README.md                   # This file
```

---

## 🧪 Testing

### Test Structure (without API calls)

```bash
node src/test.js
```

This validates the data structure without making API calls.

### Test with Real API

```bash
npm run start
```

This runs a full analysis using Nebius AI.

---

## 🔐 Security Best Practices

1. **Never commit API keys** - Keep `.env` in `.gitignore`
2. **Use environment variables** - On Apify, use Secret Environment Variables
3. **Rotate keys regularly** - Generate new API keys periodically
4. **Monitor usage** - Check Nebius dashboard for API usage and costs
5. **Validate input** - Sanitize resume text to prevent injection attacks

---

## 📚 Resources

- [Nebius AI Documentation](https://docs.nebius.ai/)
- [Nebius Studio](https://studio.nebius.ai/)
- [Apify Platform Docs](https://docs.apify.com/platform)
- [Apify SDK for JavaScript](https://docs.apify.com/sdk/js)
- [Meta Llama 3.1 Model Card](https://ai.meta.com/llama/)

---

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Job description scraping and comparison
- [ ] Company culture fit analysis
- [ ] Salary range recommendations
- [ ] Resume formatting suggestions
- [ ] Interview preparation guidance
- [ ] LinkedIn profile optimization
- [ ] Batch resume processing
- [ ] Real-time job market trends integration

---

## 👥 Target Users

- **Students & Graduates** - Understand what skills to build for target roles
- **Career Switchers** - Bridge the gap between current and desired positions
- **Job Seekers** - Optimize resumes for specific companies and roles
- **Developers** - Integrate career intelligence into apps and dashboards
- **Career Coaches** - Provide data-driven guidance to clients
- **Recruiters** - Quickly assess candidate readiness

---

## 🏆 What Makes This Special

Unlike traditional resume builders that focus on formatting:

✅ **Intelligence-First** - AI-powered analysis of gaps and opportunities  
✅ **Actionable** - Concrete next steps, not just generic advice  
✅ **Personalized** - Tailored to experience level and target role  
✅ **API-Ready** - Built for integration, not just standalone use  
✅ **Scalable** - Serverless architecture handles unlimited requests  
✅ **Data-Driven** - Structured output enables analytics and tracking  
✅ **Cost-Effective** - Uses open-source AI models via Nebius

---

## 📄 License

MIT

---

## 🤝 Contributing

This Actor is part of the **Resumell** project vision - a comprehensive AI career guidance platform. Contributions welcome!

### Future Resumell Features
- Resume analysis (✅ **Done!**)
- Job description parsing
- Company research and benchmarking
- Interview preparation
- Skill development tracking
- Career path planning
- Salary negotiation guidance
- Networking recommendations

---

## 📧 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact via Apify platform
- Check [Apify Discord Community](https://discord.com/invite/jyEM2PRvMU)

---

**Built with ❤️ using Apify, Nebius AI (Meta Llama 3.1), and modern JavaScript**

**Ready to help thousands of job seekers land their dream roles!** 🚀
