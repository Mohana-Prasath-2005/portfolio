// Single source of truth for portfolio content.
// Sources: the previous version of this site, the owner's corrections, and the
// owner's GitHub profile README (github.com/Mohana-Prasath-2005/Mohana-Prasath-2005).
// Keep it factual.

export const person = {
  name: 'Mohana Prasath G',
  first: 'Mohana Prasath',
  initial: 'G',
  role: 'Software Engineer',
  company: 'Open Fabric',
  location: 'Erode, India',
  intro:
    'I build backend systems in fintech — and, outside work, computer vision, reconciliation tooling and multimodal AI research.',
  about: [
    'My day-to-day spans the whole product surface — from the services underneath to the screens on top, and the work that keeps it running.',
    'Outside work I build computer vision systems, IoT robotics and research tooling.',
  ],
  availability: 'Open to collaborations and interesting engineering challenges.',
  email: 'mohanaprasath8917@gmail.com',
  phone: '+91 8098286056',
  phoneHref: 'tel:+918098286056',
}

// Areas of work at Open Fabric, as described by the owner
export const workAreas = [
  'API', 'Frontend', 'Backend', 'PBA',
  'Online payments', 'Issuing', 'Events handling', 'Dashboards',
  'Reporting', 'Testing', 'Simulation', 'Operations',
]

export const socials = [
  { id: 'github', label: 'GitHub', handle: 'Mohana-Prasath-2005', href: 'https://github.com/Mohana-Prasath-2005' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'Mohana Prasath G', href: 'https://www.linkedin.com/in/mohana-prasath-g-279139267/' },
  { id: 'leetcode', label: 'LeetCode', handle: 'MOHAN-2005', href: 'https://leetcode.com/u/MOHAN-2005/' },
]

// From the README profile header / signal strip
export const spec = [
  { label: 'Domain', value: 'Fintech · payments & card issuing' },
  { label: 'Exploring', value: 'System design · distributed systems' },
  { label: 'Education', value: 'B.E. CSE · Class of 2026' },
  { label: 'Base', value: 'Erode, India · IST' },
]

export const highlights = [
  { value: '9.2', label: 'CGPA · B.E. CSE' },
  { value: '2', label: 'Research papers' },
  { value: '490+', label: 'LeetCode solved' },
  { value: '13+', label: 'First prizes' },
]

/* ------------------------------------------------------------------ */
/* Tech stack — exactly the 26 tools in 6 layers from the README       */
/* ------------------------------------------------------------------ */
export const stackLayers = [
  { id: 'interface', title: 'Interface', tools: ['React', 'Vite', 'TypeScript', 'JavaScript'] },
  { id: 'services', title: 'Services', tools: ['Node.js', 'Express', 'Flask', 'GraphQL', 'REST'] },
  { id: 'data', title: 'Data', tools: ['PostgreSQL', 'Hasura', 'MySQL'] },
  { id: 'cloud', title: 'Cloud', tools: ['AWS Lambda', 'API Gateway', 'Docker', 'GitHub Actions'] },
  { id: 'intelligence', title: 'Intelligence', tools: ['Python', 'YOLOv8', 'OpenCV', 'Pandas', 'NumPy'] },
  { id: 'toolbox', title: 'Toolbox', tools: ['Postman', 'Bruno', 'SoapUI', 'Termius', 'Power BI'] },
]

/* ------------------------------------------------------------------ */
/* Projects — descriptions use only facts from the project/repository   */
/* ------------------------------------------------------------------ */
export const projects = [
  {
    id: 'vision-x',
    visual: 'vision',
    title: 'VISION X',
    subtitle: 'Real-time AI surveillance engine',
    role: 'Project Associate',
    year: '2025',
    description:
      'A YOLOv8-based object tracking system that processes live video feeds at 30 FPS with sub-50ms latency. It detects and counts objects live from a webcam or uploaded video, with an on-screen performance dashboard.',
    metrics: [
      { label: 'Throughput', value: '30 FPS' },
      { label: 'Latency', value: '< 50 ms' },
      { label: 'Detection', value: 'Real-time' },
    ],
    tech: ['Python', 'YOLOv8', 'OpenCV', 'Streamlit'],
    repo: 'https://github.com/Mohana-Prasath-2005/Vision_X',
  },
  {
    id: 'reconciliation',
    visual: 'ledger',
    title: 'Transaction Reconciliation System',
    subtitle: 'Full-stack fintech platform',
    role: 'Independent Project',
    year: '2025',
    description:
      'A full-stack financial reconciliation engine. It matches settlements against transactions, flags every mismatch and surfaces them on real-time dashboards for settlement tracking, issue detection and performance metrics.',
    metrics: [
      { label: 'Stack', value: 'Full-stack' },
      { label: 'Data', value: 'Real-time' },
      { label: 'Output', value: 'Mismatch flags' },
    ],
    tech: ['React', 'Vite', 'Flask', 'SQLite', 'REST API', 'CSV Processing'],
    repo: 'https://github.com/Mohana-Prasath-2005/reconciliation-system',
  },
  {
    id: 'robot-car',
    visual: 'robot',
    title: '3-in-1 IoT Robot Car',
    subtitle: 'Modular robotics system',
    role: 'Team Leader',
    year: '2024',
    description:
      'An IoT-enabled modular robot car with three control modes — gesture recognition, voice commands and Bluetooth — achieving a 99.9% command execution success rate. Built on Arduino with an L298N motor driver and an HC-06 Bluetooth module.',
    metrics: [
      { label: 'Success rate', value: '99.9%' },
      { label: 'Control modes', value: '3' },
      { label: 'Integration', value: 'HW + SW' },
    ],
    tech: ['Arduino', 'IoT', 'Bluetooth', 'Gesture Recognition', 'Voice Control'],
    repo: 'https://github.com/Mohana-Prasath-2005/3-IN-1-ROBOT-CAR',
  },
  {
    id: 'cse-dept',
    visual: 'screens',
    title: 'CSE Departmental Association Website',
    subtitle: 'Tech Matrix — CSE Students Association',
    role: 'Web project',
    year: '2025–26',
    description:
      'A multi-page website for the department\'s students association with Home, About, Team, Events, Grievances and Contact pages. The events timeline links to photo galleries from SYNECTICS, Pongal, Teachers Day and induction programs; the grievances page routes students to a Google Form and association contacts.',
    metrics: [
      { label: 'Pages', value: '6' },
      { label: 'Routing', value: 'Client-side' },
      { label: 'UI', value: 'shadcn/ui' },
    ],
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion', 'React Router'],
    repo: 'https://github.com/Mohana-Prasath-2005/CSE-DEPT',
  },
]

export const research = [
  {
    name: 'WavDino Emotion Intelligence',
    venue: 'NIT Puducherry',
    summary:
      'Fuses speech and facial signals to recognise emotion, with temporal attention across 8–16 frames instead of a single snapshot. DINOv2 encoder.',
    tech: ['PyTorch', 'Transformers', 'DINOv2', 'React'],
    links: [
      { label: 'Source', href: 'https://github.com/Mohana-Prasath-2005/wavDino' },
      { label: 'Results dashboard', href: 'https://wavdino-temporal-dashboard.netlify.app' },
    ],
  },
  {
    name: 'Temporal Facial Dynamics–Driven Audio-Visual Emotion Recognition Using Vision Transformers',
    venue: 'Research paper',
    summary: 'Audio-visual emotion recognition driven by temporal facial dynamics, using Vision Transformers.',
    tech: ['Vision Transformers', 'Multimodal AI'],
    links: [{ label: 'Source', href: 'https://github.com/Mohana-Prasath-2005/temporal-audiovisual-emotion' }],
  },
]

export const hackathons = [
  { name: 'Smart India Hackathon', detail: 'SIH 2023 & 2024 — National level' },
  { name: 'UYIR Road Safety Hackathon', detail: 'Road safety solutions' },
  { name: 'Adobe GenSolve Hackathon', detail: 'Generative AI challenge' },
]

/* ------------------------------------------------------------------ */
/* Experience & education                                              */
/* ------------------------------------------------------------------ */
export const experience = [
  {
    org: 'Open Fabric',
    role: 'Software Engineer',
    where: 'Singapore · Remote',
    detail: 'Backend systems for card issuing and payments infrastructure.',
    tags: [],
    current: true,
    // Progression at the company, most recent first
    positions: [
      { title: 'Software Engineer', period: 'Jun 2026 – Present', current: true },
      { title: 'Software Engineer Intern', period: 'Oct 2025 – May 2026' },
    ],
  },
  {
    org: 'NIT Trichy',
    role: 'Internship Program',
    where: 'National level · 2025',
    detail:
      "A 30-day national-level internship program at one of India's premier technical institutions, with hands-on exposure to advanced engineering practices.",
    tags: ['30 days', 'National level'],
  },
]

export const education = {
  degree: 'B.E. Computer Science & Engineering',
  school: 'Nandha Engineering College, Erode',
  period: '2022 – 2026',
  cgpa: '9.2',
  semesters: [
    { sem: 1, gpa: 9.136 },
    { sem: 2, gpa: 9.044 },
    { sem: 3, gpa: 9.224 },
    { sem: 4, gpa: 9.286 },
    { sem: 5, gpa: 9.228 },
    { sem: 6, gpa: 9.199 },
    { sem: 7, gpa: 9.1 },
    { sem: 8, gpa: 10.0 },
  ],
  school12: [
    { label: '12th (HSC)', value: 85 },
    { label: '10th (SSLC)', value: 77 },
  ],
}

export const certifications = [
  { name: 'Data Science Workshop', org: 'NIT Trichy' },
  { name: 'Career Essentials in Data Analysis', org: 'Microsoft & LinkedIn' },
  { name: 'AI Foundation (97.5%)', org: 'Infosys Springboard' },
  { name: 'Docker Foundations Professional', org: 'LinkedIn' },
  { name: 'SQL (Intermediate)', org: 'HackerRank' },
  { name: 'NPTEL — Problem Solving Through C', org: 'IIT Madras (NPTEL)' },
  { name: 'NPTEL — Cyber Security & Privacy', org: 'IIT Madras (NPTEL)' },
  { name: 'Applied Generative AI (82.5%)', org: 'Infosys Springboard' },
]

export const leadership = [
  {
    title: 'Student Secretary',
    org: 'Dept. of CSE',
    period: '2025 – 2026',
    impact: 'Led departmental student initiatives and represented 500+ students in academic decisions and faculty interactions.',
  },
  {
    title: 'Promotional Team Head',
    org: 'College-wide',
    period: '2025 – 2026',
    impact: 'Handled social media presence and promotional activities for the college students association.',
  },
  {
    title: 'Overall Students Joint Secretary',
    org: 'College-wide',
    period: '2024 – 2025',
    impact: 'Coordinated inter-departmental events, managed cross-functional student teams, and drove event execution.',
  },
  {
    title: 'Executive Member',
    org: 'Dept. of CSE',
    period: '2023 – 2024',
    impact: 'Drove student engagement and supported departmental event planning and coordination.',
  },
  {
    title: 'Core Member',
    org: 'Dept. of CSE',
    period: '2022 – 2023',
    impact: 'Contributed to foundational departmental activities and technical event support from first year.',
  },
]

/* ------------------------------------------------------------------ */
/* Awards & competitions                                               */
/* ------------------------------------------------------------------ */
export const awards = [
  {
    id: 'iste',
    label: 'State recognition',
    title: 'ISTE Chapter Best Student Award',
    year: '2026',
    org: 'ISTE Tamilnadu Section',
    description:
      'Recognized for sustained excellence across academics, leadership, innovation, and professional achievement throughout the undergraduate program.',
    featured: true,
  },
  {
    id: 'best-outgoing',
    label: 'Institutional recognition',
    title: 'Best Outgoing Student',
    year: '2026',
    org: 'CSE Department',
    description:
      'Honored as the Best Outgoing Student of the CSE Department for exceptional performance across academics, research, leadership, and professional development.',
  },
  {
    id: 'co-curricular-2026',
    label: 'Department recognition — 2nd consecutive year',
    title: 'Best Co-Curricular Student (CSE)',
    year: '2026',
    org: 'CSE Department',
    description:
      'Awarded in two consecutive years (2025 and 2026) for outstanding contributions in co-curricular activities, leadership roles, and inter-college events.',
  },
  {
    id: 'co-curricular-2025',
    label: 'Department recognition',
    title: 'Best Co-Curricular Student (CSE)',
    year: '2025',
    org: 'CSE Department',
    description:
      'Awarded for outstanding contributions in co-curricular activities, leadership roles, and consistent participation across departmental and inter-college events.',
  },
]

export const competitionStats = [
  { label: 'First prizes', value: 13, suffix: '+' },
  { label: 'Second prizes', value: 11, suffix: '+' },
  { label: 'Podium finishes', value: 15, suffix: '+' },
  { label: 'Events', value: 50, suffix: '+' },
]

export const keyWins = [
  { prize: '1st', event: 'Paper Presentation — Security Technologies', venue: 'PIET, Pollachi' },
  { prize: '1st', event: 'UI/UX Design Competition', venue: "GALAXY'24, GCE Erode" },
  { prize: '1st', event: 'Paper Presentation — AI in Healthcare', venue: 'ESEC' },
  { prize: '1st', event: 'IPL Auction Strategy Event', venue: "GALAXY'24, GCE Erode" },
  { prize: '2nd', event: 'Code Cracking — Java Programming', venue: 'GCE Erode' },
  { prize: '2nd', event: 'Python Quiz & Reasoning', venue: 'GCE Erode (IIC & ISTE)' },
  { prize: '2nd', event: 'The Brainiacs — Technical Quiz', venue: "syNECtics'24, NEC" },
  { prize: '2nd', event: 'Math Quiz', venue: 'Nandha Engineering College' },
]

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'work', label: 'Work' },
  { id: 'research', label: 'Research' },
  { id: 'journey', label: 'Journey' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'awards', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
]
