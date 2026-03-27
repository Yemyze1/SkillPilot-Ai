const KNOWLEDGE_BASE = [
  {
    question: "what is javascript",
    explanation:
      "JavaScript is a programming language used to make websites interactive. It runs inside the browser and can change page content, respond to user actions, and communicate with servers.",
    example:
      "For example, when you click a button and something changes on the page without refreshing, that is usually JavaScript working behind the scenes.",
    hasCode: true,
    code: `button.addEventListener("click", () => {
  alert("Hello!");
});`,
    language: "javascript",
    quiz: {
      question: "Where does JavaScript usually run?",
      options: [
        "A) In the browser",
        "B) Inside Photoshop",
        "C) Only on servers",
        "D) In Excel",
      ],
      correct: 0,
    },
  },

  {
    question: "what is html",
    explanation:
      "HTML stands for HyperText Markup Language. It is the structure of a web page and tells the browser what elements exist like headings, paragraphs, images, and links.",
    example:
      "Think of HTML like the skeleton of a website. CSS is the design, and JavaScript is the brain.",
    hasCode: true,
    code: `<h1>Hello World</h1>
<p>This is my website</p>`,
    language: "html",
    quiz: {
      question: "What does HTML stand for?",
      options: [
        "A) Hyper Tool Machine Language",
        "B) HyperText Markup Language",
        "C) High Text Machine Language",
        "D) Hyper Tool Markup Level",
      ],
      correct: 1,
    },
  },

  {
    question: "what is css",
    explanation:
      "CSS is used to style web pages. It controls colors, spacing, layouts, fonts, and animations.",
    example:
      "Without CSS, websites would look like plain documents with no design.",
    hasCode: true,
    code: `h1 {
  color: blue;
  font-size: 32px;
}`,
    language: "css",
    quiz: {
      question: "What is CSS mainly used for?",
      options: [
        "A) Styling websites",
        "B) Creating databases",
        "C) Sending emails",
        "D) Running servers",
      ],
      correct: 0,
    },
  },

  {
    question: "what are html tags",
    explanation:
      "Html tags are elements that give structure to web pages. It include the p tag, h tag, b tag, ul tag, etc... Tags come with closing tags e.g </p> However some tags do not need a closing tag e.g '<img src>'",
    example:
      "Without tags, websites would look like unstructured.",
    hasCode: true,
    code: `h1 {
  This is a heading;
}`,
    language: "tag",
    quiz: {
      question: "What is tag mainly used for?",
      options: [
        "A) Styling websites",
        "B) Creating databases",
        "C) Structure a webpage",
        "D) Running servers",
      ],
      correct: 2,
    },
  },
  // ── NEW 3MTT ENTRIES (add these) ──
  {
    question: "what is an api",
    explanation: "API means Application Programming Interface. It lets different programs talk to each other, like a waiter taking your order to the kitchen.",
    example: "When you use a weather app, it calls a weather API to get the latest temperature without you seeing the backend code.",
    hasCode: true,
    code: `fetch("https://api.example.com/weather")\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    language: "javascript",
    quiz: {
      question: "What does API stand for?",
      options: ["A) Application Programming Interface", "B) Advanced Program Input", "C) Automatic Payment Interface", "D) Application Process Interrupt"],
      correct: 0
    }
  },
  {
    question: "what is rest api",
    explanation: "REST API is a popular way to build APIs using standard HTTP methods like GET, POST, PUT, DELETE.",
    example: "Fetching user data from a server is usually done with a GET request to a REST endpoint.",
    hasCode: true,
    code: `fetch("/api/users", { method: "GET" })\n  .then(res => res.json());`,
    language: "javascript",
    quiz: {
      question: "Which HTTP method is used to get data in REST?",
      options: ["A) POST", "B) GET", "C) DELETE", "D) UPDATE"],
      correct: 1
    }
  },
  {
    question: "what is react",
    explanation: "React is a JavaScript library for building fast and interactive user interfaces, especially single-page applications.",
    example: "Facebook, Instagram, and many modern websites use React to make their UI smooth and reusable.",
    hasCode: true,
    code: `function App() {\n  return <h1>Hello from React!</h1>;\n}`,
    language: "jsx",
    quiz: {
      question: "What is React mainly used for?",
      options: ["A) Backend logic", "B) Building user interfaces", "C) Database management", "D) Server configuration"],
      correct: 1
    }
  },
  {
    question: "what is usestate",
    explanation: "useState is a React hook that lets you add and manage state (data that can change) inside functional components.",
    example: "You can use useState to store a counter that increases when a button is clicked.",
    hasCode: true,
    code: `const [count, setCount] = useState(0);\n\n<button onClick={() => setCount(count + 1)}>Increment</button>`,
    language: "jsx",
    quiz: {
      question: "What does useState let you do in React?",
      options: ["A) Manage changing data", "B) Style components", "C) Connect to database", "D) Deploy the app"],
      correct: 0
    }
  },
  {
    question: "what is tailwind css",
    explanation: "Tailwind CSS is a utility-first CSS framework that lets you build modern designs directly in your HTML without writing custom CSS files.",
    example: "Instead of creating a .card class, you just write class='bg-white p-6 rounded-xl shadow'.",
    hasCode: true,
    code: `<div class="bg-blue-600 text-white p-4 rounded-lg">Hello Tailwind</div>`,
    language: "html",
    quiz: {
      question: "What kind of CSS framework is Tailwind?",
      options: ["A) Component-based", "B) Utility-first", "C) Bootstrap clone", "D) Sass only"],
      correct: 1
    }
  },
  {
    question: "what is git",
    explanation: "Git is a version control system that tracks changes in your code so you can go back to previous versions and work with a team safely.",
    example: "You can use git commit and git push to save your work and upload it to GitHub.",
    hasCode: true,
    code: `git add .\ngit commit -m "Added login page"\ngit push`,
    language: "bash",
    quiz: {
      question: "What is the main purpose of Git?",
      options: ["A) Styling", "B) Version control", "C) Deploying apps", "D) Writing tests"],
      correct: 1
    }
  },
  {
    question: "how to push code to github",
    explanation: "Pushing code to GitHub lets you store your project online, share it, and collaborate with others.",
    example: "After committing locally, you run git push origin main to send it to your GitHub repo.",
    hasCode: true,
    code: `git push origin main`,
    language: "bash",
    quiz: {
      question: "Which command sends your code to GitHub?",
      options: ["A) git pull", "B) git push", "C) git clone", "D) git fetch"],
      correct: 1
    }
  },
  {
    question: "what is responsive design",
    explanation: "Responsive design makes your website look good on phones, tablets, and desktops by using flexible layouts and media queries.",
    example: "A good responsive site will rearrange cards and shrink menus automatically on mobile.",
    hasCode: true,
    code: `@media (max-width: 600px) {\n  .container { flex-direction: column; }\n}`,
    language: "css",
    quiz: {
      question: "What does responsive design mean?",
      options: ["A) Only works on desktop", "B) Adapts to different screen sizes", "C) Uses only Tailwind", "D) Requires React"],
      correct: 1
    }
  },
  {
    question: "what is async await",
    explanation: "async/await is modern JavaScript syntax that makes working with promises easier and cleaner, especially when fetching data.",
    example: "You can wait for an API response without using .then chains.",
    hasCode: true,
    code: `async function getData() {\n  const res = await fetch("/api/data");\n  return await res.json();\n}`,
    language: "javascript",
    quiz: {
      question: "What is async/await used for?",
      options: ["A) Making code run faster", "B) Handling promises cleanly", "C) Styling pages", "D) Version control"],
      correct: 1
    }
  },
  {
    question: "what is vercel",
    explanation: "Vercel is a cloud platform that makes it super easy to deploy frontend apps (especially Next.js and React) with one click.",
    example: "You connect your GitHub repo to Vercel and it automatically deploys every time you push code.",
    hasCode: false,
    code: "",
    language: "",
    quiz: {
      question: "What is Vercel mainly used for?",
      options: ["A) Database hosting", "B) Deploying frontend apps", "C) Writing backend code", "D) Editing images"],
      correct: 1
    }
  },
  // ── MORE 3MTT ENTRIES (Add these) ──
  {
    question: "what is node.js",
    explanation: "Node.js is a JavaScript runtime that lets you run JavaScript on the server side, outside the browser. It is very popular for building backend APIs.",
    example: "You can create a server that handles user registration or fetches data from a database using Node.js.",
    hasCode: true,
    code: `const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Hello from Node.js!');\n});\n\napp.listen(3000);`,
    language: "javascript",
    quiz: {
      question: "What is Node.js mainly used for?",
      options: ["A) Styling websites", "B) Backend/server development", "C) Only frontend", "D) Database only"],
      correct: 1
    }
  },
  {
    question: "what is express.js",
    explanation: "Express.js is a fast and minimalist web framework for Node.js. It makes it easy to build APIs and web servers.",
    example: "Most 3MTT backend projects use Express to handle routes like /login or /users.",
    hasCode: true,
    code: `app.get('/api/users', (req, res) => {\n  res.json({ users: [] });\n});`,
    language: "javascript",
    quiz: {
      question: "Express.js is used with which runtime?",
      options: ["A) Python", "B) Node.js", "C) Java", "D) PHP"],
      correct: 1
    }
  },
  {
    question: "what is mongodb",
    explanation: "MongoDB is a NoSQL database that stores data in flexible JSON-like documents. It is popular for modern web apps.",
    example: "You can store user profiles, posts, and comments easily without fixed table structures.",
    hasCode: true,
    code: `db.users.find({ age: { $gt: 18 } })`,
    language: "javascript",
    quiz: {
      question: "What type of database is MongoDB?",
      options: ["A) SQL", "B) NoSQL", "C) Graph", "D) Spreadsheet"],
      correct: 1
    }
  },
  {
    question: "what is jwt",
    explanation: "JWT (JSON Web Token) is a secure way to send information between client and server, commonly used for user authentication.",
    example: "After login, the server sends a JWT token that the frontend stores and sends back with every request.",
    hasCode: true,
    code: `const token = jwt.sign({ userId: 123 }, 'secretkey');`,
    language: "javascript",
    quiz: {
      question: "What is JWT mainly used for?",
      options: ["A) Styling", "B) User authentication", "C) Database storage", "D) Deployment"],
      correct: 1
    }
  },
  {
    question: "what is useeffect in react",
    explanation: "useEffect is a React hook that runs side effects (like fetching data, setting timers) after a component renders.",
    example: "You can use useEffect to fetch user data when the page loads.",
    hasCode: true,
    code: `useEffect(() => {\n  fetchData();\n}, []);`,
    language: "jsx",
    quiz: {
      question: "What is useEffect used for?",
      options: ["A) Managing state", "B) Running side effects", "C) Styling", "D) Routing"],
      correct: 1
    }
  },
  {
    question: "what is flexbox",
    explanation: "Flexbox is a CSS layout model that makes it easy to align and distribute space between items in a container.",
    example: "You can quickly center items or create responsive navigation bars using Flexbox.",
    hasCode: true,
    code: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
    language: "css",
    quiz: {
      question: "What is Flexbox used for?",
      options: ["A) Database queries", "B) One-dimensional layouts", "C) 3D animations", "D) Server setup"],
      correct: 1
    }
  },
  {
    question: "what is grid in css",
    explanation: "CSS Grid is a powerful two-dimensional layout system for creating complex web layouts with rows and columns.",
    example: "You can build entire page layouts (header, sidebar, content, footer) easily with Grid.",
    hasCode: true,
    code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}`,
    language: "css",
    quiz: {
      question: "CSS Grid is best for what kind of layout?",
      options: ["A) One-dimensional", "B) Two-dimensional", "C) Only text", "D) Animations only"],
      correct: 1
    }
  },
  {
    question: "what is deployment",
    explanation: "Deployment means making your web app live on the internet so people can access it from anywhere.",
    example: "Popular platforms for deployment in 3MTT are Vercel, Netlify, and Render.",
    hasCode: false,
    code: "",
    language: "",
    quiz: {
      question: "What does deployment mean?",
      options: ["A) Writing code", "B) Making app live online", "C) Testing locally", "D) Styling only"],
      correct: 1
    }
  },
  {
    question: "explain promises in javascript",
    explanation: "A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation.",
    example: "Promises are used when fetching data from an API so the code doesn't block.",
    hasCode: true,
    code: `new Promise((resolve, reject) => {\n  // async work\n  resolve("Success");\n});`,
    language: "javascript",
    quiz: {
      question: "What is a Promise in JavaScript?",
      options: ["A) A guarantee of success", "B) Object for async operations", "C) A CSS property", "D) A database query"],
      correct: 1
    }
  },
  {
    question: "what is bootstrap",
    explanation: "Bootstrap is a popular CSS framework that provides ready-made components and responsive grid system.",
    example: "You can quickly build beautiful UIs using Bootstrap classes.",
    hasCode: true,
    code: `<div class="container">\n  <button class="btn btn-primary">Click me</button>\n</div>`,
    language: "html",
    quiz: {
      question: "Bootstrap is mainly a:",
      options: ["A) JavaScript library", "B) CSS framework", "C) Backend tool", "D) Database"],
      correct: 1
    }
  },
  {
    question: "what is postman",
    explanation: "Postman is a tool used to test APIs by sending requests and viewing responses easily.",
    example: "3MTT students use Postman to test their backend routes during projects.",
    hasCode: false,
    code: "",
    language: "",
    quiz: {
      question: "What is Postman used for?",
      options: ["A) Writing frontend code", "B) Testing APIs", "C) Designing UI", "D) Deploying apps"],
      correct: 1
    }
  },
  {
    question: "what is state in react",
    explanation: "State is data that can change over time in a React component and causes the UI to re-render when updated.",
    example: "User input, dark mode toggle, and shopping cart items are usually stored in state.",
    hasCode: true,
    code: `const [user, setUser] = useState(null);`,
    language: "jsx",
    quiz: {
      question: "What happens when state changes in React?",
      options: ["A) Nothing", "B) Component re-renders", "C) Page refreshes", "D) Server restarts"],
      correct: 1
    }
  },

    // ── BACKEND 3MTT ENTRIES (Node.js, Express, MongoDB) ──
  {
    question: "what is node.js",
    explanation: "Node.js is a JavaScript runtime that allows you to run JavaScript on the server side, outside the browser. It is fast and great for building scalable backend applications.",
    example: "Many 3MTT students use Node.js to create REST APIs that serve data to frontend apps.",
    hasCode: true,
    code: `const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, {'Content-Type': 'text/plain'});\n  res.end('Hello from Node.js!');\n});\nserver.listen(3000);`,
    language: "javascript",
    quiz: {
      question: "What is Node.js?",
      options: ["A) Frontend framework", "B) JavaScript runtime for server", "C) CSS library", "D) Database"],
      correct: 1
    }
  },
  {
    question: "what is express.js",
    explanation: "Express.js is a lightweight and flexible web framework for Node.js. It simplifies building APIs and web servers with clean routing.",
    example: "You can quickly create routes like /login or /users using Express.",
    hasCode: true,
    code: `const express = require('express');\nconst app = express();\n\napp.get('/api/users', (req, res) => {\n  res.json({ message: 'Users list' });\n});\n\napp.listen(3000);`,
    language: "javascript",
    quiz: {
      question: "Express.js is used for what?",
      options: ["A) Styling", "B) Building backend APIs", "C) Only frontend", "D) Database queries"],
      correct: 1
    }
  },
  {
    question: "what is mongodb",
    explanation: "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. It is popular because it scales well and works great with JavaScript.",
    example: "You can store user profiles, posts, and comments without rigid table structures.",
    hasCode: true,
    code: `db.users.insertOne({ name: "YemDev", track: "Software Dev" });`,
    language: "javascript",
    quiz: {
      question: "What type of database is MongoDB?",
      options: ["A) SQL", "B) NoSQL document database", "C) Graph database", "D) Key-value store"],
      correct: 1
    }
  },
  {
    question: "how to connect mongodb with node.js",
    explanation: "You connect MongoDB to Node.js using the MongoDB driver or Mongoose. Mongoose makes it easier with schema validation.",
    example: "Most 3MTT projects use Mongoose to interact with MongoDB.",
    hasCode: true,
    code: `const mongoose = require('mongoose');\nmongoose.connect('mongodb://localhost:27017/3mttdb')\n  .then(() => console.log('Connected to MongoDB'));`,
    language: "javascript",
    quiz: {
      question: "What is commonly used to connect MongoDB with Node.js?",
      options: ["A) fetch()", "B) Mongoose", "C) Tailwind", "D) React"],
      correct: 1
    }
  },
  {
    question: "what is mongoose",
    explanation: "Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation and easier querying.",
    example: "You define a User schema and then create, read, update, or delete users easily.",
    hasCode: true,
    code: `const userSchema = new mongoose.Schema({\n  name: String,\n  track: String\n});\nconst User = mongoose.model('User', userSchema);`,
    language: "javascript",
    quiz: {
      question: "What is Mongoose?",
      options: ["A) CSS framework", "B) ODM for MongoDB", "C) Frontend library", "D) Deployment tool"],
      correct: 1
    }
  },
  {
    question: "what is jwt authentication",
    explanation: "JWT (JSON Web Token) is a secure way to authenticate users. After login, the server sends a token that the client stores and sends back with every request.",
    example: "It is commonly used in 3MTT backend projects for protected routes.",
    hasCode: true,
    code: `const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);`,
    language: "javascript",
    quiz: {
      question: "What is JWT used for?",
      options: ["A) Styling", "B) User authentication", "C) Database connection", "D) Deployment"],
      correct: 1
    }
  },
  {
    question: "what is middleware in express",
    explanation: "Middleware in Express are functions that run between the request and response. They can check authentication, log requests, or parse JSON.",
    example: "You can create middleware to protect routes so only logged-in users can access them.",
    hasCode: true,
    code: `app.use((req, res, next) => {\n  console.log('Request received');\n  next();\n});`,
    language: "javascript",
    quiz: {
      question: "What are middleware in Express?",
      options: ["A) Database tables", "B) Functions between request and response", "C) CSS classes", "D) React components"],
      correct: 1
    }
  },
  {
    question: "what is dotenv",
    explanation: "dotenv is a package that loads environment variables from a .env file into process.env. It helps keep secret keys safe.",
    example: "You store your MongoDB URI and JWT secret in .env instead of hardcoding them.",
    hasCode: true,
    code: `require('dotenv').config();\nconst dbURI = process.env.MONGO_URI;`,
    language: "javascript",
    quiz: {
      question: "What is dotenv used for?",
      options: ["A) Styling", "B) Loading environment variables", "C) Creating components", "D) Deployment"],
      correct: 1
    }
  }, 
    // ── ADDITIONAL 10 BACKEND & PRACTICAL 3MTT ENTRIES ──
  {
    question: "what is authentication",
    explanation: "Authentication is the process of verifying who a user is, usually by checking email/password or using tokens like JWT.",
    example: "When you log into a website, the system authenticates you before giving access to your dashboard.",
    hasCode: true,
    code: `// Simple login check\nif (user && passwordCorrect) {\n  const token = jwt.sign({ id: user._id }, secret);\n  res.json({ token });\n}`,
    language: "javascript",
    quiz: {
      question: "What is authentication?",
      options: ["A) Styling the UI", "B) Verifying user identity", "C) Deploying the app", "D) Storing data"],
      correct: 1
    }
  },
  {
    question: "what is authorization",
    explanation: "Authorization determines what an authenticated user is allowed to do (e.g., admin vs regular user).",
    example: "After login, authorization checks if you can delete a post or access admin routes.",
    hasCode: true,
    code: `// Middleware example\nconst isAdmin = (req, res, next) => {\n  if (req.user.role !== 'admin') return res.status(403).send('Access denied');\n  next();\n};`,
    language: "javascript",
    quiz: {
      question: "What is authorization?",
      options: ["A) Checking who the user is", "B) Checking what the user can do", "C) Connecting to database", "D) Deploying code"],
      correct: 1
    }
  },
  {
    question: "what is postman",
    explanation: "Postman is a popular tool used to test APIs by sending requests (GET, POST, etc.) and viewing responses.",
    example: "3MTT students use Postman to test their Node.js/Express backend routes during development.",
    hasCode: false,
    code: "",
    language: "",
    quiz: {
      question: "What is Postman used for?",
      options: ["A) Writing frontend code", "B) Testing APIs", "C) Designing UI", "D) Deploying apps"],
      correct: 1
    }
  },
  {
    question: "what is cors",
    explanation: "CORS (Cross-Origin Resource Sharing) is a security feature that allows or blocks requests from one domain to another.",
    example: "You often need to enable CORS in Express so your frontend (on Vercel) can talk to your backend.",
    hasCode: true,
    code: `const cors = require('cors');\napp.use(cors());`,
    language: "javascript",
    quiz: {
      question: "What does CORS handle?",
      options: ["A) Database connections", "B) Cross-origin requests", "C) Styling", "D) User login"],
      correct: 1
    }
  },
  {
    question: "what is error handling in express",
    explanation: "Error handling in Express uses middleware to catch and respond to errors gracefully instead of crashing the server.",
    example: "Good error handling shows friendly messages to users and logs details for developers.",
    hasCode: true,
    code: `app.use((err, req, res, next) => {\n  console.error(err);\n  res.status(500).json({ error: 'Something went wrong' });\n});`,
    language: "javascript",
    quiz: {
      question: "Why is error handling important in Express?",
      options: ["A) For styling", "B) To prevent server crashes and give good responses", "C) For deployment", "D) For CSS"],
      correct: 1
    }
  },
  {
    question: "what is mvc pattern",
    explanation: "MVC (Model-View-Controller) is a design pattern that separates concerns: Model (data), View (UI), Controller (logic).",
    example: "Many Node.js + Express projects follow MVC to keep code organized.",
    hasCode: false,
    code: "",
    language: "",
    quiz: {
      question: "What does MVC stand for?",
      options: ["A) Model-View-Controller", "B) Mongo-Vercel-CORS", "C) Main-View-Code", "D) Modern-Vue-Component"],
      correct: 0
    }
  },
  {
    question: "what is environment variable",
    explanation: "Environment variables store configuration like database URLs, API keys, and secrets outside your code for security.",
    example: "Instead of hardcoding your MongoDB password, you put it in a .env file.",
    hasCode: true,
    code: `const dbURI = process.env.MONGO_URI;\nconsole.log(dbURI);`,
    language: "javascript",
    quiz: {
      question: "Why do we use environment variables?",
      options: ["A) For faster loading", "B) To keep secrets safe", "C) For styling", "D) For animations"],
      correct: 1
    }
  },
  {
    question: "what is render.com",
    explanation: "Render.com is a cloud platform for deploying web apps, APIs, and databases easily. It is a popular free/paid alternative to Vercel for backend.",
    example: "Many 3MTT students deploy their Node.js + Express + MongoDB apps on Render.",
    hasCode: false,
    code: "",
    language: "",
    quiz: {
      question: "What is Render.com used for?",
      options: ["A) Only frontend", "B) Deploying full-stack apps and databases", "C) Writing code", "D) Testing APIs"],
      correct: 1
    }
  },
  {
    question: "explain CRUD operations",
    explanation: "CRUD means Create, Read, Update, Delete — the four basic operations you perform on data in almost every backend project.",
    example: "In a todo app: Create a task, Read all tasks, Update a task, Delete a task.",
    hasCode: true,
    code: `// Example routes\napp.post('/tasks', createTask);\napp.get('/tasks', getTasks);\napp.put('/tasks/:id', updateTask);\napp.delete('/tasks/:id', deleteTask);`,
    language: "javascript",
    quiz: {
      question: "What does CRUD stand for?",
      options: ["A) Create, Read, Update, Delete", "B) Code, Run, Upload, Deploy", "C) CSS, React, UseState, DOM", "D) Connect, Render, Update, Database"],
      correct: 0
    }
  },
  {
    question: "what is full stack development",
    explanation: "Full stack development means working on both frontend (what users see) and backend (server, database, logic).",
    example: "A full stack developer can build a complete web app from UI to database.",
    hasCode: false,
    code: "",
    language: "",
    quiz: {
      question: "What is full stack development?",
      options: ["A) Only frontend", "B) Both frontend and backend", "C) Only database", "D) Only deployment"],
      correct: 1
    }
  },

    // ── RECURSION ENTRIES (for the UI suggestion "how does recursion work") ──
  {
    question: "how does recursion work",
    explanation: "Recursion is when a function calls itself to solve smaller versions of the same problem until it reaches a simple stopping condition called the base case.",
    example: "Like opening Russian dolls — each doll is smaller until you reach the tiniest one (base case).",
    hasCode: true,
    code: `function factorial(n) {\n  if (n === 1) return 1;               // base case\n  return n * factorial(n - 1);         // recursive call\n}\n\nconsole.log(factorial(5)); // 120`,
    language: "javascript",
    quiz: {
      question: "What stops recursion from running forever?",
      options: ["A) A loop", "B) A base case", "C) A database", "D) An API call"],
      correct: 1
    }
  },
  {
    question: "what is recursion in programming",
    explanation: "Recursion is a technique where a function solves a problem by calling itself with a smaller input until it reaches a base case.",
    example: "Finding the sum of numbers from 1 to n: sum(n) = n + sum(n-1).",
    hasCode: true,
    code: `function sum(n) {\n  if (n <= 1) return n;\n  return n + sum(n - 1);\n}`,
    language: "javascript",
    quiz: {
      question: "Recursion means a function:",
      options: ["A) Calls another function", "B) Calls itself", "C) Only runs once", "D) Uses only loops"],
      correct: 1
    }
  },
  {
    question: "what is base case in recursion",
    explanation: "The base case is the simplest condition that stops the recursive calls. Without it, the function will keep calling itself forever.",
    example: "In factorial, when n === 1 we return 1 instead of calling the function again.",
    hasCode: true,
    code: `if (n === 1) return 1;   // base case`,
    language: "javascript",
    quiz: {
      question: "Why is the base case important?",
      options: ["A) To make code faster", "B) To stop infinite recursion", "C) To style the output", "D) To connect to database"],
      correct: 1
    }
  },
  {
    question: "what is stack overflow in recursion",
    explanation: "Stack overflow happens when too many recursive calls fill up the call stack memory because the base case was never reached.",
    example: "Calling factorial(100000) without a proper base case will crash with stack overflow.",
    hasCode: false,
    code: "",
    language: "",
    quiz: {
      question: "What causes stack overflow in recursion?",
      options: ["A) Too many recursive calls without base case", "B) Using loops", "C) Writing CSS", "D) Deploying the app"],
      correct: 0
    }
  },
];