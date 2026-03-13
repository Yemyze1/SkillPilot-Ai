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
];
