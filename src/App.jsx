import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Compass,
  LayoutDashboard,
  Radar,
  FileCheck2,
  Sparkles,
  Target,
  Award,
  Calendar,
  Briefcase,
  GraduationCap,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Building,
  FileText,
  Check,
  X,
  Clock,
  TrendingUp,
  Layers,
  Zap,
  Info,
  Lock,
  LogOut,
  Mail,
  User,
  Eye,
  EyeOff,
  Phone,
  Link,
  Edit3,
  BookOpen
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// ============================================================================
// CONSTANTS & MOCK DATABASE
// ============================================================================

const DOMAINS = {
  DATA_ANALYTICS: 'Data Analytics',
  DATA_SCIENCE: 'Data Science',
  WEB_DEV: 'Web Development',
  CLOUD_AI: 'Cloud/AI'
};

const GOAL_TYPES = {
  JOB: 'Job',
  INTERNSHIP: 'Internship',
  HACKATHON: 'Hackathon',
  CERTIFICATION: 'Certification'
};

// Domain-specific diagnostic questions
const DIAGNOSTIC_QUESTIONS = {
  [DOMAINS.DATA_ANALYTICS]: [
    {
      id: 'da1',
      question: 'Which SQL clause is used to filter grouped aggregated data?',
      options: ['WHERE', 'HAVING', 'GROUP FILTER', 'ORDER BY'],
      correct: 1,
      skillGap: 'Advanced SQL Aggregations'
    },
    {
      id: 'da2',
      question: 'In Power BI / Tableau, which calculation type evaluates row-by-row before aggregation?',
      options: ['Calculated Column', 'Measure', 'Window Function', 'Implicit Filter'],
      correct: 0,
      skillGap: 'Power BI DAX & Calculated Columns'
    },
    {
      id: 'da3',
      question: 'Which chart is best for showing composition of categorical variance over time?',
      options: ['Scatter Plot', 'Stacked Area Chart', 'Box Whisker', 'Heatmap'],
      correct: 1,
      skillGap: 'Data Storytelling & Visualization'
    }
  ],
  [DOMAINS.DATA_SCIENCE]: [
    {
      id: 'ds1',
      question: 'Which technique is primarily used to address high variance (overfitting) in decision trees?',
      options: ['L1 Lasso Regularization', 'Pruning / Random Forests', 'StandardScaler', 'One-Hot Encoding'],
      correct: 1,
      skillGap: 'Ensemble Learning & Tree Pruning'
    },
    {
      id: 'ds2',
      question: 'When evaluation classes are heavily imbalanced (e.g. 99:1), which metric is preferred over Accuracy?',
      options: ['PR-AUC / F1-Score', 'R-Squared', 'Mean Squared Error', 'Adjusted R2'],
      correct: 0,
      skillGap: 'Imbalanced Classification Metrics'
    },
    {
      id: 'ds3',
      question: 'In Deep Learning, what prevents vanishing gradients in deep residual networks?',
      options: ['Skip/Residual Connections', 'Sigmoid Activations', 'Batch Size of 1', 'Zero Padding'],
      correct: 0,
      skillGap: 'Deep Neural Net Architectures'
    }
  ],
  [DOMAINS.WEB_DEV]: [
    {
      id: 'wd1',
      question: 'In React 18, what is the primary role of the useCallback hook?',
      options: ['To memoize calculation results', 'To memoize function references across renders', 'To trigger immediate re-render', 'To fetch REST APIs asynchronously'],
      correct: 1,
      skillGap: 'React Performance Optimization'
    },
    {
      id: 'wd2',
      question: 'What HTTP status code should be returned after a successfully created REST resource?',
      options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
      correct: 1,
      skillGap: 'RESTful API Standards & Statuses'
    },
    {
      id: 'wd3',
      question: 'Which CSS property creates a new stacking context without modifying z-index?',
      options: ['display: flex', 'opacity: 0.99', 'color: inherit', 'margin: auto'],
      correct: 1,
      skillGap: 'Modern CSS Stacking & Layouts'
    }
  ],
  [DOMAINS.CLOUD_AI]: [
    {
      id: 'ca1',
      question: 'In Kubernetes, what workload controller ensures exactly one pod replica runs on every cluster node?',
      options: ['StatefulSet', 'DaemonSet', 'Deployment', 'ReplicaSet'],
      correct: 1,
      skillGap: 'Kubernetes Workload Orchestration'
    },
    {
      id: 'ca2',
      question: 'In Cloud architecture, which storage class is optimal for infrequent access with millisecond retrieval?',
      options: ['S3 Glacier Flexible', 'S3 Standard-IA', 'EBS Cold HDD', 'Google Archive'],
      correct: 1,
      skillGap: 'Cloud Storage Tier Optimization'
    },
    {
      id: 'ca3',
      question: 'In Large Language Model deployment, what is the purpose of Quantization (e.g. INT8 / FP4)?',
      options: ['Reduce model memory footprint & latency', 'Increase model parameter count', 'Generate vector embeddings', 'Enforce prompt guardrails'],
      correct: 0,
      skillGap: 'LLM Inference Optimization & Quantization'
    }
  ]
};

// Domain roadmaps
const ROADMAP_TEMPLATES = {
  [DOMAINS.DATA_ANALYTICS]: [
    {
      id: 'phase-1',
      phaseName: 'Phase 1: Foundation',
      description: 'Master core analytical thinking, statistics, and relational data modeling.',
      tasks: [
        { id: 'da-t1', title: 'SQL Joins, Subqueries & CTEs', completed: true, weight: 6 },
        { id: 'da-t2', title: 'Descriptive & Inferential Statistics', completed: true, weight: 6 },
        { id: 'da-t3', title: 'Excel Advanced Formulas (XLOOKUP, Pivot Tables)', completed: true, weight: 5 }
      ]
    },
    {
      id: 'phase-2',
      phaseName: 'Phase 2: Core Tools',
      description: 'Command modern business intelligence tools and exploratory data analytics.',
      tasks: [
        { id: 'da-t4', title: 'Power BI / Tableau Interactive Dashboards', completed: false, weight: 8 },
        { id: 'da-t5', title: 'Data Cleaning with Pandas & Python', completed: false, weight: 8 },
        { id: 'da-t6', title: 'SQL Window Functions (ROW_NUMBER, DENSE_RANK)', completed: true, weight: 7 }
      ]
    },
    {
      id: 'phase-3',
      phaseName: 'Phase 3: Practical Projects',
      description: 'Ship production-ready analytical case studies with executive insights.',
      tasks: [
        { id: 'da-t7', title: 'E-Commerce Cohort Retention Analysis', completed: false, weight: 10 },
        { id: 'da-t8', title: 'Financial KPI Executive Dashboard', completed: false, weight: 10 },
        { id: 'da-t9', title: 'Customer Churn Root Cause Analysis', completed: false, weight: 10 }
      ]
    },
    {
      id: 'phase-4',
      phaseName: 'Phase 4: Career Readiness',
      description: 'Portfolio polishing, behavioral storytelling, and technical interview simulations.',
      tasks: [
        { id: 'da-t10', title: 'GitHub / Notion Data Portfolio live deploy', completed: false, weight: 10 },
        { id: 'da-t11', title: 'LeetCode / StrataScratch 50 SQL challenges', completed: false, weight: 10 },
        { id: 'da-t12', title: 'STAR Method Presentation on Case Studies', completed: false, weight: 10 }
      ]
    }
  ],
  [DOMAINS.DATA_SCIENCE]: [
    {
      id: 'phase-1',
      phaseName: 'Phase 1: Foundation',
      description: 'Linear Algebra, Probability, and Python programming.',
      tasks: [
        { id: 'ds-t1', title: 'Linear Algebra & Multivariate Calculus', completed: true, weight: 6 },
        { id: 'ds-t2', title: 'Probability Distributions & Hypothesis Testing', completed: true, weight: 6 },
        { id: 'ds-t3', title: 'Object-Oriented Python & NumPy', completed: true, weight: 6 }
      ]
    },
    {
      id: 'phase-2',
      phaseName: 'Phase 2: Core Tools',
      description: 'Scikit-Learn, Feature Engineering, and Model Validation.',
      tasks: [
        { id: 'ds-t4', title: 'Supervised Learning (Regression & Classifiers)', completed: false, weight: 8 },
        { id: 'ds-t5', title: 'Feature Selection & Dimensionality Reduction', completed: false, weight: 8 },
        { id: 'ds-t6', title: 'Model Evaluation Metrics (ROC-AUC, Precision-Recall)', completed: false, weight: 8 }
      ]
    },
    {
      id: 'phase-3',
      phaseName: 'Phase 3: Practical Projects',
      description: 'End-to-end Machine Learning pipelines with deployment.',
      tasks: [
        { id: 'ds-t7', title: 'Predictive Maintenance ML Pipeline with FastAPI', completed: false, weight: 10 },
        { id: 'ds-t8', title: 'Customer Segmentation using Unsupervised Clustering', completed: false, weight: 10 },
        { id: 'ds-t9', title: 'Computer Vision / NLP fine-tuning benchmark', completed: false, weight: 10 }
      ]
    },
    {
      id: 'phase-4',
      phaseName: 'Phase 4: Career Readiness',
      description: 'ML System Design and Kaggle contest participation.',
      tasks: [
        { id: 'ds-t10', title: 'Kaggle Notebook Grandmaster / Competition Medal', completed: false, weight: 10 },
        { id: 'ds-t11', title: 'MLOps: MLflow tracking & Docker containerization', completed: false, weight: 10 },
        { id: 'ds-t12', title: 'Live Technical System Design Mock Interview', completed: false, weight: 8 }
      ]
    }
  ],
  [DOMAINS.WEB_DEV]: [
    {
      id: 'phase-1',
      phaseName: 'Phase 1: Foundation',
      description: 'Semantic HTML5, CSS3 Architecture, and Modern ES6+ JavaScript.',
      tasks: [
        { id: 'wd-t1', title: 'JavaScript Engine: Event Loop, Closures, Promises', completed: true, weight: 6 },
        { id: 'wd-t2', title: 'CSS Grid, Flexbox & Responsive Layouts', completed: true, weight: 6 },
        { id: 'wd-t3', title: 'Git branching & Pull Request workflow', completed: true, weight: 6 }
      ]
    },
    {
      id: 'phase-2',
      phaseName: 'Phase 2: Core Tools',
      description: 'Component architecture, state management, and API design.',
      tasks: [
        { id: 'wd-t4', title: 'React Hooks, Custom Hooks & Context API', completed: false, weight: 8 },
        { id: 'wd-t5', title: 'Tailwind CSS & UI Component Libraries', completed: true, weight: 7 },
        { id: 'wd-t6', title: 'RESTful API Integration & React Query / Axios', completed: false, weight: 8 }
      ]
    },
    {
      id: 'phase-3',
      phaseName: 'Phase 3: Practical Projects',
      description: 'Full-stack production applications with auth & persistent DB.',
      tasks: [
        { id: 'wd-t7', title: 'Fullstack SaaS with Auth, Stripe & PostgreSQL', completed: false, weight: 10 },
        { id: 'wd-t8', title: 'Real-time Collaborative App using WebSockets', completed: false, weight: 10 },
        { id: 'wd-t9', title: 'SSR & Jamstack app using Next.js / Vite', completed: false, weight: 9 }
      ]
    },
    {
      id: 'phase-4',
      phaseName: 'Phase 4: Career Readiness',
      description: 'Web performance, accessibility (a11y), and live deployments.',
      tasks: [
        { id: 'wd-t10', title: 'Lighthouse 95+ Score & Core Web Vitals audit', completed: false, weight: 10 },
        { id: 'wd-t11', title: 'Comprehensive Portfolio on Custom Domain', completed: false, weight: 10 },
        { id: 'wd-t12', title: 'Frontend System Design & Coding Prep', completed: false, weight: 10 }
      ]
    }
  ],
  [DOMAINS.CLOUD_AI]: [
    {
      id: 'phase-1',
      phaseName: 'Phase 1: Foundation',
      description: 'Linux systems, networking fundamentals, and Python scripting.',
      tasks: [
        { id: 'ca-t1', title: 'Linux Bash Scripting & System Administration', completed: true, weight: 6 },
        { id: 'ca-t2', title: 'TCP/IP, DNS, VPCs, and Subnetting Architecture', completed: true, weight: 6 },
        { id: 'ca-t3', title: 'Cloud Fundamentals (IAM, Compute, Storage)', completed: true, weight: 6 }
      ]
    },
    {
      id: 'phase-2',
      phaseName: 'Phase 2: Core Tools',
      description: 'Containerization, IaC, and Cloud Services.',
      tasks: [
        { id: 'ca-t4', title: 'Docker Multi-stage Builds & Compose', completed: false, weight: 8 },
        { id: 'ca-t5', title: 'Kubernetes Pods, Services & Ingress', completed: false, weight: 8 },
        { id: 'ca-t6', title: 'Terraform Infrastructure as Code (IaC)', completed: false, weight: 8 }
      ]
    },
    {
      id: 'phase-3',
      phaseName: 'Phase 3: Practical Projects',
      description: 'Autonomous agents, RAG pipelines, and automated CI/CD.',
      tasks: [
        { id: 'ca-t7', title: 'Production RAG System with Vector Database & LangChain', completed: false, weight: 10 },
        { id: 'ca-t8', title: 'Automated CI/CD Pipeline with GitHub Actions & AWS EKS', completed: false, weight: 10 },
        { id: 'ca-t9', title: 'Fine-tuned SLM Serverless API on Modal / RunPod', completed: false, weight: 10 }
      ]
    },
    {
      id: 'phase-4',
      phaseName: 'Phase 4: Career Readiness',
      description: 'Cloud Certifications and enterprise architecture case studies.',
      tasks: [
        { id: 'ca-t10', title: 'AWS Solutions Architect / GCP Cloud Engineer Prep', completed: false, weight: 10 },
        { id: 'ca-t11', title: 'Cloud Cost Optimization & FinOps Audit Report', completed: false, weight: 8 },
        { id: 'ca-t12', title: 'Distributed Systems Design Interviews', completed: false, weight: 10 }
      ]
    }
  ]
};

// 12+ Realistic Opportunities
const MOCK_OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: 'Data Analyst Intern (Summer 2026)',
    company: 'Spotify Technology S.A.',
    type: GOAL_TYPES.INTERNSHIP,
    domain: DOMAINS.DATA_ANALYTICS,
    location: 'Remote / Hybrid (New York, NY)',
    stipendOrSalary: '$48 - $55 / hr',
    deadline: '2026-10-15',
    daysLeft: 18,
    requiredSkills: ['SQL', 'Power BI', 'Python', 'Exploratory Data Analysis'],
    sourceUrl: 'https://www.lifeatspotify.com/jobs',
    description: 'Collaborate with the Content & Creator Insights team to evaluate user streaming behaviors and produce dashboard summaries for artist management.',
    whyFit: {
      goalMatch: 'Direct alignment with your Summer Internship target.',
      domainMatch: '100% matched to Data Analytics specialization.',
      skillMatch: 'You have mastered SQL Joins & Statistics; Power BI is in progress on your roadmap.',
      roadmapImpact: 'Completing Phase 2 "Power BI Interactive Dashboards" increases qualification to 98%.'
    }
  },
  {
    id: 'opp-2',
    title: 'Associate Business Intelligence Analyst',
    company: 'Stripe',
    type: GOAL_TYPES.JOB,
    domain: DOMAINS.DATA_ANALYTICS,
    location: 'San Francisco, CA / Remote',
    stipendOrSalary: '$115,000 - $135,000 / yr',
    deadline: '2026-10-05',
    daysLeft: 8,
    requiredSkills: ['SQL Window Functions', 'Tableau', 'Cohort Retention', 'Financial KPIs'],
    sourceUrl: 'https://stripe.com/jobs',
    description: 'Architect self-serve analytics dashboards and measure revenue churn across global payment volumes.',
    whyFit: {
      goalMatch: 'High tier entry-level analyst position matching your career goals.',
      domainMatch: 'Data Analytics and FinTech analytics focus.',
      skillMatch: 'Requires SQL Window Functions which you have completed in Phase 2.',
      roadmapImpact: 'Unlocks priority review when you finish the E-Commerce Cohort Retention project.'
    }
  },
  {
    id: 'opp-3',
    title: 'Global FinTech Data Hackathon 2026',
    company: 'JPMorgan Chase & Co.',
    type: GOAL_TYPES.HACKATHON,
    domain: DOMAINS.DATA_ANALYTICS,
    location: 'Virtual / Global',
    stipendOrSalary: '$35,000 Prize Pool',
    deadline: '2026-10-02',
    daysLeft: 5,
    requiredSkills: ['SQL', 'Data Storytelling', 'Dashboard Design', 'Excel'],
    sourceUrl: 'https://careers.jpmorgan.com/global/en/students',
    description: '48-hour competitive sprint solving fraud anomaly patterns using structured transaction ledgers.',
    whyFit: {
      goalMatch: 'Immediate sprint opportunity to earn credentials and fast-track interview bypass.',
      domainMatch: 'Focuses on Data Analytics & Storytelling.',
      skillMatch: 'Matches 90% of your foundational SQL and presentation skills.',
      roadmapImpact: 'Fulfills Practical Projects milestone directly.'
    }
  },
  {
    id: 'opp-4',
    title: 'Machine Learning Engineering Intern',
    company: 'NVIDIA',
    type: GOAL_TYPES.INTERNSHIP,
    domain: DOMAINS.DATA_SCIENCE,
    location: 'Santa Clara, CA / Austin, TX',
    stipendOrSalary: '$55 - $65 / hr',
    deadline: '2026-10-12',
    daysLeft: 15,
    requiredSkills: ['PyTorch', 'Python', 'Feature Engineering', 'CUDA Basics'],
    sourceUrl: 'https://www.nvidia.com/en-us/about-nvidia/careers/',
    description: 'Optimize deep learning inference kernels and benchmark neural networks for edge computing platforms.',
    whyFit: {
      goalMatch: 'Prestigious engineering internship for aspiring AI/ML researchers.',
      domainMatch: 'Direct alignment with Data Science and Deep Learning.',
      skillMatch: 'Requires Python OOP & Scikit-Learn foundation from Phase 1.',
      roadmapImpact: 'Completing Phase 3 Predictive Pipeline project will boost confidence.'
    }
  },
  {
    id: 'opp-5',
    title: 'Junior Data Scientist',
    company: 'Airbnb',
    type: GOAL_TYPES.JOB,
    domain: DOMAINS.DATA_SCIENCE,
    location: 'Remote (US/Canada)',
    stipendOrSalary: '$130,000 - $155,000 / yr',
    deadline: '2026-10-25',
    daysLeft: 28,
    requiredSkills: ['A/B Testing', 'Python', 'Scikit-Learn', 'Statistical Inference'],
    sourceUrl: 'https://careers.airbnb.com',
    description: 'Design rigorous experimentation frameworks, run hypothesis tests on guest conversion, and deploy machine learning models.',
    whyFit: {
      goalMatch: 'Matches long-term Data Science employment objectives.',
      domainMatch: 'Applied Data Science & Product Experimentation.',
      skillMatch: 'Strong synergy with your hypothesis testing foundation.',
      roadmapImpact: 'Unlocks top 5% candidate tier with Phase 4 system design practice.'
    }
  },
  {
    id: 'opp-6',
    title: 'Frontend Developer Intern (React / TypeScript)',
    company: 'Figma',
    type: GOAL_TYPES.INTERNSHIP,
    domain: DOMAINS.WEB_DEV,
    location: 'San Francisco, CA / Hybrid',
    stipendOrSalary: '$52 - $60 / hr',
    deadline: '2026-10-08',
    daysLeft: 11,
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Web Performance'],
    sourceUrl: 'https://www.figma.com/careers/',
    description: 'Work with the Design Systems engineering team to build accessible, lightning-fast UI components used by millions of designers.',
    whyFit: {
      goalMatch: 'High reputation internship for modern web developers.',
      domainMatch: '100% matched to Web Development.',
      skillMatch: 'Matches React hooks and Tailwind CSS proficiencies.',
      roadmapImpact: 'Directly supported by completing your Phase 2 React Context and Phase 4 Lighthouse audit.'
    }
  },
  {
    id: 'opp-7',
    title: 'Full-Stack Software Engineer (Early Career)',
    company: 'Vercel',
    type: GOAL_TYPES.JOB,
    domain: DOMAINS.WEB_DEV,
    location: 'Remote Worldwide',
    stipendOrSalary: '$120,000 - $145,000 / yr',
    deadline: '2026-10-30',
    daysLeft: 33,
    requiredSkills: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    sourceUrl: 'https://vercel.com/careers',
    description: 'Develop next-generation frontend developer infrastructure, serverless runtimes, and developer collaboration workflows.',
    whyFit: {
      goalMatch: 'Premier full-time entry opportunity for modern web practitioners.',
      domainMatch: 'Web Development / Next.js ecosystem.',
      skillMatch: 'Matches React, modern CSS, and component architecture.',
      roadmapImpact: 'Completing Phase 3 Fullstack SaaS project ensures high match.'
    }
  },
  {
    id: 'opp-8',
    title: 'HackMIT 2026 - Global Student Hackathon',
    company: 'MIT TechX',
    type: GOAL_TYPES.HACKATHON,
    domain: DOMAINS.WEB_DEV,
    location: 'Cambridge, MA / Hybrid',
    stipendOrSalary: '$50,000 in Prizes & Grants',
    deadline: '2026-10-03',
    daysLeft: 6,
    requiredSkills: ['React', 'REST APIs', 'Fast Prototyping', 'Git'],
    sourceUrl: 'https://hackmit.org',
    description: 'Join 1,000+ top student builders for 36 hours of intensive product hacking with mentorship from top tech leaders.',
    whyFit: {
      goalMatch: 'Immediate credential and networking multiplier.',
      domainMatch: 'Web Development & Full-Stack Prototyping.',
      skillMatch: 'Your JavaScript and React stack is ready for fast iteration.',
      roadmapImpact: 'Fulfills Collaborative App milestone.'
    }
  },
  {
    id: 'opp-9',
    title: 'Cloud Infrastructure & DevOps Intern',
    company: 'Datadog',
    type: GOAL_TYPES.INTERNSHIP,
    domain: DOMAINS.CLOUD_AI,
    location: 'New York, NY / Remote',
    stipendOrSalary: '$50 - $58 / hr',
    deadline: '2026-10-18',
    daysLeft: 21,
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'Python', 'AWS'],
    sourceUrl: 'https://careers.datadoghq.com',
    description: 'Scale observability agents across millions of nodes, implement automated CI/CD pipelines, and tune Kubernetes workloads.',
    whyFit: {
      goalMatch: 'Premier internship in observability and cloud engineering.',
      domainMatch: 'Direct alignment with Cloud/AI.',
      skillMatch: 'Linux and networking fundamentals already completed in Phase 1.',
      roadmapImpact: 'Aligns with Phase 2 Docker containerization tasks.'
    }
  },
  {
    id: 'opp-10',
    title: 'AI Platform Engineer (Generative AI)',
    company: 'Scale AI',
    type: GOAL_TYPES.JOB,
    domain: DOMAINS.CLOUD_AI,
    location: 'San Francisco, CA',
    stipendOrSalary: '$140,000 - $175,000 / yr',
    deadline: '2026-11-05',
    daysLeft: 39,
    requiredSkills: ['Kubernetes', 'LangChain', 'Vector DBs', 'Python', 'IaC'],
    sourceUrl: 'https://scale.com/careers',
    description: 'Deploy enterprise-grade Large Language Model evaluation pipelines, orchestration engines, and high-throughput vector indexers.',
    whyFit: {
      goalMatch: 'Top tier early career AI Infrastructure role.',
      domainMatch: 'Cloud & Applied Generative AI.',
      skillMatch: 'Synergizes with Linux, Python, and container infrastructure.',
      roadmapImpact: 'Completing Phase 3 Production RAG project provides direct interview proof.'
    }
  },
  {
    id: 'opp-11',
    title: 'AWS Certified Solutions Architect (Associate) Voucher',
    company: 'Amazon Web Services',
    type: GOAL_TYPES.CERTIFICATION,
    domain: DOMAINS.CLOUD_AI,
    location: 'Online Exam',
    stipendOrSalary: '100% Student Exam Voucher + Credential',
    deadline: '2026-10-09',
    daysLeft: 12,
    requiredSkills: ['AWS IAM', 'VPC Architecture', 'EC2 & S3', 'High Availability'],
    sourceUrl: 'https://aws.amazon.com/certification/',
    description: 'Industry-standard accreditation validating expertise in designing distributed, resilient cloud architectures on AWS.',
    whyFit: {
      goalMatch: 'Validates cloud knowledge with employer-recognized badge.',
      domainMatch: 'Cloud/AI core architecture.',
      skillMatch: 'Overlaps with your completed Phase 1 Cloud Fundamentals.',
      roadmapImpact: 'Directly checks off Phase 4 Career Certification requirement.'
    }
  },
  {
    id: 'opp-12',
    title: 'Google Professional Data Analytics Certificate',
    company: 'Google Career Certificates',
    type: GOAL_TYPES.CERTIFICATION,
    domain: DOMAINS.DATA_ANALYTICS,
    location: 'Coursera / Self-Paced',
    stipendOrSalary: 'Employer Consortium Access',
    deadline: '2026-10-20',
    daysLeft: 23,
    requiredSkills: ['SQL', 'Spreadsheets', 'Tableau', 'R Programming'],
    sourceUrl: 'https://grow.google/certificates/data-analytics/',
    description: 'Equips students with job-ready data cleaning, SQL query, and visualization skills recognized by 150+ employer partners.',
    whyFit: {
      goalMatch: 'Accelerates qualification for full-time analyst roles.',
      domainMatch: 'Data Analytics.',
      skillMatch: 'Covers spreadsheet modeling and data storytelling.',
      roadmapImpact: 'Fulfills foundational portfolio proof.'
    }
  }
];

// Initial default user profile with academic credentials and professional links
const INITIAL_PROFILE = {
  fullName: 'Janvi Kaware',
  email: 'janvi.kaware@example.com',
  phone: '+91 98765 43210',
  college: 'National Institute of Technology',
  gradYear: '2027',
  targetGoal: GOAL_TYPES.INTERNSHIP,
  targetDomain: DOMAINS.DATA_ANALYTICS,
  skillLevel: 'Intermediate',
  resumeFileName: 'Janvi_Kaware_Resume_2026.pdf',
  linkedinUrl: 'https://linkedin.com/in/janvikaware',
  githubUrl: 'https://github.com/JanviKaware27',
  tenthMarks: '94.6%',
  twelfthMarks: '92.4%',
  gradCgpa: '8.85 CGPA',
  postGradCgpa: 'Pursuing / 8.60 SGPA',
  topSkills: ['SQL', 'Python', 'Power BI', 'Data Modeling', 'Statistics'],
  assessmentCompleted: true,
  assessmentScore: 67,
  skillGaps: ['Power BI DAX & Calculated Columns', 'E-Commerce Cohort Analysis']
};

// ============================================================================
// CONTEXT & STATE MANAGEMENT (WITH LOCALSTORAGE PERSISTENCE)
// ============================================================================

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('opportunityos_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [roadmaps, setRoadmaps] = useState(() => {
    try {
      const saved = localStorage.getItem('opportunityos_roadmaps');
      return saved ? JSON.parse(saved) : ROADMAP_TEMPLATES;
    } catch {
      return ROADMAP_TEMPLATES;
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('opportunityos_applications');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'app-seed-1',
          oppId: 'opp-1',
          title: 'Data Analyst Intern (Summer 2026)',
          company: 'Spotify Technology S.A.',
          type: GOAL_TYPES.INTERNSHIP,
          domain: DOMAINS.DATA_ANALYTICS,
          appliedDate: '2026-09-24 10:45 AM',
          status: 'Applied',
          sourceUrl: 'https://www.lifeatspotify.com/jobs'
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [quickApplyModalOpp, setQuickApplyModalOpp] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('pathpilot_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Global Search State for Direct Header Search
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const triggerSearch = (query) => {
    setGlobalSearchQuery(query);
    setActiveTab('radar');
  };

  const updateProfile = (updatedFields) => {
    setProfile((prev) => {
      const next = { ...prev, ...updatedFields };
      try {
        localStorage.setItem('opportunityos_profile', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Candidate Profile saved & verified for ⚡ Quick Apply!');
  };

  const login = (userEmail, userPassword) => {
    setIsAuthenticated(true);
    localStorage.setItem('pathpilot_auth', 'true');
    if (userEmail) {
      setProfile((prev) => ({
        ...prev,
        email: userEmail
      }));
    }
    showToast(`Welcome to QuickApply, ${profile.fullName.split(' ')[0]}!`);
  };

  const signup = (formData) => {
    const newProfile = {
      ...profile,
      fullName: formData.fullName || 'Student Pilot',
      email: formData.email || 'student@quickapply.dev',
      phone: formData.phone || profile.phone || '+91 98765 43210',
      college: formData.college || 'Institute of Technology',
      gradYear: formData.gradYear || '2027',
      resumeFileName: formData.resumeFileName || profile.resumeFileName || 'Janvi_Kaware_Resume_2026.pdf',
      resumeFileSize: formData.resumeFileSize || profile.resumeFileSize || '1.4 MB',
      linkedinUrl: formData.linkedinUrl || profile.linkedinUrl || '',
      githubUrl: formData.githubUrl || profile.githubUrl || '',
      tenthMarks: formData.tenthMarks || profile.tenthMarks || '',
      twelfthMarks: formData.twelfthMarks || profile.twelfthMarks || '',
      gradCgpa: formData.gradCgpa || profile.gradCgpa || '',
      postGradCgpa: formData.postGradCgpa || profile.postGradCgpa || '',
      targetDomain: formData.targetDomain || DOMAINS.DATA_ANALYTICS,
      targetGoal: formData.targetGoal || GOAL_TYPES.INTERNSHIP,
      assessmentCompleted: false,
      assessmentScore: 50
    };
    setProfile(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('pathpilot_auth', 'true');
    localStorage.setItem('opportunityos_profile', JSON.stringify(newProfile));
    setActiveTab('radar');
    setIsProfileModalOpen(false);
    showToast(`Welcome ${newProfile.fullName}! Your profile & PDF resume are ready for Quick Apply.`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pathpilot_auth');
    showToast('Logged out of QuickApply');
  };

  useEffect(() => {
    localStorage.setItem('opportunityos_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('opportunityos_roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  useEffect(() => {
    localStorage.setItem('opportunityos_applications', JSON.stringify(applications));
  }, [applications]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleTask = (domain, phaseId, taskId) => {
    setRoadmaps((prevRoadmaps) => {
      const domainPhases = prevRoadmaps[domain] || [];
      const updatedPhases = domainPhases.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return { ...task, completed: !task.completed };
          })
        };
      });
      return {
        ...prevRoadmaps,
        [domain]: updatedPhases
      };
    });
  };

  const currentDomainRoadmap = roadmaps[profile.targetDomain] || ROADMAP_TEMPLATES[DOMAINS.DATA_ANALYTICS];

  const overallReadinessScore = useMemo(() => {
    let totalWeight = 0;
    let completedWeight = 0;

    currentDomainRoadmap.forEach((phase) => {
      phase.tasks.forEach((task) => {
        totalWeight += task.weight || 10;
        if (task.completed) {
          completedWeight += task.weight || 10;
        }
      });
    });

    const roadmapPercent = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 50;
    const assessmentPercent = profile.assessmentScore !== undefined ? profile.assessmentScore : 70;
    const weightedScore = Math.round(roadmapPercent * 0.7 + assessmentPercent * 0.3);
    return Math.min(Math.max(weightedScore, 10), 100);
  }, [currentDomainRoadmap, profile.assessmentScore]);

  const calculateMatchScore = (opp) => {
    let score = 50;
    if (opp.domain === profile.targetDomain) score += 25;
    if (opp.type === profile.targetGoal) score += 15;
    score += Math.round((overallReadinessScore / 100) * 10);
    return Math.min(Math.max(score, 45), 98);
  };

  const submitApplication = (opp, customData = {}) => {
    const existingIndex = applications.findIndex((a) => a.oppId === opp.id);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (existingIndex >= 0) {
      setApplications((prev) => {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          status: 'Applied',
          appliedDate: formattedDate,
          ...customData
        };
        return copy;
      });
    } else {
      const newApp = {
        id: `app-${Date.now()}`,
        oppId: opp.id,
        title: opp.title,
        company: opp.company,
        type: opp.type,
        domain: opp.domain,
        appliedDate: formattedDate,
        status: 'Applied',
        sourceUrl: opp.sourceUrl,
        ...customData
      };
      setApplications((prev) => [newApp, ...prev]);
    }

    showToast(`⚡ Quick Apply submitted for ${opp.title}!`);
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    showToast(`Status updated to "${newStatus}"`);
  };

  const deleteApplication = (appId) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
    showToast('Application record removed');
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        roadmaps,
        setRoadmaps,
        currentDomainRoadmap,
        applications,
        activeTab,
        setActiveTab,
        overallReadinessScore,
        toggleTask,
        calculateMatchScore,
        quickApplyModalOpp,
        setQuickApplyModalOpp,
        submitApplication,
        updateApplicationStatus,
        deleteApplication,
        showToast,
        toastMessage,
        isAuthenticated,
        login,
        signup,
        logout,
        globalSearchQuery,
        setGlobalSearchQuery,
        triggerSearch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

// ============================================================================
// COMPONENT 0: PUBLIC STANDARD HEADER (LOGGED-OUT STATE)
// ============================================================================

export const PublicHeader = () => {
  const { login } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md transition-all shadow-md shadow-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-[2px] shadow-md shadow-blue-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                QuickApply
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Your Goal. Your Roadmap. Your Opportunities.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="hidden lg:flex items-center gap-5 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            Skill Assessment
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Dynamic Roadmap
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Radar className="w-3.5 h-3.5 text-emerald-400" />
            12+ Opportunities
          </span>
          <span className="flex items-center gap-1.5 text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            ⚡ 1-Click Quick Apply
          </span>
        </div>

        {/* Fast Action CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => login('janvi.kaware@example.com', 'password123')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ Demo Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// COMPONENT 1: STANDARD HEADER (WITH DIRECT SEARCH)
// ============================================================================

const Navbar = () => {
  const {
    profile,
    activeTab,
    setActiveTab,
    overallReadinessScore,
    logout,
    globalSearchQuery,
    triggerSearch,
    setIsProfileModalOpen
  } = useApp();

  const [headerSearchInput, setHeaderSearchInput] = useState(globalSearchQuery || '');

  useEffect(() => {
    setHeaderSearchInput(globalSearchQuery || '');
  }, [globalSearchQuery]);

  const handleHeaderSearchSubmit = (e) => {
    if (e) e.preventDefault();
    triggerSearch(headerSearchInput);
  };

  const navItems = [
    { id: 'direction', label: 'Find Direction', icon: Compass, badge: null },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'radar', label: 'Opportunities', icon: Radar, badge: '12 Live' },
    { id: 'applications', label: 'Applications', icon: FileCheck2, badge: null }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md transition-all shadow-md shadow-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-blue-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                QuickApply
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden xl:block tracking-wide">
              Your Goal. Your Roadmap. Your Opportunities.
            </p>
          </div>
        </div>

        {/* Global Direct Search Bar in Standard Header */}
        <form 
          onSubmit={handleHeaderSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-2 relative group"
        >
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search roles, companies (Spotify, Stripe) or skills..."
            value={headerSearchInput}
            onChange={(e) => setHeaderSearchInput(e.target.value)}
            className="w-full pl-9 pr-24 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-950 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {headerSearchInput && (
            <button
              type="button"
              onClick={() => {
                setHeaderSearchInput('');
                triggerSearch('');
              }}
              title="Clear search"
              className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Search</span>
            <span className="text-[9px] opacity-75 font-mono">↵</span>
          </button>
        </form>

        {/* Standard Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-slate-800/80 shadow-inner shadow-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Utilities (Readiness + User Avatar Profile Trigger + Sign Out) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Mobile direct search button */}
          <button
            onClick={() => setActiveTab('radar')}
            title="Search Opportunities"
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Readiness Score Widget */}
          <div
            onClick={() => setActiveTab('direction')}
            title="Readiness Score. Click to re-assess"
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all duration-200"
          >
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="w-7 h-7 -rotate-90">
                <circle cx="14" cy="14" r="11" className="stroke-slate-800" strokeWidth="2.5" fill="transparent" />
                <circle
                  cx="14" cy="14" r="11"
                  className="stroke-emerald-400 transition-all duration-500"
                  strokeWidth="2.5"
                  strokeDasharray="69.1"
                  strokeDashoffset={69.1 - (69.1 * overallReadinessScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-slate-200">{overallReadinessScore}%</span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Readiness</span>
              <span className="text-[11px] font-bold text-emerald-400 leading-none">
                {overallReadinessScore >= 80 ? 'Market Ready' : 'Building'}
              </span>
            </div>
          </div>

          {/* User profile button (Triggers Candidate Profile Dossier Modal) */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            title="View & Edit Candidate Profile (Academic Marks & Links)"
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'SP'}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight group-hover:text-blue-400 transition-colors">
                {profile.fullName || 'Student Pilot'}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>Profile</span>
                <span className="text-emerald-400 font-bold">• ⚡ Quick Apply</span>
              </span>
            </div>
            <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors hidden sm:block" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/40 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile nav items row */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium rounded-lg transition-colors ${
                isActive ? 'text-blue-400 bg-slate-900' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

// ============================================================================
// COMPONENT: USER PROFILE & ACADEMIC CREDENTIALS MODAL
// ============================================================================

const UserProfileModal = () => {
  const { profile, updateProfile, isProfileModalOpen, setIsProfileModalOpen } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    gradYear: '',
    linkedinUrl: '',
    githubUrl: '',
    tenthMarks: '',
    twelfthMarks: '',
    gradCgpa: '',
    postGradCgpa: '',
    targetDomain: '',
    targetGoal: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        college: profile.college || '',
        gradYear: profile.gradYear || '2027',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        tenthMarks: profile.tenthMarks || '',
        twelfthMarks: profile.twelfthMarks || '',
        gradCgpa: profile.gradCgpa || '',
        postGradCgpa: profile.postGradCgpa || '',
        targetDomain: profile.targetDomain || DOMAINS.DATA_ANALYTICS,
        targetGoal: profile.targetGoal || GOAL_TYPES.INTERNSHIP
      });
    }
  }, [profile, isProfileModalOpen]);

  if (!isProfileModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsProfileModalOpen(false);
  };

  const handleQuickDemoFill = () => {
    setFormData((prev) => ({
      ...prev,
      phone: '+91 98765 43210',
      linkedinUrl: 'https://linkedin.com/in/janvikaware',
      githubUrl: 'https://github.com/JanviKaware27',
      tenthMarks: '94.6%',
      twelfthMarks: '92.4%',
      gradCgpa: '8.85 CGPA',
      postGradCgpa: 'Pursuing / 8.60 SGPA'
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 p-[2px] shadow-lg shadow-blue-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <User className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Student Candidate Profile</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ⚡ Quick Apply Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              These credentials are auto-filled for 1-click Quick Apply submissions across jobs & hackathons.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact & Social Links */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-blue-400" /> Contact & Social Profiles
              </span>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline"
              >
                Auto-fill verified demo data
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">LinkedIn Profile Link</label>
                <div className="relative">
                  <div className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[11px]">in</div>
                  <input
                    type="url"
                    required
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">GitHub Profile Link</label>
                <div className="relative">
                  <div className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] font-bold">gh</div>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/username"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Records */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Academic Dossier (10th, 12th & Higher Ed)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">10th Class Marks (%)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 94.6% or 9.4 CGPA"
                  value={formData.tenthMarks}
                  onChange={(e) => setFormData({ ...formData, tenthMarks: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">12th Class Marks (%)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 92.4% or 920/1000"
                  value={formData.twelfthMarks}
                  onChange={(e) => setFormData({ ...formData, twelfthMarks: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Graduation SGPA / CGPA</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8.85 CGPA / 10.0"
                  value={formData.gradCgpa}
                  onChange={(e) => setFormData({ ...formData, gradCgpa: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Post Graduation SGPA / CGPA</label>
                <input
                  type="text"
                  placeholder="e.g. 8.60 CGPA or Pursuing / N/A"
                  value={formData.postGradCgpa}
                  onChange={(e) => setFormData({ ...formData, postGradCgpa: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Education Details */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
              <Building className="w-3.5 h-3.5 text-amber-400" /> College & General Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">College / University</label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Verify Candidate Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 2: ONBOARDING & ASSESSMENT FLOW ("Find Direction")
// ============================================================================

const OnboardingAssessment = () => {
  const { profile, setProfile, setActiveTab, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(profile.targetGoal || GOAL_TYPES.INTERNSHIP);
  const [selectedDomain, setSelectedDomain] = useState(profile.targetDomain || DOMAINS.DATA_ANALYTICS);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState(profile.skillLevel || 'Intermediate');
  
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const currentQuestions = DIAGNOSTIC_QUESTIONS[selectedDomain] || DIAGNOSTIC_QUESTIONS[DOMAINS.DATA_ANALYTICS];

  const handleAnswerSelect = (questionId, optionIndex) => {
    setDiagnosticAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinishAssessment = () => {
    let correctCount = 0;
    const gaps = [];

    currentQuestions.forEach((q) => {
      const userAnswer = diagnosticAnswers[q.id];
      if (userAnswer === q.correct) {
        correctCount += 1;
      } else {
        gaps.push(q.skillGap);
      }
    });

    const scorePercentage = Math.round((correctCount / currentQuestions.length) * 100);

    const updatedProfile = {
      ...profile,
      targetGoal: selectedGoal,
      targetDomain: selectedDomain,
      skillLevel: selectedSkillLevel,
      assessmentCompleted: true,
      assessmentScore: scorePercentage,
      skillGaps: gaps.length > 0 ? gaps : ['Advanced System Architecture Mastery']
    };

    setProfile(updatedProfile);
    setAssessmentSubmitted(true);
    showToast(`Direction updated! Assessment Score: ${scorePercentage}%`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Career Diagnostic & Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Find Your High-Probability Direction
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto mt-2 text-sm sm:text-base">
          Calibrate your career goals, evaluate existing skill competencies, and instantly generate your tailored roadmap & radar.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { num: 1, title: 'Target Goal' },
          { num: 2, title: 'Domain' },
          { num: 3, title: 'Skill Level' },
          { num: 4, title: 'Diagnostic' }
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => !assessmentSubmitted && setStep(s.num)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              step === s.num
                ? 'bg-blue-950/40 border-blue-500 text-white'
                : step > s.num
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num ? 'bg-blue-500 text-white' : step > s.num ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="text-xs font-semibold hidden sm:inline">{s.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Step 1: What is your primary career goal?</h2>
            <p className="text-sm text-slate-400 mb-6">
              PATHPILOT tailors deadlines, application prompts, and roadmap rigor to your current target.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: GOAL_TYPES.INTERNSHIP,
                  icon: GraduationCap,
                  title: 'Summer / Winter Internship',
                  desc: 'Target paid industry internships with summer 2026 conversion pathways.'
                },
                {
                  id: GOAL_TYPES.JOB,
                  icon: Briefcase,
                  title: 'Full-Time Entry Role (Job)',
                  desc: 'For graduating seniors targeting early-career software or analyst positions.'
                },
                {
                  id: GOAL_TYPES.HACKATHON,
                  icon: Trophy,
                  title: 'Hackathons & Competitions',
                  desc: 'Sprint to build portfolio projects, earn prize capital, and get scouted.'
                },
                {
                  id: GOAL_TYPES.CERTIFICATION,
                  icon: Award,
                  title: 'Industry Certifications',
                  desc: 'Acquire verified credentials (AWS, Google, Microsoft) with student vouchers.'
                }
              ].map((g) => {
                const Icon = g.icon;
                const isSelected = selectedGoal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-400 bg-blue-500 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">{g.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{g.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <span>Continue to Domain Selector</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Step 2: Choose your domain specialization</h2>
            <p className="text-sm text-slate-400 mb-6">
              Select the technical domain you want to master. We configure your skill benchmarks accordingly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: DOMAINS.DATA_ANALYTICS,
                  title: 'Data Analytics',
                  tag: 'High Industry Demand',
                  skills: ['SQL Window Functions', 'Power BI / DAX', 'Data Storytelling', 'Python Analytics']
                },
                {
                  id: DOMAINS.DATA_SCIENCE,
                  title: 'Data Science & Machine Learning',
                  tag: 'Rigor & Research',
                  skills: ['Scikit-Learn', 'PyTorch', 'Statistical Inference', 'Predictive Pipelines']
                },
                {
                  id: DOMAINS.WEB_DEV,
                  title: 'Modern Web Development',
                  tag: 'Product & SaaS',
                  skills: ['React 18', 'Tailwind CSS', 'Next.js', 'REST & GraphQL APIs']
                },
                {
                  id: DOMAINS.CLOUD_AI,
                  title: 'Cloud Infrastructure & GenAI',
                  tag: 'Emerging & High Comp',
                  skills: ['Docker & K8s', 'Terraform (IaC)', 'LangChain & RAG', 'AWS / GCP Architecture']
                }
              ].map((d) => {
                const isSelected = selectedDomain === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDomain(d.id);
                      setDiagnosticAnswers({});
                    }}
                    className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {d.tag}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-blue-400 bg-blue-500 text-white' : 'border-slate-700'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <h3 className="font-bold text-base mb-2">{d.title}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {d.skills.map((sk) => (
                          <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <span>Continue to Skill Level</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Step 3: Self-Assessed Skill Baseline</h2>
            <p className="text-sm text-slate-400 mb-6">
              How comfortable do you feel in {selectedDomain} right now?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  level: 'Beginner',
                  desc: 'Learning syntax, basic concepts, and building introductory projects.',
                  badge: 'Starting Out'
                },
                {
                  level: 'Intermediate',
                  desc: 'Comfortable with core libraries, practical APIs, and debugging problems independently.',
                  badge: 'Standard Student Tier'
                },
                {
                  level: 'Advanced',
                  desc: 'Able to architect end-to-end applications, optimize performance, and mentor peers.',
                  badge: 'High Readiness'
                }
              ].map((lvl) => {
                const isSelected = selectedSkillLevel === lvl.level;
                return (
                  <div
                    key={lvl.level}
                    onClick={() => setSelectedSkillLevel(lvl.level)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400">{lvl.badge}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{lvl.level}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{lvl.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <span>Take Diagnostic Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {!assessmentSubmitted ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Step 4: Interactive Diagnostic Assessment</h2>
                    <p className="text-sm text-slate-400">
                      Answer these 3 fast domain questions to calibrate your real-world Readiness Score.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                    {selectedDomain}
                  </span>
                </div>

                <div className="space-y-6 my-6">
                  {currentQuestions.map((q, qIndex) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-start gap-2.5 mb-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {qIndex + 1}
                        </span>
                        <p className="text-sm font-semibold text-slate-200 pt-0.5">{q.question}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                        {q.options.map((opt, optIndex) => {
                          const isPicked = diagnosticAnswers[q.id] === optIndex;
                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleAnswerSelect(q.id, optIndex)}
                              className={`p-2.5 text-left text-xs rounded-lg border transition-all flex items-center justify-between ${
                                isPicked
                                  ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                              }`}
                            >
                              <span>{opt}</span>
                              {isPicked && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
                  >
                    Back
                  </button>

                  <button
                    onClick={handleFinishAssessment}
                    disabled={Object.keys(diagnosticAnswers).length < currentQuestions.length}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                      Object.keys(diagnosticAnswers).length >= currentQuestions.length
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Calculate Readiness & Generate Plan</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Direction Calibrated Successfully!</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Your profile has been synchronized with the latest benchmarks for {profile.targetDomain}.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left mb-8">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Diagnostic Score</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-emerald-400">{profile.assessmentScore}%</span>
                      <span className="text-xs text-slate-500">Benchmark score</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Identified Skill Gaps</span>
                    <div className="mt-2 space-y-1">
                      {profile.skillGaps.map((gap, i) => (
                        <div key={i} className="text-xs text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/25"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>View Student Dashboard</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('radar')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Radar className="w-4 h-4 text-emerald-400" />
                    <span>Explore Opportunity Radar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 3: STUDENT DASHBOARD
// ============================================================================

const Dashboard = () => {
  const {
    profile,
    currentDomainRoadmap,
    overallReadinessScore,
    toggleTask,
    setActiveTab,
    applications
  } = useApp();

  const topSkillGap = profile.skillGaps?.[0] || 'Interactive Dashboard Deployment';

  const chartData = [
    { name: 'Completed', value: overallReadinessScore },
    { name: 'Remaining Gap', value: 100 - overallReadinessScore }
  ];
  const COLORS = ['#10b981', '#1e293b'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-900/40 p-6 sm:p-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Target: {profile.targetGoal} in {profile.targetDomain}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {profile.skillLevel} Level
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {profile.fullName.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              PATHPILOT has indexed 12 matching positions based on your current readiness score of{' '}
              <span className="text-emerald-400 font-bold">{overallReadinessScore}%</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Applications</span>
              <span className="text-xl font-bold text-white">{applications.length}</span>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Radar Matches</span>
              <span className="text-xl font-bold text-blue-400">12</span>
            </div>
            <button
              onClick={() => setActiveTab('radar')}
              className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Radar</span>
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-blue-900/20 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500 text-white shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400">
                Recommended Next Best Action
              </span>
              <p className="text-sm font-semibold text-slate-100 mt-0.5">
                Complete "{topSkillGap}" to close your biggest skill gap and boost readiness to 85%+.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('roadmap-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 transition-colors whitespace-nowrap"
          >
            Review Roadmap Task →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Overall Readiness Score</span>
            </h2>
            <span className="text-xs text-slate-400">Real-time meter</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Aggregated metric weighted by your verified roadmap tasks and diagnostic assessments.
          </p>

          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, '']}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white">{overallReadinessScore}%</span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                {overallReadinessScore >= 80 ? 'Market Ready' : 'In Progress'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Completed: {overallReadinessScore}%</span>
            <span>Target: 95%+ for Tier-1</span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Target Competency Breakdown</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-leverage gaps currently blocking 90%+ qualification in {profile.targetDomain}.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('direction')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Re-assess
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Priority Skill Gaps
                </span>
                <ul className="space-y-2">
                  {profile.skillGaps.map((gap, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{gap}</span>
                    </li>
                  ))}
                  <li className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>STAR Behavioral Case Study Pitch</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Verified Core Strengths
                </span>
                <ul className="space-y-2">
                  {profile.topSkills.map((sk, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{sk}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Domain: <strong className="text-slate-200">{profile.targetDomain}</strong></span>
            <span>Target Level: <strong className="text-slate-200">{profile.skillLevel}</strong></span>
          </div>
        </div>
      </div>

      <div id="roadmap-section" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Dynamic Career Roadmap</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Toggle checkboxes to mark tasks completed. Every completion dynamically recalculates your Readiness Score in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Live LocalStorage Persistence</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentDomainRoadmap.map((phase, phaseIndex) => {
            const completedCount = phase.tasks.filter((t) => t.completed).length;
            const isPhaseDone = completedCount === phase.tasks.length;

            return (
              <div
                key={phase.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isPhaseDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                      Phase {phaseIndex + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPhaseDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {completedCount} / {phase.tasks.length}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-1">{phase.phaseName}</h3>
                  <p className="text-[11px] text-slate-400 mb-4 leading-tight">{phase.description}</p>

                  <div className="space-y-2.5">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(profile.targetDomain, phase.id, task.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-start gap-2.5 transition-all ${
                          task.completed
                            ? 'bg-emerald-900/20 border-emerald-500/30 text-slate-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                          )}
                        </div>
                        <span className={`leading-snug ${task.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Weight: {phase.tasks.reduce((acc, t) => acc + (t.weight || 10), 0)} pts</span>
                  <span>{isPhaseDone ? 'Completed' : 'In Progress'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 4: OPPORTUNITY RADAR (RECOMMENDATION ENGINE)
// ============================================================================

const OpportunityRadar = () => {
  const {
    profile,
    calculateMatchScore,
    setQuickApplyModalOpp,
    applications,
    globalSearchQuery,
    setGlobalSearchQuery
  } = useApp();

  const [activeRadarTab, setActiveRadarTab] = useState('forYou');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');
  const [expandedWhyId, setExpandedWhyId] = useState(null);

  // Synchronize with header direct search
  useEffect(() => {
    setSearchQuery(globalSearchQuery || '');
  }, [globalSearchQuery]);

  const handleRadarSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setGlobalSearchQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setGlobalSearchQuery('');
  };

  const isApplied = (oppId) => applications.some((a) => a.oppId === oppId && a.status === 'Applied');

  const filteredOpportunities = useMemo(() => {
    return MOCK_OPPORTUNITIES.filter((opp) => {
      if (selectedDomainFilter !== 'ALL' && opp.domain !== selectedDomainFilter) return false;
      if (selectedTypeFilter !== 'ALL' && opp.type !== selectedTypeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesCompany = opp.company.toLowerCase().includes(q);
        const matchesDomain = opp.domain.toLowerCase().includes(q);
        const matchesType = opp.type.toLowerCase().includes(q);
        const matchesSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesDesc = opp.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesDomain && !matchesType && !matchesDesc) return false;
      }

      if (activeRadarTab === 'forYou') {
        return true;
      }
      if (activeRadarTab === 'deadlines') {
        return opp.daysLeft <= 15;
      }
      if (activeRadarTab === 'nextRoadmap') {
        return opp.domain === profile.targetDomain;
      }
      return true;
    }).sort((a, b) => {
      if (activeRadarTab === 'deadlines') {
        return a.daysLeft - b.daysLeft;
      }
      return calculateMatchScore(b) - calculateMatchScore(a);
    });
  }, [activeRadarTab, selectedDomainFilter, selectedTypeFilter, searchQuery, profile, calculateMatchScore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Radar className="w-3.5 h-3.5" />
            <span>Deterministic Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Opportunity Radar
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time opportunities with algorithmic match percentages and instant ⚡ Quick Apply verification.
          </p>
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {[
            { id: 'forYou', label: '🔥 For You' },
            { id: 'deadlines', label: "⏰ Don't Miss" },
            { id: 'nextRoadmap', label: '🎯 Roadmap Aligned' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveRadarTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRadarTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Interactive Search Bar */}
      <form onSubmit={handleRadarSearchSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by role, company (e.g. Spotify, Stripe), or skill (e.g. SQL, React)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setGlobalSearchQuery(e.target.value);
            }}
            className="w-full pl-10 pr-24 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              title="Clear search"
              className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={selectedDomainFilter}
            onChange={(e) => setSelectedDomainFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Domains</option>
            <option value={DOMAINS.DATA_ANALYTICS}>Data Analytics</option>
            <option value={DOMAINS.DATA_SCIENCE}>Data Science</option>
            <option value={DOMAINS.WEB_DEV}>Web Development</option>
            <option value={DOMAINS.CLOUD_AI}>Cloud / AI</option>
          </select>

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value={GOAL_TYPES.JOB}>Jobs</option>
            <option value={GOAL_TYPES.INTERNSHIP}>Internships</option>
            <option value={GOAL_TYPES.HACKATHON}>Hackathons</option>
            <option value={GOAL_TYPES.CERTIFICATION}>Certifications</option>
          </select>
        </div>
      </form>

      {/* Search Feedback & Results Count */}
      {searchQuery.trim() ? (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs">
          <span className="text-slate-300">
            Showing <strong className="text-blue-400 font-bold">{filteredOpportunities.length}</strong> matching opportunities for &ldquo;<span className="text-white font-semibold">{searchQuery}</span>&rdquo;
          </span>
          <button
            onClick={handleClearSearch}
            className="text-blue-400 hover:text-blue-300 font-semibold underline text-xs"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing <strong className="text-white font-bold">{filteredOpportunities.length}</strong> matching opportunities</span>
          <span>Target: <strong className="text-blue-400">{profile.targetGoal}</strong> in <strong className="text-blue-400">{profile.targetDomain}</strong></span>
        </div>
      )}

      {/* Empty State when no results match */}
      {filteredOpportunities.length === 0 && (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Opportunities Found</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto mb-4">
            We couldn&apos;t find any positions matching &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;Spotify&rdquo;, &ldquo;Stripe&rdquo;, &ldquo;SQL&rdquo;, or &ldquo;Frontend&rdquo;.
          </p>
          <button
            onClick={() => {
              handleClearSearch();
              setSelectedDomainFilter('ALL');
              setSelectedTypeFilter('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md"
          >
            Reset Filters & View All 12 Opportunities
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opp) => {
          const matchScore = calculateMatchScore(opp);
          const isWhyExpanded = expandedWhyId === opp.id;
          const applied = isApplied(opp.id);

          return (
            <div
              key={opp.id}
              className={`rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                applied
                  ? 'bg-slate-900/60 border-slate-800 opacity-90'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-950/20'
              }`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {opp.type}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {opp.domain}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                      matchScore >= 85
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : matchScore >= 70
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {matchScore}% Match
                  </span>
                </div>

                <h3 className="font-bold text-base text-white hover:text-blue-300 transition-colors line-clamp-1">
                  {opp.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 mb-2">
                  <Building className="w-3.5 h-3.5" />
                  <span className="font-medium text-slate-300">{opp.company}</span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                  <span>{opp.location}</span>
                  <span className="font-semibold text-slate-200">{opp.stipendOrSalary}</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {opp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {opp.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 mb-2">
                  <button
                    onClick={() => setExpandedWhyId(isWhyExpanded ? null : opp.id)}
                    className="w-full flex items-center justify-between text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>Why am I seeing this?</span>
                    </span>
                    {isWhyExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isWhyExpanded && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-300">
                      <div>
                        <strong className="text-slate-400">Goal Fit:</strong> {opp.whyFit.goalMatch}
                      </div>
                      <div>
                        <strong className="text-slate-400">Skill Match:</strong> {opp.whyFit.skillMatch}
                      </div>
                      <div>
                        <strong className="text-emerald-400">Roadmap Impact:</strong> {opp.whyFit.roadmapImpact}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border-t border-slate-800/90 rounded-b-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className={`w-3.5 h-3.5 ${opp.daysLeft <= 7 ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className={opp.daysLeft <= 7 ? 'text-amber-400 font-semibold' : ''}>
                    {opp.daysLeft <= 7 ? `Only ${opp.daysLeft}d left!` : `Due: ${opp.deadline}`}
                  </span>
                </div>

                {applied ? (
                  <button
                    disabled
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 cursor-default"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setQuickApplyModalOpp(opp)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>⚡ QUICK APPLY</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 5: ⚡ QUICK APPLY ASSISTANT (MODAL)
// ============================================================================

const QuickApplyModal = () => {
  const {
    profile,
    quickApplyModalOpp,
    setQuickApplyModalOpp,
    submitApplication,
    setActiveTab,
    setIsProfileModalOpen
  } = useApp();

  if (!quickApplyModalOpp) return null;

  const handleContinueToOfficial = () => {
    submitApplication(quickApplyModalOpp);
    if (quickApplyModalOpp.sourceUrl) {
      window.open(quickApplyModalOpp.sourceUrl, '_blank', 'noopener,noreferrer');
    }
    setQuickApplyModalOpp(null);
    setActiveTab('applications');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={() => setQuickApplyModalOpp(null)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ QUICK APPLY ASSISTANT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Application Ready — Saved Profile Auto-filled
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Applying for <strong className="text-slate-200">{quickApplyModalOpp.title}</strong> at{' '}
            <strong className="text-blue-400">{quickApplyModalOpp.company}</strong>.
          </p>
        </div>

        {/* Auto-Filled Candidate Dossier */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3 mb-5">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Auto-Filled Candidate Dossier
            </span>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 text-[11px] font-semibold flex items-center gap-1 underline"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Full Name</span>
              <span className="text-slate-200 font-semibold">{profile.fullName || 'Student Candidate'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Email Address</span>
              <span className="text-slate-200 font-semibold truncate block">{profile.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Phone Number</span>
              <span className="text-slate-200 font-semibold">{profile.phone || '+91 98765 43210'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">College / Graduation</span>
              <span className="text-slate-200 font-semibold truncate block">{profile.college} ({profile.gradYear})</span>
            </div>
          </div>

          {/* Academic Records Breakdown */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 block text-[11px] font-semibold mb-1.5 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Verified Academic Credentials
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="block text-[10px] text-slate-400 font-medium">10th Class</span>
                <span className="text-xs font-bold text-emerald-400">{profile.tenthMarks || '94.6%'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="block text-[10px] text-slate-400 font-medium">12th Class</span>
                <span className="text-xs font-bold text-emerald-400">{profile.twelfthMarks || '92.4%'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="block text-[10px] text-slate-400 font-medium">Grad CGPA</span>
                <span className="text-xs font-bold text-blue-400">{profile.gradCgpa || '8.85 CGPA'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="block text-[10px] text-slate-400 font-medium">Post Grad</span>
                <span className="text-xs font-bold text-indigo-300 truncate block">{profile.postGradCgpa || '8.60 SGPA'}</span>
              </div>
            </div>
          </div>

          {/* Social Profiles & Resume */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] mb-0.5">LinkedIn Profile</span>
              {profile.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 truncate"
                >
                  <span className="text-[11px] truncate">{profile.linkedinUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="text-slate-400 italic text-[11px]">Not provided</span>
              )}
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] mb-0.5">GitHub Profile</span>
              {profile.githubUrl ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white font-semibold flex items-center gap-1 truncate"
                >
                  <span className="text-[11px] truncate">{profile.githubUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="text-slate-400 italic text-[11px]">Not provided</span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Attached Resume:</span>
            <span className="text-blue-400 font-semibold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {profile.resumeFileName}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-slate-500 block text-[10px] mb-1.5">Core Skills Forwarded</span>
            <div className="flex flex-wrap gap-1">
              {profile.topSkills.map((sk) => (
                <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 mb-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-amber-300 mb-0.5">
              🔐 Verification & 1-Click Hand-Off
            </h4>
            <p className="text-amber-200/80 leading-relaxed text-[11px]">
              QuickApply packages your 10th, 12th, CGPA records, LinkedIn and GitHub handles directly. Complete any required CAPTCHA on the official portal.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-1">
          <button
            onClick={() => setQuickApplyModalOpp(null)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleContinueToOfficial}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30"
          >
            <span>Continue to Official Application 🚀</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 6: APPLICATION TRACKER
// ============================================================================

const ApplicationTracker = () => {
  const { applications, updateApplicationStatus, deleteApplication, setActiveTab } = useApp();

  const STATUS_OPTIONS = ['Saved', 'Applied', 'Interview', 'Selected'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>End-to-End Application Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Application Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time timestamp records of applications submitted through ⚡ Quick Apply and saved radar opportunities.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('radar')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 w-fit"
        >
          <Radar className="w-4 h-4" />
          <span>Discover More Opportunities</span>
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Applications Tracked Yet</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">
              Use "⚡ QUICK APPLY" on Opportunity Radar to instantly autofill and track submissions here.
            </p>
            <button
              onClick={() => setActiveTab('radar')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-2"
            >
              <span>Explore Opportunity Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Opportunity & Company</th>
                  <th className="py-4 px-4">Domain / Type</th>
                  <th className="py-4 px-4">Submitted Timestamp</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-100">{app.title}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-500" />
                        <span>{app.company}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {app.type}
                        </span>
                        <span className="text-[11px] text-slate-400">{app.domain}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{app.appliedDate || 'Pending'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          app.status === 'Selected'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : app.status === 'Interview'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : app.status === 'Applied'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st} className="bg-slate-900 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.sourceUrl && (
                          <a
                            href={app.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Visit Official Portal"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors"
                          title="Remove application record"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// TOAST NOTIFICATION COMPONENT
// ============================================================================

const ToastNotification = () => {
  const { toastMessage } = useApp();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: AUTH GATE (SIGN UP / LOG IN)
// ============================================================================

const AuthGate = () => {
  const { login, signup } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFileName, setResumeFileName] = useState('Janvi_Kaware_Resume_2026.pdf');
  const [resumeFileSize, setResumeFileSize] = useState('1.4 MB');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [tenthMarks, setTenthMarks] = useState('');
  const [twelfthMarks, setTwelfthMarks] = useState('');
  const [gradCgpa, setGradCgpa] = useState('');
  const [postGradCgpa, setPostGradCgpa] = useState('');
  const [gradYear, setGradYear] = useState('2027');
  const [targetDomain, setTargetDomain] = useState(DOMAINS.DATA_ANALYTICS);
  const [targetGoal, setTargetGoal] = useState(GOAL_TYPES.INTERNSHIP);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState('');

  const handleResumeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setFormError('Please select a valid PDF document (.pdf format only).');
        return;
      }
      setFormError('');
      setResumeFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setResumeFileSize(`${parseFloat(sizeMB) > 0 ? sizeMB : '0.8'} MB`);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }
    login(email, password);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!fullName || !email || !password) {
      setFormError('Please fill in your full name, email, and password.');
      return;
    }
    signup({
      fullName,
      email,
      phone: phone || '+91 98765 43210',
      college: college || 'National Institute of Technology',
      gradYear: gradYear || '2027',
      resumeFileName: resumeFileName || 'Janvi_Kaware_Resume_2026.pdf',
      resumeFileSize: resumeFileSize || '1.4 MB',
      linkedinUrl: linkedinUrl || 'https://linkedin.com/in/janvikaware',
      githubUrl: githubUrl || 'https://github.com/JanviKaware27',
      tenthMarks: tenthMarks || '94.6%',
      twelfthMarks: twelfthMarks || '92.4%',
      gradCgpa: gradCgpa || '8.85 CGPA',
      postGradCgpa: postGradCgpa || 'Pursuing / 8.60 SGPA',
      targetDomain,
      targetGoal
    });
  };

  const handleDemoAccess = () => {
    login('janvi.kaware@example.com', 'password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-xl">
        {/* Left Column: Brand Hero */}
        <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-b from-blue-950/60 via-slate-900/90 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-[2px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                  QuickApply
                </span>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Career Acceleration OS
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
              Your Goal.<br />Your Roadmap.<br /><span className="text-emerald-400">Your Opportunities.</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-8">
              Join students eliminating application fatigue with intelligent skill assessment, dynamic roadmaps, verified radar, and 1-click Quick Apply.
            </p>

            <div className="space-y-3.5 mb-8">
              {[
                { icon: Compass, title: 'Diagnostic Assessment', desc: 'Instant domain readiness benchmarking' },
                { icon: Layers, title: 'Dynamic 4-Phase Roadmap', desc: 'Real-time score recalculation as you complete tasks' },
                { icon: Radar, title: 'Opportunity Radar', desc: '12+ live verified positions with match metrics' },
                { icon: Zap, title: '⚡ Quick Apply Assistant', desc: 'Pre-filled profiles with 10th, 12th & CGPA credentials' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80 text-blue-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Student First • 100% Free</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active Platform
            </span>
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setFormError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setFormError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Button */}
          <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-emerald-950/20 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-200">
                Evaluating? Jump in instantly as <strong>Janvi Kaware</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all whitespace-nowrap shadow-sm"
            >
              ⚡ Quick Demo Access
            </button>
          </div>

          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-blue-400 hover:underline cursor-pointer">
                  Student support
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 mt-2"
              >
                <span>Sign In to QuickApply</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM WITH PROFILE CREDENTIALS INTAKE */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Janvi Kaware"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    College / University
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Institute of Tech"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@univ.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-8 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile & Academic Dossier Fields */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Quick Apply Profile Dossier (Auto-Filled)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ⚡ 1-Click Hand-Off
                  </span>
                </div>

                {/* Resume PDF File Upload */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-red-400" />
                      <span>Resume in PDF format *</span>
                    </label>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      ✓ Ready for Quick Apply
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between min-w-0">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold uppercase font-mono">PDF</span>
                        <span className="text-xs font-medium text-slate-200 truncate">{resumeFileName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-2">{resumeFileSize}</span>
                    </div>
                    <label className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shrink-0 transition-all shadow-sm text-center">
                      <span>Choose PDF</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleResumeFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-8 pr-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-0.5">LinkedIn Profile Link</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-medium text-slate-400 mb-0.5">GitHub Profile Link</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-0.5">10th Class Marks (%)</label>
                    <input
                      type="text"
                      placeholder="e.g. 94.6%"
                      value={tenthMarks}
                      onChange={(e) => setTenthMarks(e.target.value)}
                      className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-0.5">12th Class Marks (%)</label>
                    <input
                      type="text"
                      placeholder="e.g. 92.4%"
                      value={twelfthMarks}
                      onChange={(e) => setTwelfthMarks(e.target.value)}
                      className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Graduation SGPA/CGPA</label>
                    <input
                      type="text"
                      placeholder="e.g. 8.85 CGPA"
                      value={gradCgpa}
                      onChange={(e) => setGradCgpa(e.target.value)}
                      className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Post Graduation SGPA/CGPA</label>
                    <input
                      type="text"
                      placeholder="e.g. 8.60 CGPA / Pursuing"
                      value={postGradCgpa}
                      onChange={(e) => setPostGradCgpa(e.target.value)}
                      className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Target Domain
                  </label>
                  <select
                    value={targetDomain}
                    onChange={(e) => setTargetDomain(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value={DOMAINS.DATA_ANALYTICS}>Data Analytics</option>
                    <option value={DOMAINS.DATA_SCIENCE}>Data Science</option>
                    <option value={DOMAINS.WEB_DEV}>Web Development</option>
                    <option value={DOMAINS.CLOUD_AI}>Cloud / AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Target Goal
                  </label>
                  <select
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value={GOAL_TYPES.INTERNSHIP}>Summer / Winter Internship</option>
                    <option value={GOAL_TYPES.JOB}>Full-Time Early Career Job</option>
                    <option value={GOAL_TYPES.HACKATHON}>Hackathons & Competitions</option>
                    <option value={GOAL_TYPES.CERTIFICATION}>Industry Certifications</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 mt-2"
              >
                <span>Complete Profile & Start Roadmap 🚀</span>
              </button>
            </form>
          )}

          <div className="mt-5 text-center text-[11px] text-slate-500">
            {authMode === 'login' ? (
              <span>
                New to QuickApply?{' '}
                <button
                  onClick={() => { setAuthMode('signup'); setFormError(''); }}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => { setAuthMode('login'); setFormError(''); }}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT (SINGLE FILE ENTRY)
// ============================================================================

export default function App() {
  return (
    <AppProvider>
      <PathPilotContent />
    </AppProvider>
  );
}

function PathPilotContent() {
  const { isAuthenticated, activeTab } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <AuthGate />
        </main>
        <ToastNotification />
        <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>QuickApply © 2026 • Student Career Acceleration Platform</span>
            <span className="text-slate-400 font-medium">Your Goal. Your Roadmap. Your Opportunities.</span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-16">
        {activeTab === 'direction' && <OnboardingAssessment />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'radar' && <OpportunityRadar />}
        {activeTab === 'applications' && <ApplicationTracker />}
      </main>

      <QuickApplyModal />
      <UserProfileModal />
      <ToastNotification />

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>QuickApply © 2026 • Student Career Acceleration Platform</span>
          <span className="text-slate-400 font-medium">Your Goal. Your Roadmap. Your Opportunities.</span>
        </div>
      </footer>
    </div>
  );
}
