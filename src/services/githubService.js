const GITHUB_API_BASE_URL = "https://api.github.com";

export const fetchRepoDetails = async (username, repo) => {
  try {
    // Fetch main repository data
    const repoResponse = await fetch(
      `${GITHUB_API_BASE_URL}/repos/${username}/${repo}`
    );
    if (!repoResponse.ok) {
      throw new Error("Failed to fetch repository details");
    }
    const repoData = await repoResponse.json();

    // Fetch additional data in parallel
    const [
      languagesResponse,
      contributorsResponse,
      releasesResponse,
      contentsResponse,
    ] = await Promise.all([
      fetch(`${GITHUB_API_BASE_URL}/repos/${username}/${repo}/languages`),
      fetch(`${GITHUB_API_BASE_URL}/repos/${username}/${repo}/contributors`),
      fetch(`${GITHUB_API_BASE_URL}/repos/${username}/${repo}/releases`),
      fetch(`${GITHUB_API_BASE_URL}/repos/${username}/${repo}/contents`),
    ]);

    // Parse responses (ignore errors for optional data)
    const languages = languagesResponse.ok
      ? await languagesResponse.json()
      : {};
    const contributors = contributorsResponse.ok
      ? await contributorsResponse.json()
      : [];
    const releases = releasesResponse.ok ? await releasesResponse.json() : [];
    const contents = contentsResponse.ok ? await contentsResponse.json() : [];

    // Check for common files
    const packageJson = contents.find((file) => file.name === "package.json");
    const requirements = contents.find(
      (file) => file.name === "requirements.txt"
    );
    const dockerfile = contents.find((file) => file.name === "Dockerfile");
    const makefile = contents.find((file) => file.name === "Makefile");
    const gemfile = contents.find((file) => file.name === "Gemfile");
    const composerJson = contents.find((file) => file.name === "composer.json");
    const setupPy = contents.find((file) => file.name === "setup.py");

    // Fetch package.json for Node.js projects
    let packageData = null;
    if (packageJson) {
      try {
        const packageResponse = await fetch(
          `${GITHUB_API_BASE_URL}/repos/${username}/${repo}/contents/package.json`
        );
        if (packageResponse.ok) {
          const packageContent = await packageResponse.json();
          packageData = JSON.parse(atob(packageContent.content));
        }
      } catch (error) {
        console.warn("Could not fetch package.json:", error);
      }
    }

    return {
      ...repoData,
      languages,
      contributors: contributors.slice(0, 10), // Limit to top 10 contributors
      releases: releases.slice(0, 5), // Limit to latest 5 releases
      hasPackageJson: !!packageJson,
      hasRequirements: !!requirements,
      hasDockerfile: !!dockerfile,
      hasMakefile: !!makefile,
      hasGemfile: !!gemfile,
      hasComposerJson: !!composerJson,
      hasSetupPy: !!setupPy,
      packageData,
      files: contents.map((file) => file.name),
    };
  } catch (error) {
    throw new Error(`Failed to fetch repository details: ${error.message}`);
  }
};
