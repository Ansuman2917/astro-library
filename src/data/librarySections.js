export const BOOK_RADIUS = 8.45;
export const SECTION_RADIUS = 8.12;

const RESUME_URL = `${import.meta.env.BASE_URL}resume/Arshia_Swain_OnePager.pdf`;

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'arshia.swain@accenture.com',
    href: 'mailto:arshia.swain@accenture.com',
  },
  {
    label: 'Phone',
    value: '+91 7653094680',
    href: 'tel:+917653094680',
  },
  {
    label: 'Resume PDF',
    value: 'Open one-page resume',
    href: RESUME_URL,
    external: true,
  },
];

export const polar = (angleDeg, radius, y = 0) => {
  const a = (angleDeg * Math.PI) / 180;
  return [Math.cos(a) * radius, y, Math.sin(a) * radius];
};

export const books = [
  {
    id: 'homematcher',
    title: 'HomeMatch — Personalized Real Estate Agent',
    author: 'Personal project',
    year: 'Generative AI',
    sectionId: 'cartography',
    level: 0,
    angle: 20,
    color: '#7dd3fc',
    constellation: 'RAG + semantic search',
    callNumber: 'PRJ-01',
    pages: 'Python · LangChain · OpenAI GPT-3.5 · LanceDB',
    description:
      'An LLM-powered property recommendation system that turns a plain-language brief into a ranked shortlist. Semantic search and vector embeddings match homes to intent, while a retrieval-augmented chatbot writes personalized property descriptions grounded in the retrieved listings.',
    excerpt:
      'A search box understands the brief. A RAG layer explains why each home belongs in the shortlist.',
    tags: ['LLM application', 'Vector embeddings', 'RAG', 'Real estate'],
  },
  {
    id: 'article-recommender',
    title: 'Article Recommendation System',
    author: 'IBM Watson Platform',
    year: 'Recommendation Systems',
    sectionId: 'cartography',
    level: 0,
    angle: 65,
    color: '#67e8f9',
    constellation: 'Hybrid recommender',
    callNumber: 'PRJ-02',
    pages: 'Python · Scikit-learn · TF-IDF · SVD',
    description:
      'A recommendation engine built on IBM Watson that combines ranking, collaborative filtering and content-based filtering. TF-IDF and SVD surface similar articles while matrix factorization captures latent reading patterns for personalized suggestions.',
    excerpt:
      'Good recommendations connect what a reader has read with what they have not yet discovered.',
    tags: ['Collaborative filtering', 'Content-based filtering', 'SVD', 'Ranking'],
  },
  {
    id: 'recommendation-engine',
    title: 'Ranking & Matrix Factorization',
    author: 'Core method',
    year: 'Machine Learning',
    sectionId: 'archives',
    level: 0,
    angle: 110,
    color: '#a78bfa',
    constellation: 'Recommender systems',
    callNumber: 'ML-01',
    pages: 'Python · Scikit-learn · NumPy · SciPy',
    description:
      'The recommendation methods behind the article engine: candidate ranking, collaborative filtering, content similarity, and matrix factorization with SVD. The approach blends behavioral signals with item content to keep recommendations relevant when interaction data is sparse.',
    excerpt:
      'Matrix factorization compresses a large, sparse taste graph into the few latent dimensions that matter.',
    tags: ['Matrix factorization', 'Similarity', 'Ranking', 'Personalization'],
  },
  {
    id: 'model-evaluation',
    title: 'Model Evaluation & Selection',
    author: 'Core method',
    year: 'Machine Learning',
    sectionId: 'archives',
    level: 0,
    angle: 155,
    color: '#c4b5fd',
    constellation: 'Benchmarking',
    callNumber: 'ML-02',
    pages: 'Python · Scikit-learn · Matplotlib',
    description:
      'A practical evaluation workflow for choosing between candidate models. Accuracy, runtime and generalization are compared side by side so the selected architecture earns its place in production rather than winning on a single headline metric.',
    excerpt:
      'Benchmarks are useful only when they measure the trade-off you are actually willing to ship.',
    tags: ['Accuracy', 'Runtime', 'Benchmarking', 'Model selection'],
  },
  {
    id: 'rag-vector-search',
    title: 'RAG & Vector Search',
    author: 'Core method',
    year: 'Generative AI',
    sectionId: 'lunar',
    level: 0,
    angle: 200,
    color: '#93c5fd',
    constellation: 'Retrieval-augmented generation',
    callNumber: 'GEN-01',
    pages: 'LangChain · LanceDB · OpenAI API',
    description:
      'A retrieval-augmented generation pipeline that embeds documents, stores them in a vector database, retrieves the closest matches, and supplies that context to an LLM. LanceDB handles similarity search; LangChain orchestrates retrieval and response generation.',
    excerpt:
      'Retrieval keeps the language model honest: the answer starts with the right document, not a guess.',
    tags: ['RAG', 'Vector database', 'Semantic search', 'LanceDB'],
  },
  {
    id: 'conversational-ai',
    title: 'Conversational Property Search',
    author: 'HomeMatch feature',
    year: 'Generative AI',
    sectionId: 'lunar',
    level: 0,
    angle: 245,
    color: '#60a5fa',
    constellation: 'LLM interfaces',
    callNumber: 'GEN-02',
    pages: 'OpenAI GPT-3.5 · LangChain',
    description:
      'The conversational layer of HomeMatch: a RAG-based chatbot that interprets buyer preferences, retrieves relevant listings, and produces personalized property descriptions. The experience keeps the dialogue grounded in the available inventory instead of inventing details.',
    excerpt:
      'The best assistant does not just answer the question; it retrieves the evidence first.',
    tags: ['Chatbot', 'Personalization', 'Prompting', 'Grounded generation'],
  },
  {
    id: 'dog-breed-classifier',
    title: 'Dog Breed Image Classification',
    author: 'Personal project',
    year: 'Computer Vision',
    sectionId: 'chronicles',
    level: 0,
    angle: 290,
    color: '#f0abfc',
    constellation: 'CNN classification',
    callNumber: 'CV-01',
    pages: 'Python · CNN · AlexNet · VGG · ResNet',
    description:
      'A computer-vision study that classifies dog versus non-dog images and identifies breeds using pretrained CNN architectures. AlexNet, VGG and ResNet were trained and evaluated on ImageNet-derived data, then compared on accuracy and runtime.',
    excerpt:
      'The strongest classifier is the one that balances precision with the cost of every inference.',
    tags: ['CNN', 'Transfer learning', 'ImageNet', 'Classification'],
  },
  {
    id: 'cnn-transfer-learning',
    title: 'CNN Transfer Learning',
    author: 'Core method',
    year: 'Computer Vision',
    sectionId: 'chronicles',
    level: 0,
    angle: 335,
    color: '#f5d0fe',
    constellation: 'Deep learning',
    callNumber: 'CV-02',
    pages: 'PyTorch · Keras · ResNet · VGG',
    description:
      'A comparison of pretrained convolutional backbones for image classification. The work covers transfer learning, feature extraction, fine-tuning and the architectural trade-offs between AlexNet, VGG and ResNet when adapting ImageNet models to a new label space.',
    excerpt:
      'Pretrained features are a head start, not a finish line; the last layers decide the task.',
    tags: ['Transfer learning', 'Fine-tuning', 'ResNet', 'VGG'],
  },
  {
    id: 'accenture-role',
    title: 'Packaged Application Development Associate',
    author: 'Accenture',
    year: 'Professional role',
    sectionId: 'mezzanine',
    level: 1,
    angle: 20,
    color: '#fbbf24',
    constellation: 'AI/ML practitioner',
    callNumber: 'EXP-01',
    pages: 'Applied AI · Software delivery',
    description:
      'Arshia’s professional role at Accenture sits alongside a hands-on AI/ML portfolio spanning LLM applications, recommendation systems, computer vision, and generative AI solution design.',
    excerpt:
      'A recent graduate building intelligent systems for real-world applications.',
    tags: ['Accenture', 'Application development', 'AI/ML', 'Professional experience'],
  },
  {
    id: 'udacity-nanodegree',
    title: 'AI/ML for ATCI Nanodegree',
    author: 'Udacity',
    year: 'Certification',
    sectionId: 'mezzanine',
    level: 1,
    angle: 110,
    color: '#fcd34d',
    constellation: 'Applied AI',
    callNumber: 'EXP-02',
    pages: 'AI · Machine Learning',
    description:
      'A Udacity nanodegree covering applied artificial intelligence and machine learning. The credential complements the project work in model evaluation, recommendation systems, deep learning and generative AI.',
    excerpt:
      'Structured study, applied through projects rather than left as theory.',
    tags: ['Udacity', 'Certification', 'AI/ML', 'Continued learning'],
  },
  {
    id: 'ai-ml-foundations',
    title: 'AI & ML Foundations',
    author: 'Hands-on training',
    year: 'Domain experience',
    sectionId: 'mezzanine',
    level: 1,
    angle: 200,
    color: '#fde68a',
    constellation: 'Deep learning',
    callNumber: 'EXP-03',
    pages: 'Machine Learning (P3-Advance) · Deep Learning · Python',
    description:
      'Formal training across the AI/ML stack: machine learning at P3-Advance level, deep learning, generative AI applications, recommendation systems and Python programming. The foundation is reinforced by project work in computer vision and LLM-based applications.',
    excerpt:
      'Machine learning is the foundation; deep learning and generative AI are the extensions.',
    tags: ['Machine Learning', 'Deep Learning', 'Generative AI', 'Python'],
  },
  {
    id: 'portfolio-focus',
    title: 'Focus: Intelligent AI Systems',
    author: 'Career objective',
    year: 'Generative AI',
    sectionId: 'mezzanine',
    level: 1,
    angle: 290,
    color: '#fbbf24',
    constellation: 'AI for real-world use',
    callNumber: 'EXP-04',
    pages: 'LLMs · Recommenders · Vision',
    description:
      'Arshia is interested in developing intelligent AI systems and generative AI solutions for real-world applications. This portfolio brings the threads together: retrieval-augmented assistants, recommendations that respect user intent, and vision models that have been benchmarked rather than assumed.',
    excerpt:
      'Build systems that are useful first, impressive second — and measurable either way.',
    tags: ['Career focus', 'Generative AI', 'Applied ML', 'Real-world applications'],
  },
];

export const booksById = Object.fromEntries(books.map((book) => [book.id, book]));

export const librarySections = [
  {
    id: 'cartography',
    name: 'Applied AI Projects',
    shortName: 'Projects',
    level: 0,
    angle: 45,
    color: '#67e8f9',
    tagline: 'LLM search, recommenders, and vision',
    description:
      'The first gallery collects three applied AI builds from Arshia’s portfolio: HomeMatch, an IBM Watson article recommender, and a CNN dog-breed classifier. Each entry links to the methods and tools behind the result.',
    highlights: [
      'HomeMatch — RAG real-estate assistant',
      'Article recommendations with SVD',
      'Dog-breed classification with CNNs',
    ],
  },
  {
    id: 'archives',
    name: 'Machine Learning Lab',
    shortName: 'ML Lab',
    level: 0,
    angle: 135,
    color: '#a78bfa',
    tagline: 'Ranking, evaluation, and the data stack',
    description:
      'A working track for the methods beneath the projects: ranking and collaborative filtering, matrix factorization, model evaluation, and the Python data stack. The focus is on choosing a model by evidence rather than by default.',
    highlights: [
      'SVD and similarity techniques',
      'Accuracy and runtime benchmarking',
      'Scikit-learn, NumPy, SciPy',
    ],
  },
  {
    id: 'lunar',
    name: 'Generative AI Studio',
    shortName: 'GenAI',
    level: 0,
    angle: 225,
    color: '#93c5fd',
    tagline: 'RAG, vectors, and grounded chat',
    description:
      'The generative AI track follows a document from embedding to answer: vector storage in LanceDB, retrieval orchestration with LangChain, and a GPT-3.5 chatbot grounded in retrieved context. HomeMatch is the reference build.',
    highlights: [
      'RAG pipeline design',
      'Vector search with LanceDB',
      'Conversational property search',
    ],
  },
  {
    id: 'chronicles',
    name: 'Computer Vision',
    shortName: 'Vision',
    level: 0,
    angle: 315,
    color: '#f0abfc',
    tagline: 'CNNs, transfer learning, benchmarks',
    description:
      'The image-classification track compares pretrained CNN architectures on a dog-breed identification task. AlexNet, VGG and ResNet are evaluated on accuracy and runtime to expose the trade-offs behind model selection.',
    highlights: [
      'AlexNet · VGG · ResNet',
      'ImageNet pretrained models',
      'Accuracy vs. runtime comparison',
    ],
  },
  {
    id: 'mezzanine',
    name: 'Experience & Credentials',
    shortName: 'Experience',
    level: 1,
    angle: 90,
    color: '#fbbf24',
    tagline: 'Role, certification, and focus',
    description:
      'The upper gallery holds the professional record: Arshia’s role at Accenture, the Udacity AI/ML nanodegree, hands-on training across the AI stack, and the focus that ties the portfolio together.',
    highlights: [
      'Accenture · Packaged Application Development Associate',
      'Udacity AI/ML for ATCI Nanodegree',
      'Machine Learning P3-Advance training',
    ],
  },
  {
    id: 'orrery',
    name: 'Technical Toolkit',
    shortName: 'Toolkit',
    level: 0,
    angle: null,
    color: '#22d3ee',
    tagline: 'The stack behind the work',
    description:
      'The central index renders the toolkit as a single system: Python and the scientific stack, ML and deep-learning frameworks, LLM tooling, vector search, and version control.',
    highlights: [
      'Python · Pandas · NumPy · SciPy',
      'Scikit-learn · PyTorch · Keras',
      'LangChain · LanceDB · OpenAI API · Git',
    ],
  },
  {
    id: 'entrance',
    name: 'Contact & Resume',
    shortName: 'Contact',
    level: 0,
    angle: 0,
    color: '#f59e0b',
    tagline: 'Email, phone, and one-page CV',
    description:
      'The entrance is the contact point. Reach Arshia by email or phone, or open the one-page resume PDF for a concise overview of the projects, skills and certification.',
    highlights: ['arshia.swain@accenture.com', '+91 7653094680', 'One-page resume PDF'],
    links: CONTACT_LINKS,
  },
];

export const sectionsById = Object.fromEntries(
  librarySections.map((section) => [section.id, section])
);

export const readingAreas = [
  {
    id: 'experience-desk',
    name: 'Experience & Credentials',
    sectionId: 'mezzanine',
    angle: -38,
    radius: 5.85,
    color: '#fbbf24',
    eyebrow: 'EXPERIENCE · CREDENTIALS',
    subtitle: 'Accenture · Udacity · AI/ML training',
    sublabel: 'Company · role · credentials',
    description:
      'The professional record in one place: Arshia’s role as a Packaged Application Development Associate at Accenture, the Udacity AI/ML for ATCI Nanodegree, and hands-on training across machine learning, deep learning, generative AI, recommendation systems and Python. The upper gallery holds the full experience entries.',
    highlights: [
      'Accenture · Packaged Application Development Associate',
      'Udacity AI/ML for ATCI Nanodegree',
      'Machine Learning P3-Advance · Deep Learning · Python',
      'Career focus: intelligent AI systems and generative AI',
    ],
    meta: [
      { label: 'Company', value: 'Accenture' },
      { label: 'Role', value: 'Packaged Application Development Associate' },
      { label: 'Gallery', value: 'Level 02 · Experience Gallery' },
      { label: 'Access', value: 'Climb the spiral stair' },
    ],
    recommendedBookIds: [
      'accenture-role',
      'udacity-nanodegree',
      'ai-ml-foundations',
      'portfolio-focus',
    ],
    booksLabel: 'Experience entries',
  },
  {
    id: 'profile-desk',
    name: 'About & Contact',
    sectionId: 'entrance',
    angle: 0,
    radius: 5.85,
    color: '#67e8f9',
    eyebrow: 'ABOUT ME · CONTACT',
    subtitle: 'Arshia Swain · Applied AI & Machine Learning',
    sublabel: 'About · role · contact',
    description:
      'I am a recent graduate and Packaged Application Development Associate at Accenture, with hands-on AI/ML training across machine learning, deep learning, generative AI, recommendation systems and computer vision. I build intelligent systems that are grounded in real data, useful in practice, and measurable by design.',
    highlights: [
      'Recent graduate · hands-on AI/ML training',
      'Accenture · Packaged Application Development Associate',
      'Focus: intelligent AI systems and generative AI',
    ],
    meta: [
      { label: 'Name', value: 'Arshia Swain' },
      { label: 'Company', value: 'Accenture' },
      { label: 'Role', value: 'Packaged Application Development Associate' },
      { label: 'Focus', value: 'Applied AI · Generative AI' },
    ],
    links: CONTACT_LINKS,
    recommendedBookIds: ['accenture-role', 'portfolio-focus'],
    booksLabel: 'Related profile entries',
  },
  {
    id: 'projects-desk',
    name: 'Projects & Toolkit',
    sectionId: 'cartography',
    angle: 38,
    radius: 5.85,
    color: '#a78bfa',
    eyebrow: 'PROJECTS · TOOLKIT',
    subtitle: 'HomeMatch · recommenders · computer vision',
    sublabel: 'Projects · methods · toolkit',
    description:
      'An index to the applied work: HomeMatch, a RAG-powered real-estate assistant; an IBM Watson article recommender built with TF-IDF and SVD; and a CNN dog-breed classifier comparing AlexNet, VGG and ResNet. The lower gallery tracks hold the methods, while the central Toolkit marker expands the stack behind them.',
    highlights: [
      'HomeMatch · RAG + vector search',
      'Article recommender · TF-IDF + SVD',
      'Dog-breed classifier · CNN transfer learning',
      'Python · Scikit-learn · PyTorch · LangChain',
    ],
    meta: [
      { label: 'Projects', value: '3 applied AI builds' },
      { label: 'Tracks', value: 'ML · GenAI · Vision' },
      { label: 'Toolkit', value: 'Python · Scikit-learn · PyTorch · LangChain' },
      { label: 'Location', value: 'Lower gallery · Level 01' },
    ],
    recommendedBookIds: [
      'homematcher',
      'article-recommender',
      'rag-vector-search',
      'dog-breed-classifier',
    ],
    booksLabel: 'Project entries',
  },
];

export const readingAreasById = Object.fromEntries(readingAreas.map((area) => [area.id, area]));
