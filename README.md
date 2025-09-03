# Advanced GitHub README Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC.svg)](https://tailwindcss.com/)

A powerful, modern web application that generates comprehensive, professional README files for GitHub repositories using Google Gemini AI and GitHub API integration.

## ✨ Features

### 🚀 Advanced README Generation

- **Comprehensive Analysis**: Fetches detailed repository data including languages, contributors, releases, and file structure
- **AI-Powered Content**: Uses Google Gemini AI to generate intelligent, context-aware README content
- **Professional Structure**: Creates README files with 18+ sections including badges, table of contents, and detailed documentation

### 📊 Repository Intelligence

- **Language Detection**: Automatically identifies tech stack and programming languages
- **Dependency Analysis**: Detects package.json, requirements.txt, Dockerfile, and other configuration files
- **Release Information**: Includes latest releases and version history
- **Contributor Recognition**: Lists top contributors and collaboration details

### 🎨 Modern User Experience

- **Responsive Design**: Beautiful, mobile-friendly interface with Tailwind CSS
- **Live Preview**: Toggle between markdown source and rendered preview
- **Copy & Download**: Easy copy-to-clipboard and direct download functionality
- **Real-time Feedback**: Loading states, error handling, and success notifications

### 📋 Generated README Sections

1. **Header with Professional Badges** - License, build status, stars, forks, language
2. **Project Description** - Comprehensive overview and value proposition
3. **Table of Contents** - Clickable navigation for easy browsing
4. **Features List** - Detailed feature breakdown with visual elements
5. **Demo/Screenshots** - Placeholders for visual content
6. **Prerequisites** - System requirements and dependencies
7. **Installation & Setup** - Multi-method installation guides
8. **Usage Examples** - Code snippets and practical examples
9. **Configuration** - Environment variables and customization
10. **API Documentation** - Endpoint descriptions (if applicable)
11. **Contributing Guidelines** - Development setup and contribution process
12. **Testing Information** - Test running and coverage details
13. **Deployment Guide** - Platform-specific deployment instructions
14. **Roadmap** - Future plans and upcoming features
15. **FAQ & Troubleshooting** - Common questions and solutions
16. **License Information** - Legal details and permissions
17. **Acknowledgments** - Credits and third-party libraries
18. **Contact & Support** - Maintainer info and community links

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 with modern hooks
- **Styling**: Tailwind CSS 3.4.4 for responsive design
- **Build Tool**: Vite 5.3.1 for fast development and builds
- **Icons**: React Icons for beautiful UI elements
- **Markdown**: React Markdown for live preview rendering
- **AI Integration**: Google Gemini AI for intelligent content generation
- **API**: GitHub REST API for comprehensive repository data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher) or **yarn**
- **Google Gemini API Key** for README generation

## ⚡ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sandunMadhushan/repo-readme-generator.git
cd repo-readme-generator
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

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

1. **Open the Application**: Navigate to `http://localhost:5173` in your browser
2. **Enter Repository Details**:
   - GitHub username (e.g., "octocat")
   - Repository name (e.g., "Hello-World")
3. **Generate README**: Click "Generate Advanced README" button
4. **Review & Customize**: The app will analyze the repository and generate a comprehensive README
5. **Export**: Use the copy or download buttons to save your README

### Example Usage

```
Username: facebook
Repository: react
Result: Comprehensive README with React-specific features, installation guides, and community information
```

## ⚙️ Configuration

### Environment Variables

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for README generation

### Customization Options

- Modify prompts in `src/services/geminiService.js` for different README styles
- Adjust UI components in `src/App.jsx` for custom layouts
- Update styling in `src/App.css` and Tailwind configuration

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
   - `VITE_GEMINI_API_KEY` = `your_gemini_api_key_here`
4. **Build Settings** (if using GitHub integration):
   - Build command: `npm run build`
   - Publish directory: `dist`

### Other Platforms

- **Vercel**: Connect GitHub repository and add `VITE_GEMINI_API_KEY` environment variable
- **GitHub Pages**: Use GitHub Actions with the build output
- **Docker**: Use the included configurations for containerized deployment

## 🗺️ Roadmap

- [ ] **Template System**: Pre-built README templates for different project types
- [ ] **Multi-language Support**: Generate READMEs in different languages
- [ ] **Custom Sections**: Allow users to add custom sections and content
- [ ] **GitHub Integration**: Direct commit to repository functionality
- [ ] **Batch Processing**: Generate READMEs for multiple repositories
- [ ] **Analytics**: Track README generation statistics
- [ ] **Team Collaboration**: Share and collaborate on README templates

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
- **GitHub**: [Repository Issues](https://github.com/sandunMadhushan/repo-readme-generator/issues)
- **Email**: For direct support and collaboration opportunities

---

**Made with ❤️ by the Open Source Community**

_Generate professional READMEs that make your projects shine! ⭐_
