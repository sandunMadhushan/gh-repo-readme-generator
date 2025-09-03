# README Studio - GitHub Repository README Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/) [![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF.svg)](https://vitejs.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC.svg)](https://tailwindcss.com/) [![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)

A powerful, modern web application called **README Studio** that generates comprehensive, professional README files for GitHub repositories using Google Gemini AI and GitHub API integration. Create stunning, professional README files with AI-powered intelligence and modern design.

## ✨ Features

### 🚀 AI-Powered README Generation

- **Smart Repository Analysis**: Automatically fetches detailed repository data including languages, contributors, releases, and file structure
- **Intelligent Content Generation**: Uses Google Gemini AI to create context-aware, repository-specific README content
- **Template-Based System**: 8 different README templates (Comprehensive, Startup/MVP, Library/Package, Open Source, Portfolio, Academic, Enterprise, Minimalist)
- **Auto-Detection**: Automatically detects repository type and suggests the most appropriate template

### 📊 Advanced Repository Intelligence

- **Technology Stack Detection**: Identifies programming languages, frameworks, and tools used
- **Dependency Analysis**: Detects package.json, requirements.txt, Dockerfile, and other configuration files
- **Project Complexity Assessment**: Analyzes project structure and provides insights
- **Activity Monitoring**: Checks repository maintenance status and activity levels

### 🎨 Modern User Experience

- **Full-Screen Responsive Design**: Optimized for all screen sizes and devices
- **Dual Input Modes**: Support for both username/repo input and direct GitHub URL
- **Live Preview & Markdown View**: Toggle between rendered preview and raw markdown
- **Copy & Download Functionality**: Easy export options for generated README files
- **Real-time Feedback**: Loading states, error handling, and success notifications

### 📋 Comprehensive README Sections

Generated READMEs include up to 18+ professional sections:

1. **Horizontal Badge Display** - License, stars, forks, build status, language badges
2. **Project Overview** - Description, value proposition, and key highlights
3. **Table of Contents** - Clickable navigation for easy browsing
4. **Feature Showcase** - Detailed feature breakdown with visual elements
5. **Live Demo Links** - Deployment and demonstration URLs
6. **Installation Guides** - Multi-platform setup instructions
7. **Usage Examples** - Code snippets and practical implementations
8. **API Documentation** - Endpoint descriptions and parameters (when applicable)
9. **Configuration** - Environment variables and customization options
10. **Testing Instructions** - Test running and coverage information
11. **Deployment Guides** - Platform-specific deployment instructions
12. **Contributing Guidelines** - Development setup and collaboration process
13. **Roadmap & Future Plans** - Project direction and upcoming features
14. **FAQ & Troubleshooting** - Common questions and solutions
15. **License Information** - Legal details and permissions
16. **Acknowledgments** - Credits and third-party libraries
17. **Contact & Support** - Maintainer information and community links
18. **Repository Statistics** - Stars, forks, issues, and activity metrics

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1 with modern hooks and functional components
- **Styling**: Tailwind CSS 3.4.4 for responsive, utility-first design
- **Build Tool**: Vite 5.3.1 for fast development and optimized builds
- **UI Icons**: React Icons 5.2.1 for beautiful, scalable iconography
- **Markdown Rendering**: React Markdown 9.0.1 with GitHub Flavored Markdown support
- **Markdown Extensions**: remark-gfm 4.0.1 for tables, strikethrough, and more
- **AI Integration**: Google Gemini AI API for intelligent content generation
- **API Integration**: GitHub REST API for comprehensive repository data
- **Analytics**: Vercel Analytics for usage tracking
- **Animation**: Framer Motion 11.2.12 for smooth animations
- **Deployment**: Netlify with automatic deployments

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher) or **yarn**
- **Google Gemini API Key** for README generation

## ⚡ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sandunMadhushan/gh-repo-readme-generator.git
cd gh-repo-readme-generator
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with your Google Gemini API key:

```env
# Google Gemini API Configuration
VITE_GEMINI_API_KEY=AIzaSyAeAUwb3kqltS3yImBdRIz2oLMOni3uAvs
```

**Note**: Replace the API key above with your own valid Google Gemini API key. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

### 5. Build for Production

```bash
npm run build
# or
yarn build
```

## 🚀 Usage

1. **Open the Application**: Navigate to `http://localhost:5174` in your browser (Vite may use different ports if 5173 is occupied)
2. **Choose Input Method**:
   - **Username & Repo**: Enter GitHub username and repository name separately
   - **Repository URL**: Paste the complete GitHub repository URL
3. **Select Template Style**: Choose from 8 available templates or use auto-detect (recommended)
4. **Generate README**: Click "Generate README Studio" button
5. **Review Content**: The app analyzes the repository and generates a comprehensive README
6. **Preview & Edit**: Toggle between preview and markdown view
7. **Export**: Use copy or download buttons to save your README

### Input Examples

**Username & Repo Mode:**

```
Username: facebook
Repository: react
```

**Repository URL Mode:**

```
URL: https://github.com/facebook/react
URL: https://github.com/vercel/next.js
URL: https://github.com/microsoft/vscode
```

### Template Types

- 🤖 **Auto-Detect** (Recommended) - Intelligently selects the best template
- 📚 **Comprehensive** - Complete README with all possible sections
- 🚀 **Startup/MVP** - Focus on product features and user acquisition
- 🌟 **Open Source** - Emphasizes community and collaboration
- 📦 **Library/Package** - API documentation and usage examples
- 💼 **Portfolio** - Showcase skills and technologies
- 🎓 **Academic/Research** - Research methodology and citations
- 🏢 **Enterprise** - Professional documentation with compliance focus
- ✨ **Minimalist** - Clean, simple README with essentials only

## ⚙️ Configuration

### Environment Variables

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for README generation
  - **Required**: Yes
  - **Format**: String (API key from Google AI Studio)
  - **Example**: `AIzaSyAeAUwb3kqltS3yImBdRIz2oLMOni3uAvs`

### Customization Options

- **AI Prompts**: Modify templates in `src/services/geminiService.js` for different README styles
- **UI Components**: Adjust interface elements in `src/App.jsx` for custom layouts
- **Styling**: Update visual design in `src/App.css` and Tailwind configuration
- **Badge Formatting**: Customize badge generation in the AI prompt templates
- **Template System**: Add new README templates or modify existing ones

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style Guidelines

- Use ES6+ JavaScript features
- Follow React best practices and hooks patterns
- Maintain consistent code formatting with Prettier
- Write descriptive commit messages

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run development server
npm run dev

# Build and preview production
npm run build && npm run preview
```

## 🚀 Deployment

### Netlify (Recommended)

1. **Build the project**: Run `npm run build` to create the production build
2. **Deploy to Netlify**:
   - Option 1: Drag and drop the `dist` folder to Netlify's deploy interface
   - Option 2: Connect your GitHub repository for automatic deployments
3. **Add Environment Variables**: In Netlify dashboard, go to Site settings > Environment variables and add:
   - `VITE_GEMINI_API_KEY` = `AIzaSyAeAUwb3kqltS3yImBdRIz2oLMOni3uAvs`
4. **Build Settings** (if using GitHub integration):
   - Build command: `npm run build`
   - Publish directory: `dist`

### Other Platforms

- **Vercel**: Connect GitHub repository and add `VITE_GEMINI_API_KEY` environment variable
- **GitHub Pages**: Use GitHub Actions with the build output
- **Docker**: Use the included configurations for containerized deployment

## 🗺️ Roadmap

- [x] **Template System**: 8 pre-built README templates for different project types
- [x] **Repository Analysis**: Advanced GitHub API integration with comprehensive data
- [x] **Badge Generation**: Horizontal badge formatting for professional appearance
- [x] **Responsive Design**: Full-screen layout optimized for all devices
- [x] **Markdown Tables**: Proper table rendering with GitHub Flavored Markdown
- [ ] **Multi-language Support**: Generate READMEs in different languages
- [ ] **Custom Sections**: Allow users to add custom sections and content
- [ ] **GitHub Integration**: Direct commit to repository functionality
- [ ] **Batch Processing**: Generate READMEs for multiple repositories
- [ ] **Analytics Dashboard**: Track README generation statistics
- [ ] **Team Collaboration**: Share and collaborate on README templates
- [ ] **Export Formats**: Support for PDF, HTML, and other formats
- [ ] **Integration APIs**: REST API for programmatic README generation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google** for providing the Gemini AI API for intelligent content generation
- **GitHub** for the comprehensive REST API
- **React Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool
- **All Contributors** who have helped improve this project

## 📞 Contact & Support

- **Developer**: [Sandun Madhushan](https://github.com/sandunMadhushan)
- **GitHub Repository**: [gh-repo-readme-generator](https://github.com/sandunMadhushan/gh-repo-readme-generator)
- **Issues & Bug Reports**: [GitHub Issues](https://github.com/sandunMadhushan/gh-repo-readme-generator/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/sandunMadhushan/gh-repo-readme-generator/discussions)
- **Email**: For direct support and collaboration opportunities

### Support the Project

If you find README Studio helpful, please consider:

- ⭐ **Starring** the repository on GitHub
- 🐛 **Reporting bugs** or suggesting features
- 🤝 **Contributing** to the codebase
- 📢 **Sharing** with other developers

---

**Made with ❤️ by [Sandun Madhushan](https://github.com/sandunMadhushan)**

_Create stunning, professional READMEs that make your repositories shine! ✨_
