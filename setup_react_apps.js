const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apps = [
  'Assignment_17_Counter_App',
  'Assignment_18_React_Todo_App',
  'Assignment_19_React_Weather_App'
];

const packageJson = (name) => `{
  "name": "${name.toLowerCase().replace(/_/g, '-')}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "vite": "^5.2.0"
  }
}`;

const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`;

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

const appJsx = `import './App.css'

function App() {
  return (
    <>
      <h1>React App</h1>
    </>
  )
}

export default App
`;

const indexCss = ``;
const appCss = ``;

apps.forEach(app => {
  const root = path.join(__dirname, app);
  const src = path.join(root, 'src');

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }
  if (!fs.existsSync(src)) {
    fs.mkdirSync(src);
  }

  fs.writeFileSync(path.join(root, 'package.json'), packageJson(app));
  fs.writeFileSync(path.join(root, 'vite.config.js'), viteConfig);
  fs.writeFileSync(path.join(root, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(src, 'main.jsx'), mainJsx);
  fs.writeFileSync(path.join(src, 'App.jsx'), appJsx);
  fs.writeFileSync(path.join(src, 'index.css'), indexCss);
  fs.writeFileSync(path.join(src, 'App.css'), appCss);

  console.log(`Created boilerplate for ${app}`);
  console.log(`Running npm install in ${app}`);
  try {
    execSync('npm install', { cwd: root, stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to install dependencies for ${app}`);
  }
});

console.log('All done!');
