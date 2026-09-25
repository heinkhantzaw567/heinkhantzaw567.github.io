export const contact = {
  email: 'heinkhant.zaw@torontomu.ca',
  linkedin: 'https://www.linkedin.com/in/heinkhantzaw/',
  github: 'https://github.com/heinkhantzaw567?tab=repositories',
}

export const skills = [
  ['Languages', 'Ruby · Python · JavaScript · TypeScript · Java · C · SQL · Haskell'],
  ['Frameworks', 'Ruby on Rails · Django · React · React Native · Next.js · Tailwind CSS'],
  ['Databases', 'PostgreSQL · MongoDB · SQLite · Redis · IndexedDB'],
  ['Tools', 'Git · Playwright · RSpec · Devise · Pundit · Nginx · Linux · Jira'],
  ['Libraries', 'Pandas · NumPy · OpenCV · ActionCable'],
  ['QA & Testing', 'Manual Testing · Automated E2E · Playwright JS · Bug Reporting · Test Planning'],
]

export const projects = [
  {
    title: 'AutoTailor',
    image: '/projects/autotailor.png',
    url: 'https://autotailor.org/',
    desc: 'AI-powered resume tailoring SaaS. Users upload a LaTeX master resume, paste a job description, and Claude tailors it through trim/expand/refine passes then compiles it to PDF. Includes a credit-based payment system, S3 storage, and user auth.',
    stack: ['Python', 'FastAPI', 'Claude API', 'React', 'TypeScript', 'S3', 'LaTeX', 'PostgreSQL'],
  },
  {
    title: 'ShiftLock',
    image: '/projects/shiftlock.png',
    desc: 'Offline-first POS and attendance system for small businesses. Features device-bound auth, IndexedDB local queues, and server-side reconciliation on reconnect.',
    stack: ['Django REST', 'React', 'PostgreSQL', 'IndexedDB', 'Nginx', 'Tailscale'],
  },
  {
    title: 'Healthwise',
    image: '/projects/healthwise.png',
    url: 'https://github.com/ZaramNelo/Healthwise.git',
    desc: 'AI-powered skincare recommendation system using opt-in face analysis, the ChatGPT API for personalized suggestions, and Google Maps API for nearby stores.',
    stack: ['Next.js', 'Supabase', 'TypeScript', 'ChatGPT API', 'Google Maps'],
  },
  {
    title: 'AI Earth Hackathon',
    image: '/projects/ai-earth-hackathon.png',
    url: 'https://github.com/heinkhantzaw567/ai-earth-hack-submission.git',
    desc: 'Hackathon project: an AI-powered recipe generator using ChatGPT and Claude APIs with ingredient filtering, user preferences, and an integrated add-to-cart feature.',
    stack: ['Streamlit', 'Python', 'ChatGPT API', 'Claude API'],
  },
  {
    title: 'E-commerce Price Tracker',
    url: 'https://github.com/heinkhantzaw567/price-tracker-scrapy',
    image: '/projects/price-tracker.png',
    desc: "Full-catalog scraper that follows pagination automatically, visits every product page, and exports a clean, timestamped CSV. Polite-scraper defaults — throttling, robots.txt compliance, automatic retries — so long unattended crawls don't get blocked mid-run.",
    stack: ['Scrapy', 'Pandas', 'CSV Pipeline', 'Python'],
  },
  {
    title: 'Dynamic Site Scraper',
    url: 'https://github.com/heinkhantzaw567/dynamic-scraper-selenium',
    image: ['/projects/dynamic-scraper-run.png', '/projects/dynamic-scraper-output.png'],
    desc: 'Headless browser scraper for JavaScript-rendered pages — infinite scroll, dashboards, "load more" buttons — where a plain HTTP request only returns an empty shell. Uses selenium-stealth to reduce automation fingerprinting and retries with backoff on every page load.',
    stack: ['Selenium', 'selenium-stealth', 'webdriver-manager'],
  },
  {
    title: 'API Automation Connector',
    url: 'https://github.com/heinkhantzaw567/api-automation-connector',
    image: ['/projects/api-connector-run.png', '/projects/api-connector-output.png'],
    desc: 'Scheduled API-to-Slack/CSV pipeline: pulls live data, transforms it, and delivers it wherever the client actually looks. Config lives entirely in .env, and every network call runs through a shared retry-with-backoff decorator.',
    stack: ['Python', 'Requests', 'python-dotenv'],
  },
  {
    title: 'Enterprise Anti-Bot & AI Pipeline',
    url: 'https://github.com/heinkhantzaw567/advanced-anti-bot-ai-pipeline',
    image: '/projects/anti-bot-output.png',
    desc: 'Chains three paid APIs into one pipeline: Zyte for managed anti-bot fetching, 2Captcha for challenge-solving, and OpenAI for turning raw scraped HTML into structured JSON instead of brittle CSS selectors. Ships as both a CLI script and an AWS Lambda handler.',
    stack: ['Zyte API', '2Captcha', 'OpenAI', 'AWS Lambda'],
  },
]

export const experience = [
  {
    date: 'May 2026 – Present',
    role: 'AI Software Developer Intern',
    company: 'FFGP · Toronto, ON',
    logo: '/projects/ffgp.png',
    desc: 'Built a multi-agent AI pipeline for Ontario PPM150 school meal compliance using Python/Flask and the Claude API. Fine-tuned Qwen2.5-7B with QLoRA (Unsloth) for structured ingredient Q&A. Developed a REST policy API in Express/TypeScript with Drizzle ORM, MySQL, and full Swagger/OpenAPI documentation.',
  },
  {
    date: 'Apr – Jun 2025',
    role: 'Front-End Developer',
    company: 'Checklick · Toronto, ON',
    logo: '/projects/checklick.png',
    desc: 'Built cross-device React interfaces with Tailwind CSS, converted 20+ Zeplin designs into reusable components, and drove API integration reducing data load times by 40%.',
  },
  {
    date: 'Mar – May 2025',
    role: 'QA Analyst Intern',
    company: 'Standard Carbon Inc. · Toronto, ON',
    logo: '/projects/standard_carbon_logo.jpg',
    desc: 'Performed manual and automated testing with Playwright across 15+ user scenarios. Designed test plans, documented defects, and collaborated in Agile/Scrum to resolve issues efficiently.',
  },
  {
    date: 'Oct 2025 – Present',
    role: 'Math Tutor',
    company: 'Working Women Community Centre · Toronto, ON',
    logo: '/projects/wwcc.jpg',
    desc: "One-on-one and small-group tutoring in pre-algebra through pre-calculus, with custom worksheets and visual explanations tailored to each learner's needs.",
  },
  {
    date: 'Sep 2023 – Present',
    role: 'B.Sc. Computer Science',
    company: 'Toronto Metropolitan University · Toronto, ON',
    logo: '/projects/tmu-logo-full-colour.jpg',
    desc: 'Coursework in Databases, Data Structures, AI, Machine Learning, and Software Production.',
  },
]
