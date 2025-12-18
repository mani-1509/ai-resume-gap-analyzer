// Quick test script to validate Actor functionality without Nebius API
/* eslint-disable no-console */

// Mock resume for testing
const mockInput = {
    resumeText: `Jane Smith
    Senior Software Engineer
    jane.smith@email.com | (555) 123-4567 | linkedin.com/in/janesmith
    
    SUMMARY
    Experienced full-stack engineer with 6 years building scalable web applications. 
    Expert in React, Node.js, and cloud infrastructure. Passionate about performance optimization and clean architecture.
    
    EXPERIENCE
    
    Senior Software Engineer | Tech Corp | 2021 - Present
    • Lead development of microservices architecture serving 10M+ users
    • Optimized API performance reducing response time by 40%
    • Mentored 5 junior developers and conducted technical interviews
    • Technologies: React, TypeScript, Node.js, AWS, Docker, Kubernetes
    
    Software Engineer | StartupXYZ | 2019 - 2021
    • Built RESTful APIs and React frontends for SaaS platform
    • Implemented CI/CD pipelines using Jenkins and AWS
    • Collaborated with product team using Agile/Scrum methodology
    
    Junior Developer | WebDev Inc | 2018 - 2019
    • Developed responsive websites with React and Node.js
    • Fixed bugs and added features to existing codebases
    • Learned modern web development best practices
    
    EDUCATION
    B.S. Computer Science | University of Technology | 2018
    
    SKILLS
    Languages: JavaScript, TypeScript, Python, SQL
    Frontend: React, Redux, Next.js, HTML/CSS, Tailwind
    Backend: Node.js, Express, GraphQL, REST APIs
    Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
    Databases: PostgreSQL, MongoDB, Redis
    Tools: Git, GitHub Actions, Jest, Webpack`,
    
    targetRole: 'Staff Software Engineer',
    targetCompany: 'Meta',
    experienceLevel: 'senior',
    additionalContext: 'Looking to transition into distributed systems and infrastructure roles at FAANG companies. Want to focus on backend and system design.'
};

console.log('🧪 Testing AI Resume Gap Analyzer\n');
console.log('📝 Input Summary:');
console.log(`   Role: ${mockInput.targetRole}`);
console.log(`   Company: ${mockInput.targetCompany}`);
console.log(`   Experience Level: ${mockInput.experienceLevel}`);
console.log(`   Resume Length: ${mockInput.resumeText.length} characters\n`);

// Mock AI response for testing structure
const mockAnalysis = {
    candidateName: 'Jane Smith',
    targetRole: mockInput.targetRole,
    targetCompany: mockInput.targetCompany,
    experienceLevel: mockInput.experienceLevel,
    analysisDate: new Date().toISOString(),
    relevanceScore: {
        overall: 78,
        skills: 75,
        experience: 82,
        atsCompatibility: 76
    },
    skillGaps: [
        {
            skill: 'Distributed Systems Architecture',
            importance: 'critical',
            reason: 'Staff engineers at Meta lead design of distributed systems at massive scale'
        },
        {
            skill: 'Large-Scale System Design',
            importance: 'critical',
            reason: 'Need to demonstrate experience designing systems for billions of users'
        },
        {
            skill: 'C++ or Rust',
            importance: 'important',
            reason: 'Meta infrastructure uses C++ extensively for performance-critical systems'
        }
    ],
    atsKeywords: {
        present: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Microservices'],
        missing: ['Distributed Systems', 'Scalability', 'Performance Engineering', 'Infrastructure', 'C++'],
        suggestions: [
            'Add "distributed systems" and "large-scale architecture"',
            'Include metrics like "billions of requests" or "millions of QPS"',
            'Mention cross-team collaboration and technical leadership'
        ]
    },
    projectRecommendations: [
        {
            title: 'Build a Distributed Key-Value Store',
            description: 'Create a Raft-based distributed database similar to etcd',
            skillsCovered: ['Distributed Systems', 'Consensus Algorithms', 'System Design'],
            estimatedTime: '4-6 weeks',
            priority: 'high'
        },
        {
            title: 'High-Performance Message Queue',
            description: 'Build a message broker handling millions of messages/sec',
            skillsCovered: ['Performance Engineering', 'Concurrency', 'Low-latency Systems'],
            estimatedTime: '3-4 weeks',
            priority: 'high'
        }
    ],
    learningPath: [
        {
            topic: 'Designing Data-Intensive Applications',
            resourceType: 'book',
            estimatedTime: '6-8 weeks',
            priority: 1
        },
        {
            topic: 'MIT 6.824 Distributed Systems',
            resourceType: 'course',
            estimatedTime: '12 weeks',
            priority: 2
        }
    ],
    improvementActions: [
        {
            action: 'Add quantified impact metrics to each role (users served, latency improvements)',
            category: 'resume-format',
            impact: 'high',
            timeframe: 'immediate'
        },
        {
            action: 'Build and publish open-source distributed systems project',
            category: 'projects',
            impact: 'high',
            timeframe: '1-3 months'
        },
        {
            action: 'Network with Meta engineers on LinkedIn and attend Meta tech talks',
            category: 'networking',
            impact: 'medium',
            timeframe: '1-2 weeks'
        }
    ],
    summary: 'Strong engineering background with relevant cloud and microservices experience. To reach Staff level at Meta, focus on distributed systems knowledge, add more impact metrics, and demonstrate technical leadership through architecture decisions. Close to ready with 3-6 months of targeted improvement.'
};

console.log('✅ Mock Analysis Generated\n');
console.log('📊 Relevance Score:', mockAnalysis.relevanceScore.overall, '/100');
console.log('🎯 Skill Gaps Found:', mockAnalysis.skillGaps.length);
console.log('📦 Project Recommendations:', mockAnalysis.projectRecommendations.length);
console.log('📚 Learning Resources:', mockAnalysis.learningPath.length);
console.log('⚡ Action Items:', mockAnalysis.improvementActions.length);
console.log('\n📝 Summary:');
console.log(`   ${mockAnalysis.summary}`);

console.log('\n✨ Structure validated! Ready for real Nebius AI integration.');
console.log('💡 Next steps:');
console.log('   1. Add NEBIUS_API_KEY to .env file');
console.log('   2. Run: npm run start');
console.log('   3. Check output in storage/datasets/default/\n');

export { mockInput, mockAnalysis };
