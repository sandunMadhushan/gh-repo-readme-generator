const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateReadme = async (repoDetails) => {
  const {
    name,
    description,
    owner,
    html_url,
    language,
    languages,
    contributors,
    releases,
    topics,
    license,
    homepage,
    hasPackageJson,
    hasRequirements,
    hasDockerfile,
    hasMakefile,
    hasGemfile,
    hasComposerJson,
    hasSetupPy,
    packageData,
    stargazers_count,
    forks_count,
    open_issues_count,
    created_at,
    updated_at,
  } = repoDetails;

  // Determine tech stack and installation method
  const techStack = Object.keys(languages || {}).join(", ");
  const primaryLanguage = language || "Unknown";

  let installationMethod = "";
  if (hasPackageJson) {
    installationMethod = "npm/yarn";
  } else if (hasRequirements) {
    installationMethod = "pip";
  } else if (hasGemfile) {
    installationMethod = "bundle";
  } else if (hasComposerJson) {
    installationMethod = "composer";
  } else if (hasMakefile) {
    installationMethod = "make";
  }

  const latestRelease = releases && releases.length > 0 ? releases[0] : null;
  const contributorsList =
    contributors && contributors.length > 0
      ? contributors.map((c) => c.login).join(", ")
      : "No contributors data available";

  const prompt = `Generate a comprehensive and professional README.md file for the following GitHub repository. Make it detailed, well-structured, and following modern README best practices:

## Repository Information:
- **Name**: ${name}
- **Description**: ${description || "No description provided"}
- **Author**: ${owner.login}
- **URL**: ${html_url}
- **Primary Language**: ${primaryLanguage}
- **Tech Stack**: ${techStack}
- **Homepage**: ${homepage || "N/A"}
- **Stars**: ${stargazers_count}
- **Forks**: ${forks_count}
- **Open Issues**: ${open_issues_count}
- **Created**: ${created_at}
- **Last Updated**: ${updated_at}
- **Latest Release**: ${latestRelease ? latestRelease.tag_name : "No releases"}
- **License**: ${license ? license.name : "Not specified"}
- **Topics**: ${topics && topics.length > 0 ? topics.join(", ") : "None"}
- **Contributors**: ${contributorsList}

## Technical Details:
- Has package.json: ${hasPackageJson}
- Has requirements.txt: ${hasRequirements}
- Has Dockerfile: ${hasDockerfile}
- Has Makefile: ${hasMakefile}
- Installation method: ${installationMethod}
${packageData ? `- Package scripts: ${Object.keys(packageData.scripts || {}).join(", ")}` : ""}
${packageData ? `- Dependencies: ${Object.keys(packageData.dependencies || {}).length} production, ${Object.keys(packageData.devDependencies || {}).length} development` : ""}

## README Structure Required:

Create a README with the following sections:

### 1. Header with Badges
Include these badges at the top:
- GitHub license badge
- GitHub last commit badge
- GitHub issues badge
- GitHub forks badge
- GitHub stars badge
- Language badge
- Build status (if applicable)

### 2. Project Title and Description
- Clear, engaging title
- Comprehensive description explaining what the project does
- Key value propositions

### 3. Table of Contents
Generate a clickable table of contents for easy navigation

### 4. Features
- Comprehensive list of key features
- Use bullet points or emojis for visual appeal
- Include both current and planned features if applicable

### 5. Demo/Screenshots
- Placeholder for demo links or screenshots
- Instructions on where to find live demos

### 6. Prerequisites
- System requirements
- Required software/tools
- Minimum versions

### 7. Installation & Setup
- Step-by-step installation instructions based on the tech stack
- Multiple installation methods if applicable (Docker, package managers, etc.)
- Environment setup instructions
- Configuration steps

### 8. Usage
- Basic usage examples
- Code snippets showing common operations
- API documentation if applicable
- Command-line usage if applicable

### 9. Configuration
- Environment variables
- Configuration files
- Customization options

### 10. API Documentation (if applicable)
- Endpoint descriptions
- Request/response examples
- Authentication details

### 11. Contributing
- Contribution guidelines
- Development setup
- Code style guidelines
- Pull request process
- Issue reporting guidelines

### 12. Testing
- How to run tests
- Test coverage information
- Testing frameworks used

### 13. Deployment
- Deployment instructions
- Platform-specific guides
- Environment considerations

### 14. Roadmap
- Future plans
- Upcoming features
- Known limitations

### 15. FAQ
- Common questions and answers
- Troubleshooting guide

### 16. License
- License information with link
- Copyright details

### 17. Acknowledgments
- Credits to contributors
- Third-party libraries/tools used
- Inspiration sources

### 18. Contact & Support
- Maintainer contact information
- Community links (Discord, Slack, etc.)
- Support channels

Make the README engaging, professional, and comprehensive. Use proper Markdown formatting with headers, code blocks, links, and lists. Include placeholder text where specific information isn't available, but make it clear what should be filled in.

The tone should be professional yet approachable, and the content should help both new users and potential contributors understand and engage with the project effectively.`;

  // Use Google Gemini API
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to generate README: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("Invalid response from Gemini API");
  }

  return data.candidates[0].content.parts[0].text;
};
