import { useState } from "react";
import { fetchRepoDetails } from "./services/githubService";
import { generateReadme } from "./services/geminiService";
import { FaGithub, FaDownload, FaCopy, FaEye, FaCode } from "react-icons/fa";
import LaunchSVG from "./assets/Launch_SVG_Dark.svg";
import "./App.css";
import ReactMarkdown from "react-markdown";

function App() {
  const [username, setUsername] = useState("");
  const [repo, setRepo] = useState("");
  const [readme, setReadme] = useState("");
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("preview"); // "preview" or "markdown"
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFetchRepoDetails = async () => {
    if (!username.trim() || !repo.trim()) {
      setError("Please enter both username and repository name");
      return;
    }

    setLoading(true);
    setError("");
    setReadme("");
    setRepoData(null);

    try {
      const details = await fetchRepoDetails(username, repo);
      setRepoData(details);
      const generatedReadme = await generateReadme(details);
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
    <div className="mx-auto container p-5 max-w-6xl">
      <div className="flex justify-center items-center pb-5">
        <div className="image-container">
          <img className="svg-image" src={LaunchSVG} alt="Launch SVG" />
          <FaGithub className="github-logo text-5xl" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Advanced GitHub README Generator
        </h1>
        <p className="text-xl font-medium mb-4 text-gray-300">
          Generate comprehensive, professional README files powered by Google
          Gemini AI with advanced features, badges, and detailed sections for
          your GitHub repositories
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-600 p-3 bg-gray-700 rounded-md text-purple-300 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="GitHub Username (e.g., octocat)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            type="text"
            className="flex-1 border border-gray-600 p-3 bg-gray-700 rounded-md text-purple-300 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Repository Name (e.g., Hello-World)"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="px-6 py-3 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleFetchRepoDetails}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Advanced README"}
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-300">
              Analyzing repository with Gemini AI and generating comprehensive
              README...
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {repoData && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-green-400">
            Repository Analysis Complete
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Name:</span>{" "}
              <span className="text-white">{repoData.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Language:</span>{" "}
              <span className="text-white">
                {repoData.language || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Stars:</span>{" "}
              <span className="text-white">{repoData.stargazers_count}</span>
            </div>
            <div>
              <span className="text-gray-400">Forks:</span>{" "}
              <span className="text-white">{repoData.forks_count}</span>
            </div>
            <div>
              <span className="text-gray-400">Issues:</span>{" "}
              <span className="text-white">{repoData.open_issues_count}</span>
            </div>
            <div>
              <span className="text-gray-400">License:</span>{" "}
              <span className="text-white">
                {repoData.license?.name || "Not specified"}
              </span>
            </div>
          </div>
        </div>
      )}

      {readme && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-700 border-b border-gray-600">
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
                className="px-3 py-1 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                onClick={handleDownloadReadme}
              >
                <FaDownload className="inline mr-1" /> Download
              </button>
            </div>
          </div>

          <div className="p-6">
            {viewMode === "preview" ? (
              <ReactMarkdown className="markdown prose prose-invert max-w-none">
                {readme}
              </ReactMarkdown>
            ) : (
              <pre className="bg-gray-900 p-4 rounded text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                {readme}
              </pre>
            )}
          </div>
        </div>
      )}

      <footer className="text-center mt-12 pt-8 border-t border-gray-700">
        <p className="text-md font-medium text-gray-400">
          Developed with ❤️ by{" "}
          <a
            className="text-purple-400 hover:text-purple-300 font-semibold"
            href="https://github.com/sandunMadhushan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sandun Madhushan
          </a>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Enhanced with advanced features, comprehensive analysis, and modern UI
        </p>
      </footer>
    </div>
  );
}

export default App;
