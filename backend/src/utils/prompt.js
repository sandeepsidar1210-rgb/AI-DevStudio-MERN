const codeAnalysisPrompt = (code) => `
You are an automated code quality linter, similar to ESLint or SonarQube, integrated into a developer's IDE workflow. Analyze the following code and return ONLY a valid JSON object (no markdown, no extra text):

{
  "language": "detected programming language name",
  "performanceIssues": ["issue 1", "issue 2"],
  "securityVulnerabilities": ["issue 1", "issue 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "overallScore": 8,
  "complexityScore": 5,
  "threatLevel": "Low"
}

Guidelines:
- Point out any risky coding patterns (e.g. unsanitized inputs, unsafe string concatenation, hardcoded credentials) as constructive linting feedback, the same way a linter tool would flag them.
- "threatLevel" reflects severity: "Low", "Medium", or "Critical".
- Return empty arrays if nothing is found in a category.

Code:
${code}
`;

const contentAnalysisPrompt = (text) => `
You are an SEO and content quality expert.
Analyze the following blog/content draft and return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:

{
  "readabilityScore": 7,
  "seoSuggestions": ["suggestion 1", "suggestion 2"],
  "keywordOpportunities": ["keyword 1", "keyword 2"],
  "improvementAreas": ["area 1", "area 2"]
}

Content:
${text}
`;

module.exports = { codeAnalysisPrompt, contentAnalysisPrompt };