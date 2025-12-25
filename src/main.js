// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
/* eslint-disable no-console */
import { Actor } from 'apify';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables from .env file
dotenv.config();

// Initialize the Actor
await Actor.init();

// Get input data defined in input_schema.json
const input = await Actor.getInput();

if (!input) {
    throw new Error('No input provided. Please provide resumeText and targetRole in INPUT.json');
}

const { 
    resumeText, 
    targetRole, 
    targetCompany = '', 
    experienceLevel = 'mid', 
    additionalContext = '' 
} = input;

// Validate required inputs
if (!resumeText || !targetRole) {
    throw new Error('resumeText and targetRole are required inputs');
}

console.log('Starting AI Resume Gap Analysis', { 
    targetRole, 
    targetCompany, 
    experienceLevel,
    resumeLength: resumeText.length 
});

// Check if API key is available
const apiKey = process.env.NEBIUS_API_KEY || input.nebiusApiKey;
const hasApiKey = !!apiKey;

if (!hasApiKey) {
    console.warn('⚠️ NEBIUS_API_KEY not found. Will use fallback analysis mode.');
}

// Initialize Nebius AI client (uses OpenAI SDK with custom base URL)
const nebius = hasApiKey ? new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.studio.nebius.ai/v1/'
}) : null;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Analyzes the resume using AI to extract structured insights
 */
async function analyzeResumeWithAI(resume, role, company, expLevel, context) {
    const systemPrompt = `You are an expert career coach and technical recruiter specializing in resume analysis and career guidance. 
Your task is to analyze resumes against target roles and provide actionable, data-driven insights.

Focus on:
1. Technical skill gaps and missing competencies
2. ATS (Applicant Tracking System) keyword optimization
3. Experience relevance and presentation
4. Concrete improvement actions
5. Project recommendations that demonstrate needed skills
6. Learning paths tailored to experience level

Be specific, actionable, and constructive. Provide scores on a 0-100 scale.`;

    const userPrompt = `Analyze this resume for the role of "${role}"${company ? ` at ${company}` : ''}.
The candidate is at the ${expLevel} experience level.
${context ? `\nAdditional context: ${context}` : ''}

RESUME:
${resume}

Provide a comprehensive analysis in the following JSON structure:
{
    "candidateName": "extracted name or 'Not provided'",
    "targetRole": "${role}",
    "analysisDate": "${new Date().toISOString()}",
    "relevanceScore": {
        "overall": 0-100,
        "skills": 0-100,
        "experience": 0-100,
        "atsCompatibility": 0-100
    },
    "skillGaps": [
        {
            "skill": "skill name",
            "importance": "critical|important|nice-to-have",
            "reason": "why this skill matters"
        }
    ],
    "atsKeywords": {
        "present": ["keywords found in resume"],
        "missing": ["important keywords not found"],
        "suggestions": ["phrases to add"]
    },
    "projectRecommendations": [
        {
            "title": "project name",
            "description": "what to build",
            "skillsCovered": ["skill1", "skill2"],
            "estimatedTime": "time estimate",
            "priority": "high|medium|low"
        }
    ],
    "learningPath": [
        {
            "topic": "what to learn",
            "resourceType": "course|documentation|book|tutorial|certification",
            "estimatedTime": "time estimate",
            "priority": 1-5
        }
    ],
    "improvementActions": [
        {
            "action": "specific action to take",
            "category": "resume-format|skills|experience|projects|certifications|networking",
            "impact": "high|medium|low",
            "timeframe": "immediate|1-2 weeks|1-3 months"
        }
    ],
    "summary": "2-3 sentence executive summary of readiness and top recommendations"
}

Return ONLY valid JSON, no additional text.`;

    console.log('Calling Nebius AI API for resume analysis...');
    
    try {
        const response = await nebius.chat.completions.create({
            model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const analysisResult = JSON.parse(response.choices[0].message.content);
        console.log('AI analysis completed successfully');
        
        return analysisResult;
    } catch (error) {
        console.error('Error during AI analysis', error.message);
        throw error;
    }
}

/**
 * Extracts basic information from resume text (fallback if AI fails)
 */
function extractBasicInfo(resume) {
    const lines = resume.split('\n').filter(line => line.trim());
    const candidateName = lines[0]?.trim() || 'Not provided';
    
    return {
        candidateName,
        basicSkills: resume.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
    };
}

/**
 * Calculates a simple relevance score (fallback method)
 */
function calculateSimpleScore(resume, role) {
    const roleKeywords = role.toLowerCase().split(' ');
    const resumeLower = resume.toLowerCase();
    
    let matches = 0;
    roleKeywords.forEach(keyword => {
        if (resumeLower.includes(keyword)) matches++;
    });
    
    return Math.min(100, (matches / roleKeywords.length) * 100);
}

// ============================================================================
// MAIN ANALYSIS FLOW
// ============================================================================

try {
    let analysisResult;
    
    // Check if we can use AI analysis
    if (hasApiKey && nebius) {
        // Perform AI-powered analysis
        analysisResult = await analyzeResumeWithAI(
            resumeText, 
            targetRole, 
            targetCompany, 
            experienceLevel, 
            additionalContext
        );
    } else {
        // Use fallback analysis for testing/demo mode
        console.log('Using fallback analysis (no API key available)');
        const basicInfo = extractBasicInfo(resumeText);
        const simpleScore = calculateSimpleScore(resumeText, targetRole);
        
        analysisResult = {
            candidateName: basicInfo.candidateName,
            relevanceScore: {
                overall: simpleScore,
                skills: Math.max(0, simpleScore - 10),
                experience: Math.max(0, simpleScore - 5),
                atsCompatibility: Math.max(0, simpleScore - 15)
            },
            skillGaps: [
                {
                    skill: 'Advanced system design',
                    importance: 'critical',
                    reason: 'Required for senior roles - add portfolio projects demonstrating scalable architecture'
                },
                {
                    skill: 'Cloud infrastructure (AWS/GCP/Azure)',
                    importance: 'high',
                    reason: 'Most modern full-stack roles require cloud deployment experience'
                }
            ],
            atsKeywords: {
                present: basicInfo.basicSkills.slice(0, 8),
                missing: ['CI/CD', 'Docker', 'Kubernetes', 'microservices', 'system design'],
                suggestions: ['Add cloud platform experience', 'Include DevOps tools', 'Highlight scalability achievements']
            },
            projectRecommendations: [
                {
                    title: 'Build a Microservices E-commerce Platform',
                    description: 'Create a full-stack application with separate services for auth, products, cart, and payments',
                    skillsCovered: ['microservices', 'Docker', 'Kubernetes', 'API design'],
                    estimatedTime: '4-6 weeks',
                    priority: 'high'
                }
            ],
            learningPath: [
                {
                    topic: 'System Design Fundamentals',
                    resourceType: 'course',
                    estimatedTime: '3-4 weeks',
                    priority: 1
                },
                {
                    topic: 'AWS Solutions Architect Associate',
                    resourceType: 'certification',
                    estimatedTime: '2-3 months',
                    priority: 2
                }
            ],
            improvementActions: [
                {
                    action: 'Add quantifiable metrics to project descriptions (e.g., "improved performance by 40%")',
                    category: 'resume-format',
                    impact: 'high',
                    timeframe: 'immediate'
                },
                {
                    action: 'Include cloud deployment and DevOps experience in skills section',
                    category: 'skills',
                    impact: 'high',
                    timeframe: 'immediate'
                }
            ],
            summary: `Resume shows solid ${experienceLevel}-level foundation but lacks advanced technical depth for ${targetRole}. Focus on system design, cloud infrastructure, and adding measurable impact metrics. Recommended: 2-3 months preparation with targeted learning and portfolio projects.`
        };
    }

    // Ensure all required fields are present
    const completeResult = {
        candidateName: analysisResult.candidateName || 'Not provided',
        targetRole,
        targetCompany: targetCompany || 'Not specified',
        experienceLevel,
        analysisDate: new Date().toISOString(),
        relevanceScore: analysisResult.relevanceScore || {
            overall: 0,
            skills: 0,
            experience: 0,
            atsCompatibility: 0
        },
        skillGaps: (analysisResult.skillGaps && analysisResult.skillGaps.length > 0) ? analysisResult.skillGaps : [
            {
                skill: 'Unable to determine specific gaps',
                importance: 'critical',
                reason: 'Incomplete analysis - please add NEBIUS_API_KEY for detailed insights'
            }
        ],
        atsKeywords: analysisResult.atsKeywords || {
            present: [],
            missing: [],
            suggestions: []
        },
        projectRecommendations: (analysisResult.projectRecommendations && analysisResult.projectRecommendations.length > 0) ? analysisResult.projectRecommendations : [
            {
                title: 'Build a Portfolio Project',
                description: 'Create a project that demonstrates the skills required for your target role',
                skillsCovered: ['relevant technical skills'],
                estimatedTime: '2-4 weeks',
                priority: 'high'
            }
        ],
        learningPath: (analysisResult.learningPath && analysisResult.learningPath.length > 0) ? analysisResult.learningPath : [
            {
                topic: 'Role-specific technical skills',
                resourceType: 'course',
                estimatedTime: '1-3 months',
                priority: 1
            }
        ],
        improvementActions: (analysisResult.improvementActions && analysisResult.improvementActions.length > 0) ? analysisResult.improvementActions : [
            {
                action: 'Configure NEBIUS_API_KEY environment variable for detailed analysis',
                category: 'skills',
                impact: 'high',
                timeframe: 'immediate'
            }
        ],
        summary: analysisResult.summary || 'Analysis completed. For detailed insights, configure the Nebius API key in your Actor settings.'
    };

    // Save results to dataset
    await Actor.pushData(completeResult);

    console.log('Complete Result: ', completeResult);

} catch (error) {
    console.error('Failed to complete analysis', error.message);
    
    // Provide a fallback minimal analysis
    const basicInfo = extractBasicInfo(resumeText);
    const fallbackResult = {
        candidateName: basicInfo.candidateName,
        targetRole,
        targetCompany: targetCompany || 'Not specified',
        experienceLevel,
        analysisDate: new Date().toISOString(),
        relevanceScore: {
            overall: calculateSimpleScore(resumeText, targetRole),
            skills: 0,
            experience: 0,
            atsCompatibility: 0
        },
        skillGaps: [{
            skill: 'Unable to analyze',
            importance: 'critical',
            reason: 'AI analysis failed. Please check API configuration.'
        }],
        atsKeywords: {
            present: basicInfo.basicSkills.slice(0, 10),
            missing: [],
            suggestions: []
        },
        projectRecommendations: [],
        learningPath: [],
        improvementActions: [{
            action: 'Retry analysis with valid Nebius API key',
            category: 'skills',
            impact: 'high',
            timeframe: 'immediate'
        }],
        summary: 'Analysis failed due to AI service error. Please verify Nebius API key and try again.'
    };
    
    await Actor.pushData(fallbackResult);
}

// Gracefully exit the Actor
await Actor.exit();
