import { useState } from "react";
import { fetchRepoDetails } from "./services/githubService";
import {
  generateReadme,
  TEMPLATES,
  detectRepositoryType,
} from "./services/geminiService";
import {
  FaGithub,
  FaDownload,
  FaCopy,
  FaEye,
  FaCode,
  FaRobot,
  FaChevronDown,
} from "react-icons/fa";
import LaunchSVG from "./assets/Launch_SVG_Dark.svg";
import "./App.css";
import ReactMarkdown from "react-markdown";

function App() {
  const [username, setUsername] = useState("");
  const [repo, setRepo] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [inputMode, setInputMode] = useState("separate"); // "separate" or "link"
  const [readme, setReadme] = useState("");
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("preview"); // "preview" or "markdown"
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("auto"); // "auto" or template id
  const [detectedTemplate, setDetectedTemplate] = useState(null);

  const parseGitHubUrl = (url) => {
    try {
      // Handle different GitHub URL formats
      const cleanUrl = url.replace(/\.git$/, ''); // Remove .git suffix if present
      const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      
      if (match) {
        return {
          username: match[1],
          repo: match[2]
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleFetchRepoDetails = async () => {
    let actualUsername = username;
    let actualRepo = repo;

    // If using link mode, parse the URL
    if (inputMode === "link") {
      if (!repoLink.trim()) {
        setError("Please enter a GitHub repository URL");
        return;
      }
      
      const parsed = parseGitHubUrl(repoLink);
      if (!parsed) {
        setError("Invalid GitHub URL format. Please use: https://github.com/username/repository");
        return;
      }
      
      actualUsername = parsed.username;
      actualRepo = parsed.repo;
    } else {
      // Using separate fields mode
      if (!username.trim() || !repo.trim()) {
        setError("Please enter both username and repository name");
        return;
      }
    }

    setLoading(true);
    setError("");
    setReadme("");
    setRepoData(null);
    setDetectedTemplate(null);

    try {
      const details = await fetchRepoDetails(actualUsername, actualRepo);
      setRepoData(details);

      // Auto-detect template type
      const detected = detectRepositoryType(details);
      setDetectedTemplate(detected);

      // Use selected template or auto-detected
      const templateToUse =
        selectedTemplate === "auto" ? detected : selectedTemplate;

      const generatedReadme = await generateReadme(details, templateToUse);
      setReadme(generatedReadme);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const readmeText = readme.trim();
    if (readmeText) {
      try {
        await navigator.clipboard.writeText(readmeText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = readmeText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const handleDownloadReadme = () => {
    const readmeText = readme.trim();
    if (readmeText) {
      const blob = new Blob([readmeText], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "README.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleFetchRepoDetails();
    }
  };

  return (
    <div className="container max-w-6xl p-5 mx-auto">
      <div className="flex items-center justify-center pb-5">
        <div className="image-container">
          <img className="svg-image" src={LaunchSVG} alt="Launch SVG" />
          <FaGithub className="text-5xl github-logo" />
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Advanced GitHub README Generator
        </h1>
        <p className="mb-4 text-xl font-medium text-gray-300">
          Generate comprehensive, professional README files powered by Google
          Gemini AI with advanced features, badges, and detailed sections for
          your GitHub repositories
        </p>
      </div>

      <div className="p-6 mb-6 bg-gray-800 rounded-lg">
        {/* Input Mode Toggle */}
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-3">
            <label className="text-sm font-medium text-gray-300">Input Method:</label>
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  inputMode === "separate"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setInputMode("separate")}
              >
                Username + Repository
              </button>
              <button
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  inputMode === "link"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setInputMode("link")}
              >
                Repository Link
              </button>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        {inputMode === "separate" ? (
          <div className="flex flex-col gap-4 mb-4 md:flex-row">
            <input
              type="text"
              className="flex-1 p-3 font-semibold text-purple-300 placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="GitHub Username (e.g., octocat)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="text"
              className="flex-1 p-3 font-semibold text-purple-300 placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Repository Name (e.g., Hello-World)"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleFetchRepoDetails}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Advanced README"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-4 md:flex-row">
            <input
              type="text"
              className="flex-1 p-3 font-semibold text-purple-300 placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="GitHub Repository URL (e.g., https://github.com/octocat/Hello-World)"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleFetchRepoDetails}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Advanced README"}
            </button>
          </div>
        )}

        {/* Template Selection */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            <FaRobot className="inline mr-2" />
            README Template Style
          </label>
          <div className="relative">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full p-3 pr-10 font-semibold text-purple-300 bg-gray-700 border border-gray-600 rounded-md appearance-none md:w-auto focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="auto">🤖 Auto-Detect (Recommended)</option>
              {Object.values(TEMPLATES).map((template) => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
          </div>
          {selectedTemplate !== "auto" && (
            <p className="mt-2 text-sm text-gray-400">
              {TEMPLATES[selectedTemplate]?.description}
            </p>
          )}
          {detectedTemplate && selectedTemplate === "auto" && (
            <p className="mt-2 text-sm text-green-400">
              <FaRobot className="inline mr-1" />
              Auto-detected: {TEMPLATES[detectedTemplate]?.name} -{" "}
              {TEMPLATES[detectedTemplate]?.description}
            </p>
          )}
        </div>

        {loading && (
          <div className="py-4 text-center">
            <div className="inline-block w-8 h-8 border-b-2 border-purple-500 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-300">
              Analyzing repository with Gemini AI and generating comprehensive
              README...
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 mb-4 text-red-200 bg-red-900 border border-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {repoData && (
        <div className="p-6 mb-6 bg-gray-800 rounded-lg">
          <h3 className="mb-4 text-xl font-bold text-green-400">
            🔍 Repository Analysis Complete
          </h3>

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 mb-6 text-sm md:grid-cols-2 lg:grid-cols-3">
            <div>
              <span className="text-gray-400">Name:</span>{" "}
              <span className="font-medium text-white">{repoData.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Primary Language:</span>{" "}
              <span className="font-medium text-white">
                {repoData.language || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Stars:</span>{" "}
              <span className="font-medium text-yellow-400">
                ⭐ {repoData.stargazers_count}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Forks:</span>{" "}
              <span className="font-medium text-blue-400">
                🍴 {repoData.forks_count}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Issues:</span>{" "}
              <span className="font-medium text-red-400">
                🐛 {repoData.open_issues_count}
              </span>
            </div>
            <div>
              <span className="text-gray-400">License:</span>{" "}
              <span className="font-medium text-green-400">
                📄 {repoData.license?.name || "Not specified"}
              </span>
            </div>
          </div>

          {/* Advanced Analysis */}
          <div className="pt-4 border-t border-gray-700">
            <h4 className="mb-3 text-lg font-semibold text-purple-400">
              🧠 Smart Analysis
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-gray-400">Detected Type:</span>{" "}
                <span className="font-medium text-purple-300">
                  {TEMPLATES[detectedTemplate]?.icon}{" "}
                  {TEMPLATES[detectedTemplate]?.name || "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Languages:</span>{" "}
                <span className="text-white">
                  {repoData.languages
                    ? Object.keys(repoData.languages).slice(0, 3).join(", ")
                    : "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Files Count:</span>{" "}
                <span className="text-white">
                  {repoData.files?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Last Updated:</span>{" "}
                <span className="text-white">
                  {repoData.updated_at
                    ? new Date(repoData.updated_at).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Has Docker:</span>{" "}
                <span
                  className={
                    repoData.hasDockerfile ? "text-green-400" : "text-gray-500"
                  }
                >
                  {repoData.hasDockerfile ? "✅ Yes" : "❌ No"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Package Manager:</span>{" "}
                <span className="text-white">
                  {repoData.hasPackageJson
                    ? "📦 npm/yarn"
                    : repoData.hasRequirements
                    ? "🐍 pip"
                    : repoData.hasGemfile
                    ? "💎 gem"
                    : repoData.hasComposerJson
                    ? "🎼 composer"
                    : "❓ Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {readme && (
        <div className="overflow-hidden bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between p-4 bg-gray-700 border-b border-gray-600">
            <h2 className="text-xl font-bold text-white">Generated README</h2>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "preview"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
                onClick={() => setViewMode("preview")}
              >
                <FaEye className="inline mr-1" /> Preview
              </button>
              <button
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "markdown"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
                onClick={() => setViewMode("markdown")}
              >
                <FaCode className="inline mr-1" /> Markdown
              </button>
              <button
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  copySuccess
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                onClick={handleCopyToClipboard}
              >
                <FaCopy className="inline mr-1" />{" "}
                {copySuccess ? "Copied!" : "Copy"}
              </button>
              <button
                className="px-3 py-1 text-sm font-medium text-white transition-colors bg-green-600 rounded hover:bg-green-700"
                onClick={handleDownloadReadme}
              >
                <FaDownload className="inline mr-1" /> Download
              </button>
            </div>
          </div>

          <div className="p-6">
            {viewMode === "preview" ? (
              <ReactMarkdown className="prose markdown prose-invert max-w-none">
                {readme}
              </ReactMarkdown>
            ) : (
              <pre className="p-4 overflow-x-auto text-sm text-green-400 whitespace-pre-wrap bg-gray-900 rounded">
                {readme}
              </pre>
            )}
          </div>
        </div>
      )}

      <footer className="pt-8 mt-12 text-center border-t border-gray-700">
        <p className="font-medium text-gray-400 text-md">
          Developed with ❤️ by{" "}
          <a
            className="font-semibold text-purple-400 hover:text-purple-300"
            href="https://github.com/sandunMadhushan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sandun Madhushan
          </a>
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Enhanced with advanced features, comprehensive analysis, and modern UI
        </p>
      </footer>
    </div>
  );
}

export default App;
