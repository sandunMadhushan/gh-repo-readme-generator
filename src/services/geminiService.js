const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Template definitions
const TEMPLATES = {
  COMPREHENSIVE: {
    id: "comprehensive",
    name: "Comprehensive (All Sections)",
    description:
      "Complete README with all possible sections - best for established projects",
    icon: "📚",
  },
  STARTUP: {
    id: "startup",
    name: "Startup/MVP",
    description: "Focus on product features, demo links, and user acquisition",
    icon: "🚀",
  },
  OPEN_SOURCE: {
    id: "open_source",
    name: "Open Source Project",
    description:
      "Emphasizes contribution guidelines, community, and collaboration",
    icon: "🌟",
  },
  LIBRARY: {
    id: "library",
    name: "Library/Package",
    description: "API documentation, installation guides, and usage examples",
    icon: "📦",
  },
  PORTFOLIO: {
    id: "portfolio",
    name: "Portfolio Project",
    description: "Showcase skills, technologies used, and live demos",
    icon: "💼",
  },
  ACADEMIC: {
    id: "academic",
    name: "Academic/Research",
    description: "Research methodology, citations, and academic formatting",
    icon: "🎓",
  },
  ENTERPRISE: {
    id: "enterprise",
    name: "Enterprise/Corporate",
    description:
      "Professional documentation with compliance and security focus",
    icon: "🏢",
  },
  MINIMALIST: {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, simple README with just the essentials",
    icon: "✨",
  },
};

// Smart repository type detection
const detectRepositoryType = (repoDetails) => {
  const {
    description = "",
    topics = [],
    languages = {},
    name = "",
    hasDockerfile,
    hasRequirements,
  } = repoDetails;

  const descLower = (description || "").toLowerCase();
  const nameLower = (name || "").toLowerCase();
  const topicsLower = (topics || []).map((t) => (t || "").toLowerCase());
  const allLanguages = Object.keys(languages);

  // Detection logic
  const indicators = {
    isLibrary:
      descLower.includes("library") ||
      descLower.includes("package") ||
      descLower.includes("sdk") ||
      descLower.includes("api") ||
      nameLower.includes("lib") ||
      nameLower.includes("sdk"),

    isFramework:
      descLower.includes("framework") ||
      descLower.includes("boilerplate") ||
      descLower.includes("template") ||
      descLower.includes("starter"),

    isWebApp:
      descLower.includes("web app") ||
      descLower.includes("website") ||
      descLower.includes("dashboard") ||
      allLanguages.includes("JavaScript") ||
      allLanguages.includes("TypeScript") ||
      allLanguages.includes("HTML"),

    isMobileApp:
      descLower.includes("mobile") ||
      descLower.includes("android") ||
      descLower.includes("ios") ||
      descLower.includes("react native") ||
      allLanguages.includes("Swift") ||
      allLanguages.includes("Kotlin"),

    isDataScience:
      descLower.includes("data") ||
      descLower.includes("machine learning") ||
      descLower.includes("ai") ||
      descLower.includes("analysis") ||
      (allLanguages.includes("Python") && hasRequirements),

    isDevTool:
      descLower.includes("tool") ||
      descLower.includes("cli") ||
      descLower.includes("utility") ||
      descLower.includes("dev") ||
      nameLower.includes("cli") ||
      nameLower.includes("tool"),

    isGame:
      descLower.includes("game") ||
      descLower.includes("gaming") ||
      topicsLower.includes("game") ||
      allLanguages.includes("C#") ||
      allLanguages.includes("C++"),

    isAcademic:
      descLower.includes("research") ||
      descLower.includes("paper") ||
      descLower.includes("thesis") ||
      descLower.includes("academic") ||
      topicsLower.includes("research"),

    isEnterprise:
      (hasDockerfile && allLanguages.includes("Java")) ||
      descLower.includes("enterprise") ||
      descLower.includes("corporate") ||
      descLower.includes("business"),

    isPortfolio:
      descLower.includes("portfolio") ||
      descLower.includes("showcase") ||
      nameLower.includes("portfolio"),
  };

  // Return most likely type
  if (indicators.isLibrary) return "library";
  if (indicators.isAcademic) return "academic";
  if (indicators.isEnterprise) return "enterprise";
  if (indicators.isPortfolio) return "portfolio";
  if (indicators.isDataScience) return "library"; // Data science often has library-like docs
  if (indicators.isFramework) return "open_source";
  if (indicators.isDevTool) return "open_source";
  if (indicators.isWebApp || indicators.isMobileApp) return "startup";
  if (indicators.isGame) return "portfolio";

  return "comprehensive"; // Default fallback
};

export const generateReadme = async (repoDetails, selectedTemplate = null) => {
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
    packageData,
    stargazers_count,
    forks_count,
    open_issues_count,
    created_at,
    updated_at,
    files = [],
  } = repoDetails;

  // Auto-detect repository type if no template selected
  const detectedType = selectedTemplate || detectRepositoryType(repoDetails);

  // Determine tech stack and installation method
  const techStack = Object.keys(languages || {}).join(", ");
  const primaryLanguage = language || "Unknown";
  const languagePercentages = languages
    ? Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([lang, bytes]) => {
          const total = Object.values(languages).reduce((sum, b) => sum + b, 0);
          const percentage = ((bytes / total) * 100).toFixed(1);
          return `${lang} (${percentage}%)`;
        })
        .join(", ")
    : "Unknown";

  // Smart installation method detection
  let installationMethod = "";
  let runCommands = "";
  if (hasPackageJson) {
    installationMethod = "npm/yarn";
    runCommands = packageData?.scripts
      ? Object.keys(packageData.scripts)
          .slice(0, 3)
          .map((script) => `npm run ${script}`)
          .join(", ")
      : "";
  } else if (hasRequirements) {
    installationMethod = "pip";
    runCommands = "python main.py or python app.py";
  } else if (hasGemfile) {
    installationMethod = "bundle";
    runCommands = "bundle exec ruby app.rb";
  } else if (hasComposerJson) {
    installationMethod = "composer";
    runCommands = "php index.php";
  } else if (hasMakefile) {
    installationMethod = "make";
    runCommands = "make, make install, make run";
  }

  // Enhanced repository analysis
  const repoAnalysis = {
    complexity:
      files.length > 50 ? "Complex" : files.length > 20 ? "Medium" : "Simple",
    isActivelyMaintained:
      new Date(updated_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    hasTests:
      files.some((f) => f.includes("test") || f.includes("spec")) ||
      (hasPackageJson && packageData?.scripts?.test),
    hasCI: files.some(
      (f) =>
        f.includes(".github") || f.includes(".travis") || f.includes("jenkins")
    ),
    hasDocs: files.some(
      (f) => f.includes("docs") || f.includes("documentation")
    ),
    isMonorepo:
      files.some((f) => f.includes("packages") || f.includes("workspaces")) ||
      packageData?.workspaces,
    hasDocker: hasDockerfile || files.some((f) => f.includes("docker-compose")),
    hasAPI:
      description?.toLowerCase().includes("api") ||
      files.some((f) => f.includes("swagger") || f.includes("openapi")),
    frameworks: detectFrameworks(languages, packageData, files),
    deployment: detectDeployment(files, packageData),
  };

  const latestRelease = releases && releases.length > 0 ? releases[0] : null;
  const contributorsList =
    contributors && contributors.length > 0
      ? contributors.map((c) => c.login).join(", ")
      : "No contributors data available";

  // Template-specific prompts
  const templatePrompts = getTemplatePrompt(detectedType);

  const prompt = `Generate a ${
    TEMPLATES[detectedType]?.name || "comprehensive"
  } README.md file for the following GitHub repository. Make it highly relevant to the repository type and technology stack:

## Repository Information:
- **Name**: ${name}
- **Description**: ${description || "No description provided"}
- **Author**: ${owner.login}
- **URL**: ${html_url}
- **Primary Language**: ${primaryLanguage}
- **Language Distribution**: ${languagePercentages}
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

## Technical Analysis:
- **Complexity**: ${repoAnalysis.complexity} project (${files.length} files)
- **Installation Method**: ${installationMethod}
- **Common Commands**: ${runCommands}
- **Has Tests**: ${repoAnalysis.hasTests}
- **Has CI/CD**: ${repoAnalysis.hasCI}
- **Has Documentation**: ${repoAnalysis.hasDocs}
- **Is Monorepo**: ${repoAnalysis.isMonorepo}
- **Has Docker**: ${repoAnalysis.hasDocker}
- **Has API**: ${repoAnalysis.hasAPI}
- **Frameworks**: ${repoAnalysis.frameworks.join(", ") || "None detected"}
- **Deployment**: ${repoAnalysis.deployment.join(", ") || "Not specified"}
- **Actively Maintained**: ${repoAnalysis.isActivelyMaintained}

${templatePrompts}

## IMPORTANT FORMATTING REQUIREMENTS:
- Place ALL badges on the SAME LINE horizontally, separated by spaces
- Example format: [![Badge1](url1)](link1) [![Badge2](url2)](link2) [![Badge3](url3)](link3)
- DO NOT place badges on separate lines or in a vertical list
- Include relevant badges for: license, build status, version, stars, forks, language, etc.
- Ensure the badges section appears right after the title

Make the README highly specific to this repository type, include relevant badges horizontally arranged, and ensure all sections are tailored to the detected technology stack and project complexity.`;

  // Use Google Gemini API
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to generate README: ${
        errorData.error?.message || response.statusText
      }`
    );
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("Invalid response from Gemini API");
  }

  return data.candidates[0].content.parts[0].text;
};

// Helper functions
const detectFrameworks = (languages, packageData, files) => {
  const frameworks = [];

  if (packageData?.dependencies) {
    const deps = Object.keys(packageData.dependencies);
    if (deps.includes("react")) frameworks.push("React");
    if (deps.includes("vue")) frameworks.push("Vue.js");
    if (deps.includes("angular")) frameworks.push("Angular");
    if (deps.includes("express")) frameworks.push("Express.js");
    if (deps.includes("next")) frameworks.push("Next.js");
    if (deps.includes("nuxt")) frameworks.push("Nuxt.js");
    if (deps.includes("svelte")) frameworks.push("Svelte");
    if (deps.includes("fastapi")) frameworks.push("FastAPI");
    if (deps.includes("django")) frameworks.push("Django");
    if (deps.includes("flask")) frameworks.push("Flask");
  }

  if (files.some((f) => f.includes("requirements.txt"))) {
    // Could add Python framework detection from requirements.txt content
  }

  return frameworks;
};

const detectDeployment = (files, packageData) => {
  const deployment = [];

  if (files.some((f) => f.includes("Dockerfile"))) deployment.push("Docker");
  if (files.some((f) => f.includes("docker-compose")))
    deployment.push("Docker Compose");
  if (files.some((f) => f.includes("vercel.json"))) deployment.push("Vercel");
  if (files.some((f) => f.includes("netlify.toml"))) deployment.push("Netlify");
  if (files.some((f) => f.includes(".github/workflows")))
    deployment.push("GitHub Actions");
  if (files.some((f) => f.includes("heroku"))) deployment.push("Heroku");
  if (packageData?.scripts?.build) deployment.push("Static Build");

  return deployment;
};

const getTemplatePrompt = (templateType) => {
  const templates = {
    comprehensive: `
Create a comprehensive README with ALL sections including:
1. Project title
2. Horizontal badge row (license, stars, forks, language, build status) - ALL ON ONE LINE
3. Detailed project overview with value proposition
4. Feature list with descriptions and checkboxes
5. Live demo links and screenshots section
6. Complete installation guide for multiple environments
7. Detailed usage examples with code snippets
8. API documentation if applicable
9. Configuration and environment variables
10. Testing instructions and coverage
11. Deployment guide for multiple platforms
12. Contributing guidelines with development setup
13. Roadmap and future plans
14. FAQ and troubleshooting
15. License and legal information
16. Acknowledgments and credits
17. Contact and support information

IMPORTANT: Ensure ALL badges are placed horizontally on a single line immediately after the title.
    `,

    startup: `
Create a startup-focused README emphasizing:
1. Project title with horizontal badge row (license, stars, demo status) - ALL ON ONE LINE
2. Problem statement and solution
3. Key features and benefits for users
4. Live demo and screenshots
5. Quick start guide for immediate value
6. User testimonials or social proof section
7. Monetization model if applicable
8. Market validation and metrics
9. Team information and background
10. Investor information if open source
11. Community and social media links

IMPORTANT: Place ALL badges horizontally on one line after the title.
    `,

    library: `
Create a library-focused README with:
1. Library title with horizontal badges (license, npm version, downloads, build) - ALL ON ONE LINE
2. Clear description of what the library does
3. Installation instructions for multiple package managers
4. Quick start examples with common use cases
5. Complete API documentation with parameters
6. Code examples for different scenarios
7. Browser and Node.js compatibility
8. TypeScript definitions if applicable
9. Performance benchmarks
10. Comparison with similar libraries
11. Contributing guidelines for library maintainers

IMPORTANT: Ensure badges are displayed horizontally in a single row.
    `,

    open_source: `
Create an open-source focused README with:
1. Project title with horizontal badges (license, contributors, build status) - ALL ON ONE LINE
2. Project mission and vision
3. Community guidelines and code of conduct
4. Detailed contributing instructions
5. Issue templates and bug reporting
6. Development environment setup
7. Testing and quality assurance
8. Release process and versioning
9. Community recognition and contributors
10. Governance and decision-making process
11. Sponsorship and funding information

IMPORTANT: Display all badges horizontally on one line.
    `,

    portfolio: `
Create a portfolio-focused README showcasing:
1. Project title with horizontal badges (demo, license, tech stack) - ALL ON ONE LINE
2. Project overview and personal motivation
3. Technologies and skills demonstrated
4. Key features and innovative aspects
5. Live demo with multiple deployment links
6. Screenshots and visual demonstrations
7. Development process and challenges overcome
8. Lessons learned and skills gained
9. Future improvements and iterations
10. Related projects and portfolio links
11. Contact information and social profiles

IMPORTANT: Badges must be arranged horizontally on a single line.
    `,

    academic: `
Create an academic-focused README with:
1. Research title with horizontal badges (license, DOI, publication status) - ALL ON ONE LINE
2. Research abstract and objectives
3. Methodology and experimental design
4. Dataset description and sources
5. Results and findings summary
6. Installation for research reproduction
7. Code structure and algorithm explanation
8. Citation information and BibTeX
9. Related publications and papers
10. Acknowledgments to advisors and institutions
11. Future research directions

IMPORTANT: Display badges horizontally in one row after the title.
    `,

    enterprise: `
Create an enterprise-focused README with:
1. Product title with horizontal badges (license, version, security status) - ALL ON ONE LINE
2. Business value proposition
3. Security and compliance information
4. Enterprise installation and deployment
5. Scalability and performance metrics
6. Integration with enterprise systems
7. Support and SLA information
8. Documentation and training resources
9. Change management and updates
10. Backup and disaster recovery
11. Vendor contact and procurement information

IMPORTANT: All badges should be on the same horizontal line.
    `,

    minimalist: `
Create a clean, minimalist README with only essentials:
1. Project title with essential horizontal badges (license, stars) - ALL ON ONE LINE
2. Brief project description (2-3 sentences)
3. Quick installation (1-2 commands)
4. Basic usage example
5. Link to documentation if exists
6. License information
7. Contact or issues link

Keep it clean, scannable, and under 100 lines. IMPORTANT: Badges must be horizontal.
    `,
  };

  return templates[templateType] || templates.comprehensive;
};

// Export templates for UI
export { TEMPLATES, detectRepositoryType };
