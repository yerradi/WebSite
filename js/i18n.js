/* ===================================================
   i18n Engine — vanilla, framework-free
   Works under BOTH file:// (no server) AND http(s)://
   - 3 languages (en / fr / ar) with RTL for Arabic
   - Auto-detects browser language on first visit
   - Persists choice in localStorage
   - Fires a 'languagechange' CustomEvent
   - Locale dictionaries are EMBEDDED below so the page
     functions when opened directly from disk; under http
     the engine still tries fetch() first for editability
     and falls back to the embedded copy on failure.

   Set window.I18N_DEBUG = true to enable verbose [i18n] tracing.
   =================================================== */

(() => {
  'use strict';

  // =====================================================================
  // 0. EMBEDDED LOCALE DICTIONARIES
  //    Mirrors locales/*.json exactly. Edit BOTH if you change strings,
  //    or — in production — use a build step to inline them automatically.
  // =====================================================================

  const EMBEDDED_LOCALES = {
      "en": {
          "meta": {
              "lang_name": "English",
              "lang_short": "EN",
              "title": "Youssef Erradi | Systems That Bring You Clients. Automatically.",
              "description": "I build complete business systems — high-converting websites, lead automation, and custom dashboards — that generate revenue and streamline operations for growing companies."
          },
          "a11y": {
              "ye_logo": "YE Logo",
              "toggle_menu": "Toggle menu",
              "back_to_top": "Back to top",
              "language_selector": "Select language",
              "open_language_menu": "Open language menu"
          },
          "logo": {
              "name": "Youssef Erradi Labs",
              "sub": "Systems • Automation • Growth"
          },
          "nav": {
              "services": "Services",
              "pricing": "Pricing",
              "work": "Work",
              "process": "Process",
              "about": "About",
              "cta": "Start Your Project"
          },
          "hero": {
              "badge": "Limited Availability — 2 Spots Left This Month",
              "title_line1": "Systems That Bring",
              "title_line2": "You Clients.",
              "title_em": "Automatically.",
              "desc_html": "Not just websites — <strong>complete business systems</strong> that attract clients, capture leads on autopilot, and give you real-time visibility into your operations through custom dashboards and tools.",
              "supporting": "Built for businesses that want predictable growth and automated operations.",
              "cta_primary": "Book a Free Strategy Call",
              "cta_secondary": "View My Work",
              "trust": "Built real-world systems used by businesses to manage operations and workflows",
              "stat_projects_label": "Projects",
              "stat_satisfaction_label": "Satisfaction",
              "stat_response_label": "Response",
              "card_conversion_label": "Conversion Rate",
              "card_revenue_label": "Revenue Growth",
              "card_leads_label": "New Leads/Month",
              "image_alt": "Youssef Erradi — Web Developer & Consultant"
          },
          "problem": {
              "badge": "The Hard Truth",
              "title_line1": "Every day, your website is",
              "title_em": "losing you money.",
              "subtitle": "You're investing in ads, creating content, driving traffic — but none of it matters if your website can't convert. Most don't.",
              "story_label": "This is happening right now",
              "story_steps": [
                  "A potential client searches for exactly what you offer.",
                  "They click. Your website takes too long to load.",
                  "They can't understand what you do within 3 seconds.",
                  "There's no clear next step. No CTA. No direction.",
                  "They close the tab. Gone forever.",
                  "Your competitor gets the deal."
              ],
              "cards": [
                  {
                      "title": "Visitors Don't Understand What You Do",
                      "desc": "Unclear headline, no value proposition, cluttered layout. They leave in under 5 seconds without reading a single word.",
                      "stat_num": "88%",
                      "stat_text": "of visitors never come back after a bad first impression"
                  },
                  {
                      "title": "No Clear Path to Contact You",
                      "desc": "No strategic CTAs, no funnel, no urgency. Users scroll your entire page and leave without knowing what to do next.",
                      "stat_num": "70%",
                      "stat_text": "of small business websites have zero conversion strategy"
                  },
                  {
                      "title": "You're Not Capturing Any Leads",
                      "desc": "No forms, no automation, no follow-up system. Every visitor who doesn't convert on the spot is lost permanently.",
                      "stat_num": "96%",
                      "stat_text": "of visitors aren't ready to buy on their first visit"
                  }
              ],
              "contrast_bad_title": "Typical Website",
              "contrast_bad": [
                  "Looks good but doesn't convert",
                  "No clear CTA or user flow",
                  "No lead capture system",
                  "\"Contact us\" buried in the footer",
                  "Passive — waits and hopes for results"
              ],
              "contrast_vs": "vs",
              "contrast_good_title": "High-Converting System",
              "contrast_good": [
                  "Clear messaging that hooks in 3 seconds",
                  "Every page optimized for conversion",
                  "Automated lead capture + follow-up",
                  "Strategic CTAs that drive action",
                  "Built to generate revenue on autopilot"
              ],
              "transition": "It doesn't have to be this way.",
              "solution_badge": "The Solution",
              "solution_title_line1": "I turn your website into a",
              "solution_title_em": "client acquisition machine.",
              "solution_desc_html": "Every project I build follows one framework: <strong>Capture attention</strong>, <strong>build instant trust</strong>, and <strong>drive visitors to take action</strong>. No guesswork. Just proven structure that converts.",
              "flow_visit": "Visit",
              "flow_trust": "Trust",
              "flow_convert": "Convert"
          },
          "services": {
              "badge": "Services",
              "title_line1": "Three pillars of",
              "title_em": "digital growth.",
              "subtitle": "Attract clients with high-converting websites. Convert leads with automation. Scale operations with custom systems.",
              "cards": [
                  {
                      "tag": "Recommended",
                      "role": "Attract clients",
                      "result": "Get more clients",
                      "tm": "Client Acquisition System™",
                      "desc": "A website engineered to turn every visitor into a lead — built around strategy, not just design.",
                      "features": [
                          "Messaging that hooks visitors in under 3 seconds",
                          "A clear path from landing to contacting you",
                          "Pages that load fast and rank on Google",
                          "Mobile experience that matches how people browse"
                      ],
                      "outcome": "Your website becomes a 24/7 client-generating machine.",
                      "cta": "Get More Clients"
                  },
                  {
                      "role": "Convert & follow up",
                      "result": "Automate your leads",
                      "tm": "Lead Automation Engine™",
                      "desc": "Capture every lead, respond instantly, and follow up automatically — without lifting a finger.",
                      "features": [
                          "Never lose a lead to slow response time again",
                          "Instant WhatsApp & email follow-ups on autopilot",
                          "Leads routed directly into your CRM",
                          "Save 10+ hours per week on manual tasks"
                      ],
                      "outcome": "Close more deals with zero manual work.",
                      "cta": "Automate My Leads"
                  },
                  {
                      "tag": "For Companies & Operations",
                      "role": "Scale operations",
                      "result": "Run your business on real software",
                      "tm": "Business Systems & Dashboards™",
                      "desc": "Custom-built internal systems for companies to manage data, operations, and workflows — replacing spreadsheets with enterprise-grade tools.",
                      "features": [
                          "SQL dashboards & real-time reporting",
                          "Production tracking & operations systems",
                          "Internal business applications",
                          "Custom integrations across your entire stack"
                      ],
                      "outcome": "Your operations run on custom software — not spreadsheets.",
                      "cta": "Build My System"
                  }
              ],
              "micro_cta": "Want me to review your current system?"
          },
          "value": {
              "badge": "Why Me",
              "title_line1": "I don't build websites. I build",
              "title_em": "business infrastructure.",
              "subtitle": "Most developers give you a design. I give you a system engineered to generate revenue and streamline operations.",
              "positioning": "Built for companies, not just websites.",
              "items": [
                  {
                      "title": "I Think Like a Business Owner",
                      "desc": "I don't just code — I understand your revenue model and build around it"
                  },
                  {
                      "title": "Every Pixel Has a Job",
                      "desc": "Nothing decorative. Every element exists to move visitors closer to becoming clients"
                  },
                  {
                      "title": "Clarity Over Complexity",
                      "desc": "Clean structure, fast performance, zero confusion — visitors know exactly what to do"
                  },
                  {
                      "title": "Built to Scale With You",
                      "desc": "Your website today handles 10 clients. I build it to handle 1,000 without breaking"
                  }
              ]
          },
          "process": {
              "badge": "Process",
              "title_line1": "From first call to live in",
              "title_em": "under 3 weeks.",
              "subtitle": "A proven 4-step process. No bloat. No delays. Just focused execution.",
              "deliverable_label": "Deliverable:",
              "steps": [
                  {
                      "title": "Deep Dive",
                      "desc": "I learn your business, your clients, and what makes them buy",
                      "deliverable": "Clear action plan"
                  },
                  {
                      "title": "Strategy & Structure",
                      "desc": "I map the conversion flow, messaging, and page architecture",
                      "deliverable": "System blueprint"
                  },
                  {
                      "title": "Build & Refine",
                      "desc": "I design, develop, and optimize until every element converts",
                      "deliverable": "Complete system"
                  },
                  {
                      "title": "Launch & Support",
                      "desc": "Go live with confidence — I monitor, tweak, and support post-launch",
                      "deliverable": "Live & optimized"
                  }
              ]
          },
          "pricing": {
              "badge": "Pricing & Plans",
              "title_line1": "Choose the plan that fits your",
              "title_em": "ambition.",
              "subtitle": "No hidden fees. No surprises. Pick a plan, and let's start building your growth engine.",
              "plans": [
                  {
                      "tier": "Starter",
                      "result": "Launch a professional website that builds trust and credibility.",
                      "currency": "$",
                      "price": "1,500",
                      "plus": "",
                      "who": "Best for small businesses launching their first professional web presence.",
                      "features": [
                          "Conversion-focused design",
                          "Mobile optimization",
                          "Fast performance (under 2s load)",
                          "Clear messaging & CTA placement"
                      ],
                      "roi": "One new client covers the entire investment.",
                      "cta": "Get Started"
                  },
                  {
                      "tier": "Growth",
                      "badge": "Most Clients Start Here",
                      "result": "Generate consistent leads and convert visitors into clients.",
                      "currency": "$",
                      "price": "3,000",
                      "plus": "",
                      "who": "Best for businesses that want to generate consistent leads from their website.",
                      "features": [
                          "Everything in Starter",
                          "Lead capture system & CTA funnel",
                          "Conversion optimization",
                          "Basic automation & follow-up",
                          "Strategy session included"
                      ],
                      "roi": "One client can pay for this entire system.",
                      "cta": "Get More Clients"
                  },
                  {
                      "tier": "Scale",
                      "badge": "For Companies",
                      "result": "Build a complete digital system that grows your business automatically.",
                      "currency": "$",
                      "price": "6,000",
                      "plus": "+",
                      "who": "Best for companies that need a full system — website, automation, and custom tools.",
                      "features": [
                          "Full system (website + automation)",
                          "Advanced workflows & sequences",
                          "Custom integrations (CRM, APIs)",
                          "Performance optimization & analytics",
                          "Priority support & ongoing optimization"
                      ],
                      "roi": "Built for real business results — systems that pay for themselves.",
                      "cta": "Build My System"
                  }
              ],
              "consulting": {
                  "badge": "Expert Guidance",
                  "title": "Consulting & Technical Advisory",
                  "audience": "For developers & companies",
                  "desc": "Solve real production problems, improve system performance, and build scalable architecture with expert guidance.",
                  "list": [
                      "Production debugging & troubleshooting",
                      "Performance optimization & load testing",
                      "Scalable architecture design",
                      "Code review & system audits"
                  ],
                  "hourly_title": "Hourly Session",
                  "hourly_price": "$75",
                  "hourly_suffix": "/hr",
                  "hourly_desc": "Targeted deep dive into a specific production problem.",
                  "package_title": "4-Session Package",
                  "package_price": "$250",
                  "package_save": "Save 17%",
                  "package_desc": "Structured advisory across multiple sessions for complex systems.",
                  "cta": "Book a Session"
              },
              "maintenance": {
                  "title": "Maintenance & Support",
                  "desc": "Keep your website running smoothly, secure, and continuously improving.",
                  "basic_title": "Basic",
                  "basic_price": "$50",
                  "basic_suffix": "/mo",
                  "basic_items": [
                      "Bug fixes",
                      "Small updates"
                  ],
                  "pro_title": "Pro",
                  "pro_price": "$150",
                  "pro_suffix": "/mo",
                  "pro_items": [
                      "Priority support",
                      "Monthly improvements",
                      "Performance monitoring"
                  ],
                  "cta": "Keep My Website Running"
              },
              "addons": {
                  "title": "Power Add-ons",
                  "items": [
                      {
                          "name": "SEO Optimization",
                          "desc": "Rank higher, get free traffic",
                          "price": "$500"
                      },
                      {
                          "name": "Speed Optimization",
                          "desc": "Sub-2s load times guaranteed",
                          "price": "$300"
                      },
                      {
                          "name": "API Integration",
                          "desc": "Connect any tool or service",
                          "price": "$800"
                      },
                      {
                          "name": "AI-Powered Features",
                          "desc": "Chatbots, generators, smart tools",
                          "price": "$1,000+"
                      },
                      {
                          "name": "Multi-language",
                          "desc": "Expand your audience reach",
                          "price": "$400"
                      }
                  ]
              }
          },
          "apps": {
              "badge": "Mobile Apps Studio",
              "title_line1": "Websites, automation, and",
              "title_em": "mobile apps on Google Play.",
              "subtitle": "Youssef Erradi Labs builds polished Android experiences that extend your business beyond the browser — fast, branded, and ready for real users.",
              "play_aria": "View Youssef Erradi Labs on Google Play",
              "play_overline": "Available on",
              "play_label": "Google Play",
              "cta_primary": "Build My App",
              "trust": [
                  "Android-ready delivery",
                  "Brand-consistent UX",
                  "Store presence support"
              ],
              "stats": [
                  {
                      "number": "3+",
                      "label": "App categories"
                  },
                  {
                      "number": "24/7",
                      "label": "Mobile visibility"
                  },
                  {
                      "number": "Play",
                      "label": "Distribution channel"
                  }
              ],
              "mockup": {
                  "main_label": "Launch Suite",
                  "main_title": "Mobile product system",
                  "secondary_label": "Google Play",
                  "secondary_title": "Trusted app presence"
              },
              "cards": [
                  {
                      "kicker": "Client apps",
                      "title": "Service booking & lead capture",
                      "desc": "Mobile funnels that help clients request quotes, book calls, and stay connected from their phone."
                  },
                  {
                      "kicker": "Business tools",
                      "title": "Dashboards in your pocket",
                      "desc": "Operational views, reports, and internal workflows designed for teams that move fast."
                  },
                  {
                      "kicker": "Store-ready",
                      "title": "Launch polish for Google Play",
                      "desc": "Clean branding, responsive interfaces, and store-facing assets aligned with your company identity."
                  }
              ]
          },
          "work": {
              "badge": "Results",
              "title_line1": "Selected",
              "title_em": "Work.",
              "subtitle": "Real projects. Real results. Here's what I've built for businesses like yours.",
              "cases": [
                  {
                      "industry": "Food Industry",
                      "title": "Cuisine Solution System",
                      "type": "Internal Production Systems & Dashboards",
                      "desc": "Built custom production tracking systems and SQL dashboards to manage daily operations — replacing spreadsheets with real-time visibility across the production floor.",
                      "result": "Reduced manual reporting by 80% · Real-time production visibility",
                      "tags": [
                          "SQL Dashboard",
                          "Production Tracking",
                          "Internal Tools"
                      ]
                  },
                  {
                      "industry": "Tech / IT Services",
                      "title": "EGTV Informatique",
                      "type": "Scalable Applications & Reporting Tools",
                      "desc": "Developed scalable web applications and reporting tools — enabling the company to track performance, manage clients, and automate internal workflows.",
                      "result": "Automated client management · 3x faster reporting",
                      "tags": [
                          "Full-Stack App",
                          "Reporting",
                          "Automation"
                      ]
                  },
                  {
                      "industry": "SaaS / Digital Tools",
                      "title": "SmartlyTools",
                      "type": "Online Tools Platform",
                      "desc": "Built a full SaaS-style tools platform from scratch — fast, scalable, and designed for high-volume usage with a clean user experience.",
                      "result": "Scalable architecture · Handles high-volume traffic",
                      "tags": [
                          "Platform",
                          "SaaS",
                          "Full-Stack"
                      ]
                  }
              ],
              "trust_line": "Used by businesses to improve operations and scale efficiently."
          },
          "about": {
              "badge": "About Me",
              "title": "Hi, I'm Youssef.",
              "lead": "I'm not a designer who codes. I'm a full-stack developer who builds systems that drive business outcomes.",
              "p1_html": "After building 50+ projects across food production, IT services, SaaS, and professional services, I've learned one thing: <strong>a great-looking website means nothing if it doesn't generate revenue or solve a real operational problem.</strong>",
              "p2": "That's why every project starts with your business goals — not a color palette. I build digital infrastructure that attracts clients, automates workflows, and scales with you.",
              "industries_label": "Industries served:",
              "industries_tags": [
                  "Food & Production",
                  "IT & Tech",
                  "Professional Services",
                  "SaaS"
              ],
              "stats": [
                  {
                      "number": "50+",
                      "label": "Projects"
                  },
                  {
                      "number": "3+",
                      "label": "Years"
                  },
                  {
                      "number": "100%",
                      "label": "Dedication"
                  }
              ],
              "trust_title": "Why clients keep coming back",
              "trust_desc": "I work with serious business owners who want results — not just deliverables.",
              "trust_items": [
                  {
                      "title": "Senior-level execution",
                      "desc": "Clean code, modern stack, built to last"
                  },
                  {
                      "title": "Revenue-first mindset",
                      "desc": "Every decision tied to your bottom line"
                  },
                  {
                      "title": "No BS communication",
                      "desc": "Fast responses, honest timelines, zero fluff"
                  },
                  {
                      "title": "Long-term partnership",
                      "desc": "I don't disappear after launch — I help you grow"
                  }
              ]
          },
          "cta": {
              "badge": "Limited Availability",
              "title_line1": "Stop losing clients to a",
              "title_line2": "website that doesn't",
              "title_em": "convert.",
              "urgency": "Every day you wait, you lose potential clients to competitors with better systems.",
              "value": "I'll review your current website, identify what's costing you clients, and give you a clear action plan.",
              "pills": [
                  "No pressure",
                  "No commitment",
                  "Just clarity"
              ],
              "main_button": "Book a Free Strategy Call",
              "main_value": "Get a clear plan for your business — no commitment required",
              "channels_label": "Prefer messaging? Reach out the way that works best for you.",
              "channels": {
                  "whatsapp": "WhatsApp",
                  "linkedin": "LinkedIn",
                  "email": "Email",
                  "instagram": "Instagram"
              },
              "note": "I respond within 24 hours · Limited availability · Only a few spots each month"
          },
          "footer": {
              "tagline": "Systems that generate clients automatically.",
              "nav_title": "Navigation",
              "links": {
                  "home": "Home",
                  "services": "Services",
                  "work": "Work",
                  "pricing": "Pricing",
                  "contact": "Contact"
              },
              "connect_title": "Connect",
              "connect": {
                  "linkedin": "LinkedIn",
                  "email": "Email",
                  "whatsapp": "WhatsApp"
              },
              "copyright": "© 2026 Youssef Erradi Labs. All rights reserved."
          },
          "lang_switcher": {
              "label": "Language",
              "en": "English",
              "fr": "Français",
              "ar": "العربية"
          }
      },
      "fr": {
          "meta": {
              "lang_name": "Français",
              "lang_short": "FR",
              "title": "Youssef Erradi | Des systèmes qui vous amènent des clients. Automatiquement.",
              "description": "Je construis des systèmes d'entreprise complets — sites web à fort taux de conversion, automatisation des leads et tableaux de bord sur mesure — qui génèrent du chiffre d'affaires et optimisent les opérations des entreprises en croissance."
          },
          "a11y": {
              "ye_logo": "Logo YE",
              "toggle_menu": "Ouvrir le menu",
              "back_to_top": "Retour en haut",
              "language_selector": "Choisir la langue",
              "open_language_menu": "Ouvrir le menu des langues"
          },
          "logo": {
              "name": "Youssef Erradi Labs",
              "sub": "Systèmes • Automatisation • Croissance"
          },
          "nav": {
              "services": "Services",
              "pricing": "Tarifs",
              "work": "Réalisations",
              "process": "Processus",
              "about": "À propos",
              "cta": "Démarrer votre projet"
          },
          "hero": {
              "badge": "Disponibilité limitée — 2 places restantes ce mois-ci",
              "title_line1": "Des systèmes qui vous",
              "title_line2": "amènent des clients.",
              "title_em": "Automatiquement.",
              "desc_html": "Pas seulement des sites web — <strong>des systèmes d'entreprise complets</strong> qui attirent les clients, capturent les leads en pilote automatique et vous donnent une visibilité en temps réel sur vos opérations grâce à des tableaux de bord et outils personnalisés.",
              "supporting": "Conçu pour les entreprises qui veulent une croissance prévisible et des opérations automatisées.",
              "cta_primary": "Réserver un appel stratégique gratuit",
              "cta_secondary": "Voir mes réalisations",
              "trust": "Systèmes réels utilisés par des entreprises pour gérer leurs opérations et flux de travail",
              "stat_projects_label": "Projets",
              "stat_satisfaction_label": "Satisfaction",
              "stat_response_label": "Réponse",
              "card_conversion_label": "Taux de conversion",
              "card_revenue_label": "Croissance du CA",
              "card_leads_label": "Nouveaux leads/mois",
              "image_alt": "Youssef Erradi — Développeur web et consultant"
          },
          "problem": {
              "badge": "La dure vérité",
              "title_line1": "Chaque jour, votre site web vous",
              "title_em": "fait perdre de l'argent.",
              "subtitle": "Vous investissez dans la publicité, créez du contenu, générez du trafic — mais rien de tout cela n'a d'importance si votre site ne convertit pas. La plupart n'y arrivent pas.",
              "story_label": "Cela se passe en ce moment même",
              "story_steps": [
                  "Un client potentiel cherche exactement ce que vous proposez.",
                  "Il clique. Votre site met trop de temps à charger.",
                  "Il ne comprend pas ce que vous faites en moins de 3 secondes.",
                  "Aucune étape suivante claire. Aucun CTA. Aucune direction.",
                  "Il ferme l'onglet. Disparu pour toujours.",
                  "Votre concurrent décroche le contrat."
              ],
              "cards": [
                  {
                      "title": "Les visiteurs ne comprennent pas votre offre",
                      "desc": "Titre flou, aucune proposition de valeur, mise en page surchargée. Ils partent en moins de 5 secondes sans lire un seul mot.",
                      "stat_num": "88 %",
                      "stat_text": "des visiteurs ne reviennent jamais après une mauvaise première impression"
                  },
                  {
                      "title": "Aucun chemin clair pour vous contacter",
                      "desc": "Pas de CTA stratégiques, pas d'entonnoir, pas d'urgence. Les utilisateurs parcourent toute votre page et partent sans savoir quoi faire.",
                      "stat_num": "70 %",
                      "stat_text": "des sites de petites entreprises n'ont aucune stratégie de conversion"
                  },
                  {
                      "title": "Vous ne capturez aucun lead",
                      "desc": "Pas de formulaires, pas d'automatisation, pas de suivi. Chaque visiteur qui ne convertit pas sur le moment est perdu définitivement.",
                      "stat_num": "96 %",
                      "stat_text": "des visiteurs ne sont pas prêts à acheter lors de leur première visite"
                  }
              ],
              "contrast_bad_title": "Site web classique",
              "contrast_bad": [
                  "Beau visuellement mais ne convertit pas",
                  "Aucun CTA ni parcours utilisateur clair",
                  "Aucun système de capture de leads",
                  "« Contactez-nous » caché dans le pied de page",
                  "Passif — attend et espère des résultats"
              ],
              "contrast_vs": "vs",
              "contrast_good_title": "Système à fort taux de conversion",
              "contrast_good": [
                  "Un message clair qui accroche en 3 secondes",
                  "Chaque page optimisée pour la conversion",
                  "Capture automatique des leads + suivi",
                  "CTA stratégiques qui poussent à l'action",
                  "Conçu pour générer du chiffre en pilote automatique"
              ],
              "transition": "Ça n'a pas à être comme ça.",
              "solution_badge": "La solution",
              "solution_title_line1": "Je transforme votre site web en une",
              "solution_title_em": "machine à acquérir des clients.",
              "solution_desc_html": "Chaque projet que je construis suit un seul cadre : <strong>capter l'attention</strong>, <strong>instaurer la confiance immédiatement</strong> et <strong>pousser les visiteurs à agir</strong>. Pas d'approximation. Juste une structure éprouvée qui convertit.",
              "flow_visit": "Visite",
              "flow_trust": "Confiance",
              "flow_convert": "Conversion"
          },
          "services": {
              "badge": "Services",
              "title_line1": "Trois piliers de la",
              "title_em": "croissance digitale.",
              "subtitle": "Attirer les clients avec des sites à fort taux de conversion. Convertir les leads avec l'automatisation. Faire évoluer les opérations avec des systèmes sur mesure.",
              "cards": [
                  {
                      "tag": "Recommandé",
                      "role": "Attirer des clients",
                      "result": "Obtenez plus de clients",
                      "tm": "Client Acquisition System™",
                      "desc": "Un site web pensé pour transformer chaque visiteur en lead — bâti sur une stratégie, pas seulement un design.",
                      "features": [
                          "Un message qui accroche les visiteurs en moins de 3 secondes",
                          "Un chemin clair de l'atterrissage au contact",
                          "Des pages rapides et bien référencées sur Google",
                          "Une expérience mobile à la hauteur des usages réels"
                      ],
                      "outcome": "Votre site devient une machine à générer des clients 24/7.",
                      "cta": "Obtenir plus de clients"
                  },
                  {
                      "role": "Convertir et relancer",
                      "result": "Automatisez vos leads",
                      "tm": "Lead Automation Engine™",
                      "desc": "Capturez chaque lead, répondez instantanément et relancez automatiquement — sans lever le petit doigt.",
                      "features": [
                          "Ne jamais perdre un lead à cause d'une réponse trop lente",
                          "Relances WhatsApp et email instantanées en pilote automatique",
                          "Leads envoyés directement dans votre CRM",
                          "Économisez plus de 10 h par semaine sur les tâches manuelles"
                      ],
                      "outcome": "Closez plus de deals sans aucun travail manuel.",
                      "cta": "Automatiser mes leads"
                  },
                  {
                      "tag": "Pour entreprises et opérations",
                      "role": "Faire évoluer les opérations",
                      "result": "Pilotez votre activité avec un vrai logiciel",
                      "tm": "Business Systems & Dashboards™",
                      "desc": "Systèmes internes sur mesure pour gérer données, opérations et flux de travail — fini les tableurs, place à des outils de niveau entreprise.",
                      "features": [
                          "Tableaux de bord SQL et reporting en temps réel",
                          "Suivi de production et systèmes d'opérations",
                          "Applications métier internes",
                          "Intégrations personnalisées avec tout votre écosystème"
                      ],
                      "outcome": "Vos opérations tournent sur un logiciel sur mesure — pas sur des tableurs.",
                      "cta": "Construire mon système"
                  }
              ],
              "micro_cta": "Vous voulez que j'audite votre système actuel ?"
          },
          "value": {
              "badge": "Pourquoi moi",
              "title_line1": "Je ne construis pas des sites. Je construis de l'",
              "title_em": "infrastructure d'entreprise.",
              "subtitle": "La plupart des développeurs vous livrent un design. Moi je vous livre un système pensé pour générer du chiffre et fluidifier les opérations.",
              "positioning": "Conçu pour les entreprises, pas juste pour faire un site.",
              "items": [
                  {
                      "title": "Je pense comme un dirigeant",
                      "desc": "Je ne fais pas que coder — je comprends votre modèle économique et je construis autour"
                  },
                  {
                      "title": "Chaque pixel a une mission",
                      "desc": "Rien de décoratif. Chaque élément existe pour rapprocher le visiteur du statut de client"
                  },
                  {
                      "title": "La clarté avant la complexité",
                      "desc": "Structure propre, performance rapide, zéro confusion — les visiteurs savent exactement quoi faire"
                  },
                  {
                      "title": "Conçu pour évoluer avec vous",
                      "desc": "Aujourd'hui votre site gère 10 clients. Je le construis pour en gérer 1 000 sans broncher"
                  }
              ]
          },
          "process": {
              "badge": "Processus",
              "title_line1": "Du premier appel au lancement en",
              "title_em": "moins de 3 semaines.",
              "subtitle": "Un processus éprouvé en 4 étapes. Sans superflu. Sans délais. Juste de l'exécution ciblée.",
              "deliverable_label": "Livrable :",
              "steps": [
                  {
                      "title": "Immersion",
                      "desc": "J'apprends à connaître votre activité, vos clients et ce qui les pousse à acheter",
                      "deliverable": "Plan d'action clair"
                  },
                  {
                      "title": "Stratégie et structure",
                      "desc": "Je cartographie le tunnel de conversion, le message et l'architecture des pages",
                      "deliverable": "Plan du système"
                  },
                  {
                      "title": "Construction et affinage",
                      "desc": "Je conçois, développe et optimise jusqu'à ce que chaque élément convertisse",
                      "deliverable": "Système complet"
                  },
                  {
                      "title": "Lancement et suivi",
                      "desc": "Mise en ligne en toute confiance — je surveille, j'ajuste et je vous accompagne après le lancement",
                      "deliverable": "En ligne et optimisé"
                  }
              ]
          },
          "pricing": {
              "badge": "Tarifs et plans",
              "title_line1": "Choisissez le plan à la hauteur de votre",
              "title_em": "ambition.",
              "subtitle": "Pas de frais cachés. Pas de surprises. Choisissez un plan et lançons votre moteur de croissance.",
              "plans": [
                  {
                      "tier": "Starter",
                      "result": "Lancez un site professionnel qui inspire confiance et crédibilité.",
                      "currency": "$",
                      "price": "1 500",
                      "plus": "",
                      "who": "Idéal pour les petites entreprises qui lancent leur première présence web pro.",
                      "features": [
                          "Design orienté conversion",
                          "Optimisation mobile",
                          "Performance rapide (moins de 2 s de chargement)",
                          "Message clair et placement stratégique des CTA"
                      ],
                      "roi": "Un seul nouveau client couvre tout l'investissement.",
                      "cta": "Commencer"
                  },
                  {
                      "tier": "Growth",
                      "badge": "La majorité commence ici",
                      "result": "Générez des leads constants et convertissez vos visiteurs en clients.",
                      "currency": "$",
                      "price": "3 000",
                      "plus": "",
                      "who": "Idéal pour les entreprises qui veulent générer des leads réguliers depuis leur site.",
                      "features": [
                          "Tout ce qui est inclus dans Starter",
                          "Système de capture de leads et tunnel CTA",
                          "Optimisation des conversions",
                          "Automatisation et relances de base",
                          "Session stratégique incluse"
                      ],
                      "roi": "Un seul client peut payer tout ce système.",
                      "cta": "Obtenir plus de clients"
                  },
                  {
                      "tier": "Scale",
                      "badge": "Pour entreprises",
                      "result": "Construisez un système digital complet qui fait croître votre activité automatiquement.",
                      "currency": "$",
                      "price": "6 000",
                      "plus": "+",
                      "who": "Idéal pour les entreprises qui ont besoin d'un système complet — site, automatisation et outils sur mesure.",
                      "features": [
                          "Système complet (site + automatisation)",
                          "Workflows et séquences avancés",
                          "Intégrations sur mesure (CRM, API)",
                          "Optimisation des performances et analytics",
                          "Support prioritaire et optimisation continue"
                      ],
                      "roi": "Conçu pour des résultats business réels — des systèmes qui se rentabilisent.",
                      "cta": "Construire mon système"
                  }
              ],
              "consulting": {
                  "badge": "Expertise pointue",
                  "title": "Conseil et accompagnement technique",
                  "audience": "Pour développeurs et entreprises",
                  "desc": "Résolvez des problèmes de production concrets, améliorez les performances et concevez une architecture scalable avec un accompagnement expert.",
                  "list": [
                      "Débogage et résolution d'incidents en production",
                      "Optimisation des performances et tests de charge",
                      "Conception d'architecture scalable",
                      "Revue de code et audits de système"
                  ],
                  "hourly_title": "Session à l'heure",
                  "hourly_price": "75 $",
                  "hourly_suffix": "/h",
                  "hourly_desc": "Plongée ciblée dans un problème de production spécifique.",
                  "package_title": "Pack 4 sessions",
                  "package_price": "250 $",
                  "package_save": "Économisez 17 %",
                  "package_desc": "Accompagnement structuré sur plusieurs sessions pour des systèmes complexes.",
                  "cta": "Réserver une session"
              },
              "maintenance": {
                  "title": "Maintenance et support",
                  "desc": "Gardez votre site rapide, sécurisé et en constante amélioration.",
                  "basic_title": "Basic",
                  "basic_price": "50 $",
                  "basic_suffix": "/mois",
                  "basic_items": [
                      "Corrections de bugs",
                      "Petites mises à jour"
                  ],
                  "pro_title": "Pro",
                  "pro_price": "150 $",
                  "pro_suffix": "/mois",
                  "pro_items": [
                      "Support prioritaire",
                      "Améliorations mensuelles",
                      "Monitoring des performances"
                  ],
                  "cta": "Maintenir mon site"
              },
              "addons": {
                  "title": "Options puissantes",
                  "items": [
                      {
                          "name": "Optimisation SEO",
                          "desc": "Mieux classé, trafic gratuit",
                          "price": "500 $"
                      },
                      {
                          "name": "Optimisation vitesse",
                          "desc": "Chargement sous 2 s garanti",
                          "price": "300 $"
                      },
                      {
                          "name": "Intégration API",
                          "desc": "Connectez n'importe quel outil ou service",
                          "price": "800 $"
                      },
                      {
                          "name": "Fonctionnalités IA",
                          "desc": "Chatbots, générateurs, outils intelligents",
                          "price": "1 000 $+"
                      },
                      {
                          "name": "Multi-langues",
                          "desc": "Élargissez votre audience",
                          "price": "400 $"
                      }
                  ]
              }
          },
          "apps": {
              "badge": "Studio d'applications mobiles",
              "title_line1": "Sites web, automatisation et",
              "title_em": "applications mobiles sur Google Play.",
              "subtitle": "Youssef Erradi Labs conçoit des expériences Android soignées qui prolongent votre activité au-delà du navigateur — rapides, cohérentes avec votre marque et prêtes pour de vrais utilisateurs.",
              "play_aria": "Voir Youssef Erradi Labs sur Google Play",
              "play_overline": "Disponible sur",
              "play_label": "Google Play",
              "cta_primary": "Créer mon application",
              "trust": [
                  "Livraison prête pour Android",
                  "UX cohérente avec la marque",
                  "Accompagnement présence store"
              ],
              "stats": [
                  {
                      "number": "3+",
                      "label": "Catégories d'apps"
                  },
                  {
                      "number": "24/7",
                      "label": "Visibilité mobile"
                  },
                  {
                      "number": "Play",
                      "label": "Canal de distribution"
                  }
              ],
              "mockup": {
                  "main_label": "Launch Suite",
                  "main_title": "Système produit mobile",
                  "secondary_label": "Google Play",
                  "secondary_title": "Présence app crédible"
              },
              "cards": [
                  {
                      "kicker": "Apps client",
                      "title": "Réservation de services et capture de leads",
                      "desc": "Des tunnels mobiles qui aident vos clients à demander un devis, réserver un appel et rester connectés depuis leur téléphone."
                  },
                  {
                      "kicker": "Outils métier",
                      "title": "Des tableaux de bord dans la poche",
                      "desc": "Vues opérationnelles, rapports et workflows internes conçus pour les équipes qui avancent vite."
                  },
                  {
                      "kicker": "Prêt pour le store",
                      "title": "Finition premium pour Google Play",
                      "desc": "Branding propre, interfaces responsives et assets de store alignés avec l'identité de votre entreprise."
                  }
              ]
          },
          "work": {
              "badge": "Résultats",
              "title_line1": "Projets",
              "title_em": "sélectionnés.",
              "subtitle": "De vrais projets. De vrais résultats. Voici ce que j'ai construit pour des entreprises comme la vôtre.",
              "cases": [
                  {
                      "industry": "Industrie alimentaire",
                      "title": "Cuisine Solution System",
                      "type": "Systèmes de production internes et tableaux de bord",
                      "desc": "Création de systèmes de suivi de production sur mesure et de tableaux de bord SQL pour piloter les opérations quotidiennes — remplaçant les tableurs par une visibilité en temps réel sur toute la chaîne.",
                      "result": "Reporting manuel réduit de 80 % · Visibilité production en temps réel",
                      "tags": [
                          "Tableau SQL",
                          "Suivi de production",
                          "Outils internes"
                      ]
                  },
                  {
                      "industry": "Tech / Services IT",
                      "title": "EGTV Informatique",
                      "type": "Applications scalables et outils de reporting",
                      "desc": "Développement d'applications web scalables et d'outils de reporting — permettant à l'entreprise de suivre la performance, de gérer ses clients et d'automatiser ses flux internes.",
                      "result": "Gestion clients automatisée · Reporting 3× plus rapide",
                      "tags": [
                          "Application full-stack",
                          "Reporting",
                          "Automatisation"
                      ]
                  },
                  {
                      "industry": "SaaS / Outils digitaux",
                      "title": "SmartlyTools",
                      "type": "Plateforme d'outils en ligne",
                      "desc": "Construction d'une plateforme d'outils façon SaaS de A à Z — rapide, scalable et conçue pour un usage à fort volume avec une UX propre.",
                      "result": "Architecture scalable · Supporte un trafic élevé",
                      "tags": [
                          "Plateforme",
                          "SaaS",
                          "Full-Stack"
                      ]
                  }
              ],
              "trust_line": "Utilisé par des entreprises pour améliorer leurs opérations et passer à l'échelle."
          },
          "about": {
              "badge": "À propos",
              "title": "Bonjour, je suis Youssef.",
              "lead": "Je ne suis pas un designer qui code. Je suis un développeur full-stack qui construit des systèmes qui produisent des résultats business.",
              "p1_html": "Après avoir mené plus de 50 projets dans la production alimentaire, les services IT, le SaaS et les services professionnels, j'ai appris une chose : <strong>un beau site ne vaut rien s'il ne génère pas de revenus ou ne résout pas un vrai problème opérationnel.</strong>",
              "p2": "C'est pour ça que chaque projet commence par vos objectifs business — pas par une palette de couleurs. Je construis une infrastructure digitale qui attire des clients, automatise les flux et grandit avec vous.",
              "industries_label": "Secteurs servis :",
              "industries_tags": [
                  "Alimentaire et production",
                  "IT et tech",
                  "Services professionnels",
                  "SaaS"
              ],
              "stats": [
                  {
                      "number": "50+",
                      "label": "Projets"
                  },
                  {
                      "number": "3+",
                      "label": "Années"
                  },
                  {
                      "number": "100 %",
                      "label": "Engagement"
                  }
              ],
              "trust_title": "Pourquoi mes clients reviennent",
              "trust_desc": "Je travaille avec des dirigeants sérieux qui veulent des résultats — pas juste des livrables.",
              "trust_items": [
                  {
                      "title": "Exécution de niveau senior",
                      "desc": "Code propre, stack moderne, conçu pour durer"
                  },
                  {
                      "title": "Mentalité orientée chiffre d'affaires",
                      "desc": "Chaque décision liée à votre rentabilité"
                  },
                  {
                      "title": "Communication sans détour",
                      "desc": "Réponses rapides, délais honnêtes, zéro blabla"
                  },
                  {
                      "title": "Partenariat long terme",
                      "desc": "Je ne disparais pas après le lancement — je vous accompagne dans la croissance"
                  }
              ]
          },
          "cta": {
              "badge": "Disponibilité limitée",
              "title_line1": "Arrêtez de perdre des clients à cause d'un",
              "title_line2": "site qui ne",
              "title_em": "convertit pas.",
              "urgency": "Chaque jour d'attente, vous perdez des clients potentiels au profit de concurrents mieux équipés.",
              "value": "J'audite votre site actuel, j'identifie ce qui vous coûte des clients et je vous donne un plan d'action clair.",
              "pills": [
                  "Sans pression",
                  "Sans engagement",
                  "Juste de la clarté"
              ],
              "main_button": "Réserver un appel stratégique gratuit",
              "main_value": "Obtenez un plan clair pour votre activité — sans engagement",
              "channels_label": "Vous préférez les messages ? Choisissez le canal qui vous convient.",
              "channels": {
                  "whatsapp": "WhatsApp",
                  "linkedin": "LinkedIn",
                  "email": "Email",
                  "instagram": "Instagram"
              },
              "note": "Je réponds sous 24 heures · Disponibilité limitée · Quelques places seulement par mois"
          },
          "footer": {
              "tagline": "Des systèmes qui génèrent des clients automatiquement.",
              "nav_title": "Navigation",
              "links": {
                  "home": "Accueil",
                  "services": "Services",
                  "work": "Réalisations",
                  "pricing": "Tarifs",
                  "contact": "Contact"
              },
              "connect_title": "Connecter",
              "connect": {
                  "linkedin": "LinkedIn",
                  "email": "Email",
                  "whatsapp": "WhatsApp"
              },
              "copyright": "© 2026 Youssef Erradi Labs. Tous droits réservés."
          },
          "lang_switcher": {
              "label": "Langue",
              "en": "English",
              "fr": "Français",
              "ar": "العربية"
          }
      },
      "ar": {
          "meta": {
              "lang_name": "العربية",
              "lang_short": "AR",
              "title": "يوسف الراضي | أنظمة تجلب لك العملاء. تلقائيًا.",
              "description": "أبني أنظمة أعمال متكاملة — مواقع عالية التحويل، أتمتة العملاء المحتملين، ولوحات تحكم مخصصة — تُولّد الإيرادات وتُبسّط العمليات للشركات النامية."
          },
          "a11y": {
              "ye_logo": "شعار YE",
              "toggle_menu": "فتح القائمة",
              "back_to_top": "العودة إلى الأعلى",
              "language_selector": "اختيار اللغة",
              "open_language_menu": "فتح قائمة اللغات"
          },
          "logo": {
              "name": "Youssef Erradi Labs",
              "sub": "أنظمة • أتمتة • نمو"
          },
          "nav": {
              "services": "الخدمات",
              "pricing": "الأسعار",
              "work": "الأعمال",
              "process": "المنهجية",
              "about": "من أنا",
              "cta": "ابدأ مشروعك"
          },
          "hero": {
              "badge": "توفر محدود — مكانان متبقيان هذا الشهر",
              "title_line1": "أنظمة تجلب لك",
              "title_line2": "العملاء.",
              "title_em": "تلقائيًا.",
              "desc_html": "ليست مجرد مواقع — <strong>أنظمة أعمال متكاملة</strong> تجذب العملاء، وتلتقط العملاء المحتملين تلقائيًا، وتمنحك رؤية لحظية لعملياتك عبر لوحات تحكم وأدوات مخصصة.",
              "supporting": "مصممة للشركات التي تريد نموًا مستقرًا وعمليات مؤتمتة.",
              "cta_primary": "احجز مكالمة استراتيجية مجانية",
              "cta_secondary": "شاهد أعمالي",
              "trust": "أنظمة حقيقية تستخدمها الشركات لإدارة العمليات وسير العمل",
              "stat_projects_label": "مشروع",
              "stat_satisfaction_label": "رضا",
              "stat_response_label": "الرد",
              "card_conversion_label": "معدل التحويل",
              "card_revenue_label": "نمو الإيرادات",
              "card_leads_label": "عملاء جدد/شهر",
              "image_alt": "يوسف الراضي — مطور ويب ومستشار"
          },
          "problem": {
              "badge": "الحقيقة الصعبة",
              "title_line1": "كل يوم، موقعك",
              "title_em": "يخسرك المال.",
              "subtitle": "تستثمر في الإعلانات، وتُنتج المحتوى، وتجلب الزيارات — لكن لا شيء من هذا يهم إذا كان موقعك لا يحوّل. ومعظم المواقع لا تفعل.",
              "story_label": "هذا يحدث الآن",
              "story_steps": [
                  "عميل محتمل يبحث تمامًا عمّا تقدّمه.",
                  "يضغط على الرابط. موقعك يستغرق وقتًا طويلًا للتحميل.",
                  "لا يفهم ما تفعله خلال 3 ثوانٍ.",
                  "لا توجد خطوة تالية واضحة. لا دعوة لاتخاذ إجراء. لا اتجاه.",
                  "يُغلق علامة التبويب. ضاع إلى الأبد.",
                  "منافسك يحصل على الصفقة."
              ],
              "cards": [
                  {
                      "title": "الزوار لا يفهمون ما تفعله",
                      "desc": "عنوان غير واضح، لا قيمة مقترحة، تخطيط مزدحم. يغادرون خلال أقل من 5 ثوانٍ دون قراءة كلمة واحدة.",
                      "stat_num": "88%",
                      "stat_text": "من الزوار لا يعودون أبدًا بعد انطباع أول سيئ"
                  },
                  {
                      "title": "لا يوجد طريق واضح للتواصل معك",
                      "desc": "لا CTA استراتيجية، لا قمع تحويل، لا إلحاح. يتصفح المستخدمون صفحتك كاملة ويغادرون دون أن يعرفوا ماذا يفعلون.",
                      "stat_num": "70%",
                      "stat_text": "من مواقع الشركات الصغيرة بدون أي استراتيجية تحويل"
                  },
                  {
                      "title": "أنت لا تجمع أي عملاء محتملين",
                      "desc": "لا نماذج، لا أتمتة، لا متابعة. كل زائر لا يتحوّل فورًا يُفقد نهائيًا.",
                      "stat_num": "96%",
                      "stat_text": "من الزوار غير مستعدين للشراء في زيارتهم الأولى"
                  }
              ],
              "contrast_bad_title": "موقع تقليدي",
              "contrast_bad": [
                  "يبدو جميلًا لكنه لا يحوّل",
                  "لا CTA ولا مسار مستخدم واضح",
                  "لا نظام لجمع العملاء المحتملين",
                  "«تواصل معنا» مدفونة في التذييل",
                  "سلبي — ينتظر ويأمل في النتائج"
              ],
              "contrast_vs": "مقابل",
              "contrast_good_title": "نظام عالي التحويل",
              "contrast_good": [
                  "رسالة واضحة تجذب الانتباه في 3 ثوانٍ",
                  "كل صفحة مُحسّنة للتحويل",
                  "جمع تلقائي للعملاء المحتملين + متابعة",
                  "CTA استراتيجية تدفع إلى الإجراء",
                  "مبنية لتولّد إيرادات على الطيار الآلي"
              ],
              "transition": "ليس من الضروري أن يكون الأمر هكذا.",
              "solution_badge": "الحل",
              "solution_title_line1": "أُحوّل موقعك إلى",
              "solution_title_em": "آلة لاكتساب العملاء.",
              "solution_desc_html": "كل مشروع أبنيه يتبع إطارًا واحدًا: <strong>جذب الانتباه</strong>، <strong>بناء الثقة الفورية</strong>، و<strong>دفع الزائر إلى اتخاذ إجراء</strong>. لا تخمين. فقط هيكل مثبت يحوّل.",
              "flow_visit": "زيارة",
              "flow_trust": "ثقة",
              "flow_convert": "تحويل"
          },
          "services": {
              "badge": "الخدمات",
              "title_line1": "ثلاث ركائز",
              "title_em": "للنمو الرقمي.",
              "subtitle": "اجذب العملاء بمواقع عالية التحويل. حوّل العملاء المحتملين بالأتمتة. وسّع العمليات بأنظمة مخصصة.",
              "cards": [
                  {
                      "tag": "موصى به",
                      "role": "جذب العملاء",
                      "result": "احصل على عملاء أكثر",
                      "tm": "Client Acquisition System™",
                      "desc": "موقع مُهندَس لتحويل كل زائر إلى عميل محتمل — مبني على الاستراتيجية، لا التصميم فقط.",
                      "features": [
                          "رسالة تجذب الزوار خلال أقل من 3 ثوانٍ",
                          "مسار واضح من الوصول إلى التواصل معك",
                          "صفحات سريعة التحميل وتظهر في Google",
                          "تجربة موبايل تطابق الطريقة الفعلية للتصفح"
                      ],
                      "outcome": "يُصبح موقعك آلة لتوليد العملاء 24/7.",
                      "cta": "احصل على عملاء أكثر"
                  },
                  {
                      "role": "حوّل وتابع",
                      "result": "أتمت عملاءك المحتملين",
                      "tm": "Lead Automation Engine™",
                      "desc": "التقط كل عميل محتمل، استجب فورًا، وتابع تلقائيًا — دون أن تحرّك ساكنًا.",
                      "features": [
                          "لن تخسر عميلًا بسبب بطء الرد مرة أخرى",
                          "متابعات WhatsApp والبريد الإلكتروني فورية وتلقائية",
                          "العملاء المحتملون يُوجَّهون مباشرة إلى CRM",
                          "وفّر أكثر من 10 ساعات أسبوعيًا من المهام اليدوية"
                      ],
                      "outcome": "أغلق صفقات أكثر دون أي عمل يدوي.",
                      "cta": "أتمت عملائي"
                  },
                  {
                      "tag": "للشركات والعمليات",
                      "role": "وسّع العمليات",
                      "result": "أدِر أعمالك ببرنامج حقيقي",
                      "tm": "Business Systems & Dashboards™",
                      "desc": "أنظمة داخلية مخصصة للشركات لإدارة البيانات والعمليات وسير العمل — استبدل جداول البيانات بأدوات على مستوى المؤسسات.",
                      "features": [
                          "لوحات تحكم SQL وتقارير لحظية",
                          "تتبع الإنتاج وأنظمة العمليات",
                          "تطبيقات أعمال داخلية",
                          "تكاملات مخصصة مع كامل منظومتك التقنية"
                      ],
                      "outcome": "عملياتك تعمل ببرنامج مخصص — لا بجداول البيانات.",
                      "cta": "ابنِ نظامي"
                  }
              ],
              "micro_cta": "هل تريد مراجعة نظامك الحالي؟"
          },
          "value": {
              "badge": "لماذا أنا",
              "title_line1": "لا أبني مواقع. أبني",
              "title_em": "بنية تحتية للأعمال.",
              "subtitle": "معظم المطورين يعطونك تصميمًا. أنا أعطيك نظامًا مُهندَسًا ليولّد الإيرادات ويُبسّط العمليات.",
              "positioning": "مصممة للشركات، لا لمجرد إنشاء موقع.",
              "items": [
                  {
                      "title": "أفكّر كصاحب عمل",
                      "desc": "لا أكتفي بالبرمجة — أفهم نموذج إيراداتك وأبني حوله"
                  },
                  {
                      "title": "كل بكسل له وظيفة",
                      "desc": "لا شيء زخرفي. كل عنصر موجود ليقرّب الزائر من أن يصبح عميلًا"
                  },
                  {
                      "title": "الوضوح قبل التعقيد",
                      "desc": "بنية نظيفة، أداء سريع، صفر تشتيت — الزوار يعرفون تمامًا ما يفعلون"
                  },
                  {
                      "title": "مبنية لتنمو معك",
                      "desc": "موقعك اليوم يخدم 10 عملاء. أبنيه ليخدم 1000 دون أن ينكسر"
                  }
              ]
          },
          "process": {
              "badge": "المنهجية",
              "title_line1": "من أول مكالمة إلى الإطلاق في",
              "title_em": "أقل من 3 أسابيع.",
              "subtitle": "منهجية مُثبتة من 4 خطوات. بلا حشو. بلا تأخير. تنفيذ مُركّز فقط.",
              "deliverable_label": "التسليم:",
              "steps": [
                  {
                      "title": "الغوص العميق",
                      "desc": "أتعرّف على نشاطك وعملائك وما يدفعهم للشراء",
                      "deliverable": "خطة عمل واضحة"
                  },
                  {
                      "title": "الاستراتيجية والهيكل",
                      "desc": "أرسم مسار التحويل والرسالة وهيكل الصفحات",
                      "deliverable": "مخطط النظام"
                  },
                  {
                      "title": "البناء والصقل",
                      "desc": "أُصمّم وأطوّر وأُحسّن حتى يتحوّل كل عنصر",
                      "deliverable": "نظام مكتمل"
                  },
                  {
                      "title": "الإطلاق والدعم",
                      "desc": "انطلق بثقة — أراقب وأعدّل وأدعم بعد الإطلاق",
                      "deliverable": "حيّ ومُحسّن"
                  }
              ]
          },
          "pricing": {
              "badge": "الأسعار والخطط",
              "title_line1": "اختر الخطة التي تناسب",
              "title_em": "طموحك.",
              "subtitle": "لا رسوم خفية. لا مفاجآت. اختر خطة ولنبدأ ببناء محرك نموك.",
              "plans": [
                  {
                      "tier": "Starter",
                      "result": "أطلق موقعًا احترافيًا يبني الثقة والمصداقية.",
                      "currency": "$",
                      "price": "1,500",
                      "plus": "",
                      "who": "الأنسب للشركات الصغيرة التي تُطلق حضورها الإلكتروني الاحترافي الأول.",
                      "features": [
                          "تصميم مُركّز على التحويل",
                          "تحسين للأجهزة المحمولة",
                          "أداء سريع (تحميل أقل من ثانيتين)",
                          "رسالة واضحة وتموضع استراتيجي لـ CTA"
                      ],
                      "roi": "عميل جديد واحد يغطي كامل الاستثمار.",
                      "cta": "ابدأ الآن"
                  },
                  {
                      "tier": "Growth",
                      "badge": "نقطة البداية للأغلبية",
                      "result": "ولّد عملاء محتملين بشكل ثابت وحوّل الزوار إلى عملاء.",
                      "currency": "$",
                      "price": "3,000",
                      "plus": "",
                      "who": "الأنسب للشركات التي تريد توليد عملاء محتملين بشكل منتظم من موقعها.",
                      "features": [
                          "كل ما في خطة Starter",
                          "نظام التقاط العملاء المحتملين وقمع CTA",
                          "تحسين التحويلات",
                          "أتمتة ومتابعة أساسية",
                          "جلسة استراتيجية مشمولة"
                      ],
                      "roi": "عميل واحد يمكنه دفع كامل النظام.",
                      "cta": "احصل على عملاء أكثر"
                  },
                  {
                      "tier": "Scale",
                      "badge": "للشركات",
                      "result": "ابنِ نظامًا رقميًا متكاملًا يُنمّي عملك تلقائيًا.",
                      "currency": "$",
                      "price": "6,000",
                      "plus": "+",
                      "who": "الأنسب للشركات التي تحتاج نظامًا كاملًا — موقعًا، أتمتة، وأدوات مخصصة.",
                      "features": [
                          "نظام متكامل (موقع + أتمتة)",
                          "سير عمل ومتواليات متقدمة",
                          "تكاملات مخصصة (CRM، APIs)",
                          "تحسين الأداء وتحليلات",
                          "دعم بالأولوية وتحسين مستمر"
                      ],
                      "roi": "مبنية لنتائج أعمال حقيقية — أنظمة تُغطي تكلفتها بنفسها.",
                      "cta": "ابنِ نظامي"
                  }
              ],
              "consulting": {
                  "badge": "إرشاد خبير",
                  "title": "الاستشارات والإرشاد التقني",
                  "audience": "للمطورين والشركات",
                  "desc": "حلّ مشاكل الإنتاج الحقيقية، حسّن أداء الأنظمة، وصمّم بنية قابلة للتوسع مع إرشاد خبير.",
                  "list": [
                      "تصحيح الأخطاء واستكشافها في الإنتاج",
                      "تحسين الأداء واختبارات التحميل",
                      "تصميم بنية قابلة للتوسع",
                      "مراجعة الكود وتدقيق الأنظمة"
                  ],
                  "hourly_title": "جلسة بالساعة",
                  "hourly_price": "75$",
                  "hourly_suffix": "/س",
                  "hourly_desc": "غوص مُستهدف في مشكلة إنتاج محددة.",
                  "package_title": "باقة 4 جلسات",
                  "package_price": "250$",
                  "package_save": "وفّر 17%",
                  "package_desc": "إرشاد منظّم عبر عدة جلسات للأنظمة المعقدة.",
                  "cta": "احجز جلسة"
              },
              "maintenance": {
                  "title": "الصيانة والدعم",
                  "desc": "حافظ على موقعك سريعًا وآمنًا ومُتحسّنًا باستمرار.",
                  "basic_title": "Basic",
                  "basic_price": "50$",
                  "basic_suffix": "/شهر",
                  "basic_items": [
                      "إصلاح الأخطاء",
                      "تحديثات صغيرة"
                  ],
                  "pro_title": "Pro",
                  "pro_price": "150$",
                  "pro_suffix": "/شهر",
                  "pro_items": [
                      "دعم بالأولوية",
                      "تحسينات شهرية",
                      "مراقبة الأداء"
                  ],
                  "cta": "حافظ على تشغيل موقعي"
              },
              "addons": {
                  "title": "إضافات قوية",
                  "items": [
                      {
                          "name": "تحسين SEO",
                          "desc": "ترتيب أعلى، زيارات مجانية",
                          "price": "500$"
                      },
                      {
                          "name": "تحسين السرعة",
                          "desc": "تحميل أقل من ثانيتين مضمون",
                          "price": "300$"
                      },
                      {
                          "name": "تكامل API",
                          "desc": "اربط أي أداة أو خدمة",
                          "price": "800$"
                      },
                      {
                          "name": "ميزات بالذكاء الاصطناعي",
                          "desc": "روبوتات، مولّدات، أدوات ذكية",
                          "price": "1,000$+"
                      },
                      {
                          "name": "تعدد اللغات",
                          "desc": "وسّع جمهورك",
                          "price": "400$"
                      }
                  ]
              }
          },
          "apps": {
              "badge": "استوديو تطبيقات الهاتف",
              "title_line1": "مواقع، أتمتة، و",
              "title_em": "تطبيقات هاتف على Google Play.",
              "subtitle": "يبني Youssef Erradi Labs تجارب Android مصقولة توسّع حضور عملك خارج المتصفح — سريعة، متناسقة مع علامتك، وجاهزة لمستخدمين حقيقيين.",
              "play_aria": "عرض Youssef Erradi Labs على Google Play",
              "play_overline": "متاح على",
              "play_label": "Google Play",
              "cta_primary": "ابنِ تطبيقي",
              "trust": [
                  "تسليم جاهز لأندرويد",
                  "تجربة متناسقة مع العلامة",
                  "دعم الحضور على المتجر"
              ],
              "stats": [
                  {
                      "number": "3+",
                      "label": "فئات تطبيقات"
                  },
                  {
                      "number": "24/7",
                      "label": "حضور على الهاتف"
                  },
                  {
                      "number": "Play",
                      "label": "قناة توزيع"
                  }
              ],
              "mockup": {
                  "main_label": "Launch Suite",
                  "main_title": "نظام منتج للهاتف",
                  "secondary_label": "Google Play",
                  "secondary_title": "حضور تطبيق موثوق"
              },
              "cards": [
                  {
                      "kicker": "تطبيقات العملاء",
                      "title": "حجز الخدمات والتقاط العملاء المحتملين",
                      "desc": "مسارات هاتف تساعد العملاء على طلب عروض الأسعار، حجز المكالمات، والبقاء متصلين من هواتفهم."
                  },
                  {
                      "kicker": "أدوات الأعمال",
                      "title": "لوحات تحكم في جيبك",
                      "desc": "مشاهد تشغيلية، تقارير، وسير عمل داخلية مصممة للفرق التي تتحرك بسرعة."
                  },
                  {
                      "kicker": "جاهز للمتجر",
                      "title": "لمسة إطلاق احترافية على Google Play",
                      "desc": "هوية نظيفة، واجهات متجاوبة، وأصول موجهة للمتجر متناسقة مع هوية شركتك."
                  }
              ]
          },
          "work": {
              "badge": "النتائج",
              "title_line1": "أعمال",
              "title_em": "مختارة.",
              "subtitle": "مشاريع حقيقية. نتائج حقيقية. إليك ما بنيته لشركات مثل شركتك.",
              "cases": [
                  {
                      "industry": "صناعة الأغذية",
                      "title": "Cuisine Solution System",
                      "type": "أنظمة إنتاج داخلية ولوحات تحكم",
                      "desc": "بناء أنظمة تتبع إنتاج مخصصة ولوحات تحكم SQL لإدارة العمليات اليومية — استبدال جداول البيانات برؤية لحظية على كامل خط الإنتاج.",
                      "result": "تقليل التقارير اليدوية بنسبة 80% · رؤية إنتاج لحظية",
                      "tags": [
                          "لوحة SQL",
                          "تتبع الإنتاج",
                          "أدوات داخلية"
                      ]
                  },
                  {
                      "industry": "تقنية / خدمات IT",
                      "title": "EGTV Informatique",
                      "type": "تطبيقات قابلة للتوسع وأدوات تقارير",
                      "desc": "تطوير تطبيقات ويب قابلة للتوسع وأدوات تقارير — مكّنت الشركة من تتبع الأداء وإدارة العملاء وأتمتة سير العمل الداخلي.",
                      "result": "إدارة عملاء مؤتمتة · تقارير أسرع 3 مرات",
                      "tags": [
                          "تطبيق Full-Stack",
                          "تقارير",
                          "أتمتة"
                      ]
                  },
                  {
                      "industry": "SaaS / أدوات رقمية",
                      "title": "SmartlyTools",
                      "type": "منصة أدوات عبر الإنترنت",
                      "desc": "بناء منصة أدوات بأسلوب SaaS من الصفر — سريعة وقابلة للتوسع ومصممة للاستخدام عالي الحجم بتجربة مستخدم نظيفة.",
                      "result": "بنية قابلة للتوسع · تتعامل مع زيارات بحجم عالٍ",
                      "tags": [
                          "منصة",
                          "SaaS",
                          "Full-Stack"
                      ]
                  }
              ],
              "trust_line": "تستخدمها الشركات لتحسين العمليات والتوسع بكفاءة."
          },
          "about": {
              "badge": "من أنا",
              "title": "مرحبًا، أنا يوسف.",
              "lead": "لست مصممًا يكتب الكود. أنا مطوّر Full-Stack أبني أنظمة تُحرّك نتائج الأعمال.",
              "p1_html": "بعد إنجاز أكثر من 50 مشروعًا في الإنتاج الغذائي وخدمات IT وSaaS والخدمات الاحترافية، تعلّمت شيئًا واحدًا: <strong>الموقع الجميل لا يعني شيئًا إذا لم يُولّد إيرادات أو يحلّ مشكلة تشغيلية حقيقية.</strong>",
              "p2": "لهذا يبدأ كل مشروع بأهدافك التجارية — لا بلوحة ألوان. أبني بنية تحتية رقمية تجذب العملاء، وتؤتمت سير العمل، وتنمو معك.",
              "industries_label": "القطاعات المخدومة:",
              "industries_tags": [
                  "الأغذية والإنتاج",
                  "IT والتقنية",
                  "الخدمات الاحترافية",
                  "SaaS"
              ],
              "stats": [
                  {
                      "number": "50+",
                      "label": "مشروع"
                  },
                  {
                      "number": "3+",
                      "label": "سنوات"
                  },
                  {
                      "number": "100%",
                      "label": "تفانٍ"
                  }
              ],
              "trust_title": "لماذا يعود إليّ العملاء",
              "trust_desc": "أعمل مع أصحاب أعمال جادّين يريدون نتائج — لا مجرد تسليمات.",
              "trust_items": [
                  {
                      "title": "تنفيذ بمستوى Senior",
                      "desc": "كود نظيف، Stack حديث، مبني ليدوم"
                  },
                  {
                      "title": "عقلية تُركّز على الإيرادات",
                      "desc": "كل قرار مرتبط بربحيتك"
                  },
                  {
                      "title": "تواصل بلا حشو",
                      "desc": "ردود سريعة، مواعيد صادقة، صفر كلام فارغ"
                  },
                  {
                      "title": "شراكة طويلة الأمد",
                      "desc": "لا أختفي بعد الإطلاق — أرافقك في النمو"
                  }
              ]
          },
          "cta": {
              "badge": "توفر محدود",
              "title_line1": "توقّف عن خسارة العملاء بسبب",
              "title_line2": "موقع لا",
              "title_em": "يحوّل.",
              "urgency": "كل يوم تنتظر فيه، تخسر عملاء محتملين لصالح منافسين بأنظمة أفضل.",
              "value": "سأراجع موقعك الحالي، أحدّد ما يكلّفك العملاء، وأعطيك خطة عمل واضحة.",
              "pills": [
                  "بلا ضغط",
                  "بلا التزام",
                  "وضوح فقط"
              ],
              "main_button": "احجز مكالمة استراتيجية مجانية",
              "main_value": "احصل على خطة واضحة لعملك — بلا التزام",
              "channels_label": "تفضّل الرسائل؟ تواصل بالطريقة التي تناسبك.",
              "channels": {
                  "whatsapp": "WhatsApp",
                  "linkedin": "LinkedIn",
                  "email": "البريد الإلكتروني",
                  "instagram": "Instagram"
              },
              "note": "أردّ خلال 24 ساعة · توفر محدود · أماكن قليلة فقط كل شهر"
          },
          "footer": {
              "tagline": "أنظمة تُولّد العملاء تلقائيًا.",
              "nav_title": "التنقل",
              "links": {
                  "home": "الرئيسية",
                  "services": "الخدمات",
                  "work": "الأعمال",
                  "pricing": "الأسعار",
                  "contact": "تواصل"
              },
              "connect_title": "تواصل",
              "connect": {
                  "linkedin": "LinkedIn",
                  "email": "البريد الإلكتروني",
                  "whatsapp": "WhatsApp"
              },
              "copyright": "© 2026 Youssef Erradi Labs. جميع الحقوق محفوظة."
          },
          "lang_switcher": {
              "label": "اللغة",
              "en": "English",
              "fr": "Français",
              "ar": "العربية"
          }
      }
  };

  const SUPPORTED = ['en', 'fr', 'ar'];
  const DEFAULT_LANG = 'en';
  const RTL_LANGS = new Set(['ar']);
  const STORAGE_KEY = 'yelabs_lang';
  const LOCALE_BASE = 'locales/';
  const IS_FILE_PROTOCOL = window.location.protocol === 'file:';
  const LABELS = { en: 'EN', fr: 'FR', ar: 'AR' };
  const NAMES = { en: 'English', fr: 'Français', ar: 'العربية' };

  const cache = Object.assign(Object.create(null), EMBEDDED_LOCALES);
  let currentLang = DEFAULT_LANG;
  let initialReady = false;

  const log  = (...a) => { if (window.I18N_DEBUG) console.log('[i18n]', ...a); };
  const warn = (...a) => console.warn('[i18n]', ...a);
  log('boot — protocol:', window.location.protocol, '| IS_FILE_PROTOCOL:', IS_FILE_PROTOCOL);

  // =====================================================================
  // 2. HELPERS
  // =====================================================================

  function detectInitialLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.includes(stored)) return stored;
    } catch (_) { /* private mode */ }

    const htmlLang = document.documentElement.lang;
    if (htmlLang && SUPPORTED.includes(htmlLang.slice(0, 2))) return htmlLang.slice(0, 2);

    const navLangs = navigator.languages || [navigator.language || ''];
    for (const raw of navLangs) {
      const code = (raw || '').toLowerCase().slice(0, 2);
      if (SUPPORTED.includes(code)) return code;
    }
    return DEFAULT_LANG;
  }

  function resolve(dict, key) {
    if (!dict) return undefined;
    const parts = key.replace(/\[(\d+)\]/g, '.$1').split('.');
    let value = dict;
    for (const part of parts) {
      if (value == null) return undefined;
      value = value[part];
    }
    return value;
  }

  /**
   * Resilient locale loader. Strategy:
   *   - file://         → return embedded dict (no fetch attempt)
   *   - http(s)://      → try fetch (so locales/*.json edits are picked up
   *                       in development), if it fails fall back to embedded
   *   - if even embedded is missing → fall back to embedded English
   *
   * Returns a dictionary object — never throws.
   */
  async function loadLocale(lang) {
    const embedded = EMBEDDED_LOCALES[lang];

    if (IS_FILE_PROTOCOL) {
      log('file:// — using embedded', lang);
      return embedded || EMBEDDED_LOCALES[DEFAULT_LANG];
    }

    // http(s)://: try fetch, but the embedded copy is already cached so
    // the UI works even if fetch is in flight.
    try {
      const url = `${LOCALE_BASE}${lang}.json`;
      log('fetch', url);
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const dict = await res.json();
      cache[lang] = dict;
      return dict;
    } catch (err) {
      warn(`fetch failed for ${lang} (${err.message}) — falling back to embedded`);
      return embedded || EMBEDDED_LOCALES[DEFAULT_LANG];
    }
  }

  // =====================================================================
  // 3. DOM APPLY
  // =====================================================================

  function applyTranslations(dict) {
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = resolve(dict, el.dataset.i18n);
      if (typeof value === 'string') el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const value = resolve(dict, el.dataset.i18nHtml);
      if (typeof value === 'string') el.innerHTML = value;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s && s.trim());
        if (!attr || !key) return;
        const value = resolve(dict, key);
        if (typeof value === 'string') el.setAttribute(attr, value);
      });
    });

    const title = resolve(dict, 'meta.title');
    if (typeof title === 'string') document.title = title;
  }

  function applyDocumentLang(lang) {
    const dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    document.body.classList.remove('lang-en', 'lang-fr', 'lang-ar');
    document.body.classList.add(`lang-${lang}`);
  }

  // =====================================================================
  // 4. PUBLIC API
  // =====================================================================

  /**
   * switchLanguage(lang) — set active language.
   * Resilient: never throws. Falls back through:
   *   requested → embedded(requested) → embedded(default)
   */
  async function switchLanguage(lang) {
    if (!SUPPORTED.includes(lang)) {
      warn('unsupported lang', lang, '— falling back to', DEFAULT_LANG);
      lang = DEFAULT_LANG;
    }
    log('switchLanguage →', lang);

    const dict =
      (await loadLocale(lang)) ||
      EMBEDDED_LOCALES[lang] ||
      EMBEDDED_LOCALES[DEFAULT_LANG];

    currentLang = lang;
    applyDocumentLang(lang);
    applyTranslations(dict);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }

    document.dispatchEvent(new CustomEvent('languagechange', {
      detail: { lang, dir: RTL_LANGS.has(lang) ? 'rtl' : 'ltr' }
    }));
    log('applied', lang);
  }

  // Aliases for back-compat / spec
  const setLanguage = switchLanguage;
  const getLanguage = () => currentLang;
  const t = (key, fallback = '') => {
    const value = resolve(cache[currentLang], key);
    return typeof value === 'string' ? value : fallback;
  };

  // =====================================================================
  // 5. SWITCHER UI (idempotent render + delegated events)
  // =====================================================================

  function renderSwitcher(container) {
    if (!container || container.dataset.i18nReady === '1') return;
    container.dataset.i18nReady = '1';

    container.innerHTML = `
      <button type="button" class="lang-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Select language" data-lang-trigger>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M2 12h20"></path>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span class="lang-current" data-lang-current>${LABELS[currentLang]}</span>
        <svg class="lang-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <ul class="lang-menu" role="listbox">
        ${SUPPORTED.map(code => `
          <li role="option" data-lang="${code}" class="lang-option ${code === currentLang ? 'is-active' : ''}" aria-selected="${code === currentLang}">
            <span class="lang-code">${LABELS[code]}</span>
            <span class="lang-name">${NAMES[code]}</span>
          </li>
        `).join('')}
      </ul>
    `;
    log('rendered switcher into', container);
  }

  function syncAllSwitchers(lang) {
    document.querySelectorAll('[data-lang-switcher]').forEach(container => {
      const label = container.querySelector('[data-lang-current]');
      if (label) label.textContent = LABELS[lang] || LABELS[DEFAULT_LANG];
      container.querySelectorAll('.lang-option').forEach(opt => {
        const active = opt.dataset.lang === lang;
        opt.classList.toggle('is-active', active);
        opt.setAttribute('aria-selected', String(active));
      });
    });
  }

  function closeAllSwitchers() {
    document.querySelectorAll('[data-lang-switcher].open').forEach(c => {
      c.classList.remove('open');
      const trigger = c.querySelector('[data-lang-trigger]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * setupLanguageSwitcher() — render every [data-lang-switcher] slot and
   * attach a SINGLE delegated click/key listener on document. Safe to
   * call repeatedly (idempotent).
   */
  function setupLanguageSwitcher() {
    document.querySelectorAll('[data-lang-switcher]').forEach(renderSwitcher);

    if (setupLanguageSwitcher.__wired) return;
    setupLanguageSwitcher.__wired = true;

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-lang-trigger]');
      if (trigger) {
        const container = trigger.closest('[data-lang-switcher]');
        if (!container) return;
        const willOpen = !container.classList.contains('open');
        closeAllSwitchers();
        if (willOpen) {
          container.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
        log('trigger click → open =', willOpen);
        return;
      }

      const option = e.target.closest('[data-lang-switcher] [data-lang]');
      if (option) {
        const lang = option.dataset.lang;
        log('option click →', lang);
        closeAllSwitchers();
        if (lang !== currentLang) switchLanguage(lang);
        return;
      }

      if (!e.target.closest('[data-lang-switcher]')) closeAllSwitchers();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllSwitchers();
    });

    document.addEventListener('languagechange', e => syncAllSwitchers(e.detail.lang));

    log('switcher wired (delegated)');
  }

  // =====================================================================
  // 6. BOOTSTRAP
  // =====================================================================

  /**
   * Order is critical:
   *   1. Detect language and apply <html lang>/<dir> + body class IMMEDIATELY.
   *   2. Apply translations from the EMBEDDED cache synchronously
   *      → user sees the right language on first paint, no race window.
   *   3. Render the switchers — clicks register from this moment on.
   *   4. (http only) try fetch in the background to pick up any locale
   *      file edits; if it returns a newer/different dict, re-apply.
   */
  function init() {
    currentLang = detectInitialLang();
    log('detected initial', currentLang);

    applyDocumentLang(currentLang);
    applyTranslations(cache[currentLang] || EMBEDDED_LOCALES[DEFAULT_LANG]);
    setupLanguageSwitcher();
    syncAllSwitchers(currentLang);
    initialReady = true;

    // http(s):// only — refresh from disk in case the JSON files have
    // edits the embedded copy doesn't have yet. file:// stays purely
    // embedded.
    if (!IS_FILE_PROTOCOL) {
      loadLocale(currentLang).then(dict => {
        if (dict && dict !== EMBEDDED_LOCALES[currentLang]) applyTranslations(dict);
      }).catch(() => { /* embedded already applied — nothing to do */ });
    }
    log('ready');
  }

  // Public API
  window.i18n = {
    switchLanguage,
    setLanguage,        // alias
    getLanguage,
    setupLanguageSwitcher,
    t,
    supported: SUPPORTED,
    ready: () => initialReady,
    isFileProtocol: IS_FILE_PROTOCOL
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
