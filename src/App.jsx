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
  FaMagic,
  FaLink,
  FaUser,
  FaStar,
  FaCodeBranch,
  FaBug,
  FaFileAlt,
  FaPlay,
} from "react-icons/fa";
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
      const cleanUrl = url.replace(/\.git$/, ""); // Remove .git suffix if present
      const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);

      if (match) {
        return {
          username: match[1],
          repo: match[2],
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
        setError(
          "Invalid GitHub URL format. Please use: https://github.com/username/repository"
        );
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
    <div className="h-screen overflow-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-40 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-6 py-8 min-h-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-6 shadow-2xl">
            <FaMagic className="text-3xl text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4">
            README Studio
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Create stunning, professional README files with AI-powered
            intelligence and modern design
          </p>
        </div>

        {/* Main Input Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/[0.07] transition-all duration-300">
            {/* Input Mode Selection */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-black/30 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10">
                <button
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    inputMode === "separate"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setInputMode("separate")}
                >
                  <FaUser className="text-sm" />
                  Username & Repo
                </button>
                <button
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    inputMode === "link"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setInputMode("link")}
                >
                  <FaLink className="text-sm" />
                  Repository URL
                </button>
              </div>
            </div>

            {/* Input Fields */}
            {inputMode === "separate" ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FaUser className="text-purple-400" />
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-black/30"
                    placeholder="e.g., octocat"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FaCodeBranch className="text-cyan-400" />
                    Repository Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-black/30"
                    placeholder="e.g., Hello-World"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                  <FaLink className="text-purple-400" />
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-black/30"
                  placeholder="https://github.com/username/repository"
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            )}

            {/* Template Selection */}
            <div className="mb-8">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                <FaRobot className="text-green-400" />
                README Template Style
              </label>
              <div className="relative">
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full p-4 bg-black/20 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm appearance-none transition-all duration-300 hover:bg-black/30 cursor-pointer"
                >
                  <option value="auto" className="bg-gray-800">
                    🤖 Auto-Detect (Recommended)
                  </option>
                  {Object.values(TEMPLATES).map((template) => (
                    <option
                      key={template.id}
                      value={template.id}
                      className="bg-gray-800"
                    >
                      {template.icon} {template.name}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {selectedTemplate !== "auto" && (
                <p className="mt-2 text-sm text-gray-400">
                  {TEMPLATES[selectedTemplate]?.description}
                </p>
              )}
              {detectedTemplate && selectedTemplate === "auto" && (
                <div className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-green-300 flex items-center gap-2">
                    <FaRobot />
                    Auto-detected: {TEMPLATES[detectedTemplate]?.name} -{" "}
                    {TEMPLATES[detectedTemplate]?.description}
                  </p>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg shadow-lg"
              onClick={handleFetchRepoDetails}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Magic...</span>
                </>
              ) : (
                <>
                  <FaPlay className="text-lg" />
                  <span>Generate README Studio</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaBug className="text-white text-sm" />
                </div>
                <div>
                  <h3 className="text-red-300 font-semibold">
                    Oops! Something went wrong
                  </h3>
                  <p className="text-red-200 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Repository Analysis */}
        {repoData && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/[0.07] transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <FaFileAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Repository Analysis
                  </h3>
                  <p className="text-gray-300">
                    Smart insights from your repository
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaStar className="text-yellow-400" />
                    <span className="text-gray-300 text-sm">Stars</span>
                  </div>
                  <div className="text-white font-bold text-lg">
                    {repoData.stargazers_count}
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCodeBranch className="text-blue-400" />
                    <span className="text-gray-300 text-sm">Forks</span>
                  </div>
                  <div className="text-white font-bold text-lg">
                    {repoData.forks_count}
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaBug className="text-red-400" />
                    <span className="text-gray-300 text-sm">Issues</span>
                  </div>
                  <div className="text-white font-bold text-lg">
                    {repoData.open_issues_count}
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCode className="text-purple-400" />
                    <span className="text-gray-300 text-sm">Language</span>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {repoData.language || "Mixed"}
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaFileAlt className="text-green-400" />
                    <span className="text-gray-300 text-sm">Files</span>
                  </div>
                  <div className="text-white font-bold text-lg">
                    {repoData.files?.length || 0}
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaRobot className="text-cyan-400" />
                    <span className="text-gray-300 text-sm">Type</span>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {TEMPLATES[detectedTemplate]?.name || "Unknown"}
                  </div>
                </div>
              </div>

              {/* Advanced Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaRobot className="text-purple-400" />
                    Smart Detection
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Docker Support</span>
                      <span
                        className={
                          repoData.hasDockerfile
                            ? "text-green-400"
                            : "text-gray-500"
                        }
                      >
                        {repoData.hasDockerfile ? "✅ Yes" : "❌ No"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Package Manager</span>
                      <span className="text-white">
                        {repoData.hasPackageJson
                          ? "📦 npm"
                          : repoData.hasRequirements
                          ? "🐍 pip"
                          : repoData.hasGemfile
                          ? "💎 gem"
                          : repoData.hasComposerJson
                          ? "🎼 composer"
                          : "❓ Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">License</span>
                      <span className="text-green-400">
                        {repoData.license?.name || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaCode className="text-cyan-400" />
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {repoData.languages ? (
                      Object.keys(repoData.languages)
                        .slice(0, 5)
                        .map((lang) => (
                          <span
                            key={lang}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white rounded-full text-sm border border-purple-500/30"
                          >
                            {lang}
                          </span>
                        ))
                    ) : (
                      <span className="text-gray-400">
                        No languages detected
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Last Updated</span>
                      <span className="text-white">
                        {repoData.updated_at
                          ? new Date(repoData.updated_at).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generated README Display */}
        {readme && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <FaFileAlt className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Generated README
                      </h2>
                      <p className="text-gray-300 text-sm">
                        Your professional documentation is ready!
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        viewMode === "preview"
                          ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg"
                          : "bg-black/30 text-gray-300 hover:bg-black/50 hover:text-white"
                      }`}
                      onClick={() => setViewMode("preview")}
                    >
                      <FaEye /> Preview
                    </button>
                    <button
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        viewMode === "markdown"
                          ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg"
                          : "bg-black/30 text-gray-300 hover:bg-black/50 hover:text-white"
                      }`}
                      onClick={() => setViewMode("markdown")}
                    >
                      <FaCode /> Markdown
                    </button>
                    <button
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        copySuccess
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                      onClick={handleCopyToClipboard}
                    >
                      <FaCopy /> {copySuccess ? "Copied!" : "Copy"}
                    </button>
                    <button
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
                      onClick={handleDownloadReadme}
                    >
                      <FaDownload /> Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {viewMode === "preview" ? (
                  <ReactMarkdown className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-200 prose-a:text-purple-400 prose-code:text-pink-300 prose-pre:bg-black/50">
                    {readme}
                  </ReactMarkdown>
                ) : (
                  <pre className="p-6 overflow-x-auto text-sm text-green-300 whitespace-pre-wrap bg-black/50 rounded-xl border border-white/10">
                    {readme}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaGithub className="text-2xl text-purple-400" />
            <span className="text-white font-semibold">README Studio</span>
          </div>
          <p className="text-gray-400 mb-2">
            Crafted with ❤️ using modern web technologies
          </p>
          <p className="text-gray-500 text-sm">
            Powered by AI • Built for developers • Designed for impact
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
