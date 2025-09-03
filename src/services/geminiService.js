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

Make the README highly specific to this repository type, include relevant badges, and ensure all sections are tailored to the detected technology stack and project complexity.`;

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
1. Detailed project overview with value proposition
2. Feature list with descriptions and checkboxes
3. Live demo links and screenshots section
4. Complete installation guide for multiple environments
5. Detailed usage examples with code snippets
6. API documentation if applicable
7. Configuration and environment variables
8. Testing instructions and coverage
9. Deployment guide for multiple platforms
10. Contributing guidelines with development setup
11. Roadmap and future plans
12. FAQ and troubleshooting
13. License and legal information
14. Acknowledgments and credits
15. Contact and support information
    `,

    startup: `
Create a startup-focused README emphasizing:
1. Problem statement and solution
2. Key features and benefits for users
3. Live demo and screenshots
4. Quick start guide for immediate value
5. User testimonials or social proof section
6. Monetization model if applicable
7. Market validation and metrics
8. Team information and background
9. Investor information if open source
10. Community and social media links
    `,

    library: `
Create a library-focused README with:
1. Clear description of what the library does
2. Installation instructions for multiple package managers
3. Quick start examples with common use cases
4. Complete API documentation with parameters
5. Code examples for different scenarios
6. Browser and Node.js compatibility
7. TypeScript definitions if applicable
8. Performance benchmarks
9. Comparison with similar libraries
10. Contributing guidelines for library maintainers
    `,

    open_source: `
Create an open-source focused README with:
1. Project mission and vision
2. Community guidelines and code of conduct
3. Detailed contributing instructions
4. Issue templates and bug reporting
5. Development environment setup
6. Testing and quality assurance
7. Release process and versioning
8. Community recognition and contributors
9. Governance and decision-making process
10. Sponsorship and funding information
    `,

    portfolio: `
Create a portfolio-focused README showcasing:
1. Project overview and personal motivation
2. Technologies and skills demonstrated
3. Key features and innovative aspects
4. Live demo with multiple deployment links
5. Screenshots and visual demonstrations
6. Development process and challenges overcome
7. Lessons learned and skills gained
8. Future improvements and iterations
9. Related projects and portfolio links
10. Contact information and social profiles
    `,

    academic: `
Create an academic-focused README with:
1. Research abstract and objectives
2. Methodology and experimental design
3. Dataset description and sources
4. Results and findings summary
5. Installation for research reproduction
6. Code structure and algorithm explanation
7. Citation information and BibTeX
8. Related publications and papers
9. Acknowledgments to advisors and institutions
10. Future research directions
    `,

    enterprise: `
Create an enterprise-focused README with:
1. Business value proposition
2. Security and compliance information
3. Enterprise installation and deployment
4. Scalability and performance metrics
5. Integration with enterprise systems
6. Support and SLA information
7. Documentation and training resources
8. Change management and updates
9. Backup and disaster recovery
10. Vendor contact and procurement information
    `,

    minimalist: `
Create a clean, minimalist README with only essentials:
1. Brief project description (2-3 sentences)
2. Quick installation (1-2 commands)
3. Basic usage example
4. Link to documentation if exists
5. License information
6. Contact or issues link
Keep it clean, scannable, and under 100 lines.
    `,
  };

  return templates[templateType] || templates.comprehensive;
};

// Export templates for UI
export { TEMPLATES, detectRepositoryType };
