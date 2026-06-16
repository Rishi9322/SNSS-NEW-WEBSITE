export const NAVY = "#0F2A4A";
export const AMBER = "#E8871A";

export const REGISTRATIONS = [
  { label: "CIN", value: "U74999MH2019PTC323363" },
  { label: "GST", value: "27ABBCS8372G1Z2" },
  { label: "PAN", value: "ABBCS8372G" },
  { label: "TAN", value: "MUMS99154G" },
  { label: "MSME Udyam", value: "UDYAM-MH-18-0067937" },
  { label: "Startup India (DIPP)", value: "DIPP115148" },
  { label: "Shop & Establishment", value: "820046054" },
  { label: "Labour Identification No.", value: "1-2500-4153-4" },
];

export const LABOUR_COMPLIANCE = [
  { label: "EPFO", value: "KDMAL1959239000" },
  { label: "ESIC", value: "35000446310001099" },
  { label: "Professional Tax", value: "27711691383P" },
  { label: "MLWF", value: "MUM89438" },
  { label: "Labour Licences", value: "Capacity: 150+ staff" },
];

export const GEM_CONTRACTS = [
  { institution: "EPFO — Regional Office Thane", ministry: "Ministry of Labour & Employment", staff: 20, value: "₹74.05L" },
  { institution: "Sports Authority of India", ministry: "Ministry of Youth Affairs & Sports", staff: 13, value: "₹52.02L" },
  { institution: "Mercantile Marine Dept Mumbai", ministry: "Ministry of Ports, Shipping & Waterways", staff: 9, value: "₹25.49L" },
  { institution: "Sports Authority of India — Goa", ministry: "Ministry of Youth Affairs & Sports", staff: 6, value: "₹22.04L" },
  { institution: "KVS AFS Thane", ministry: "Ministry of Education", staff: 7, value: "₹21.45L" },
  { institution: "KVS Regional Office Mumbai", ministry: "Ministry of Education", staff: 3, value: "₹9.76L" },
];

export const ISO_CERTS = [
  { standard: "ISO 9001:2015", name: "Quality Management System", scope: "Consistent, customer-focused service delivery." },
  { standard: "ISO 14001:2015", name: "Environmental Management System", scope: "Environmentally responsible facility operations." },
  { standard: "ISO 45001:2018", name: "Occupational Health & Safety", scope: "Safe working conditions for all deployed staff." },
  { standard: "ISO 27001:2013", name: "Information Security Management", scope: "Secure handling of client data and records." },
  { standard: "ISO 22000:2018", name: "Food Safety Management", scope: "Compliant pantry and cafeteria operations." },
  { standard: "ISO 21001:2018", name: "Educational Organisations Management", scope: "Service delivery in educational institutions." },
];

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  desc: string;
  industries: string;
  h1: string;
  subhead: string;
  whatIncluded: string[];
  benefits: string[];
  relatedSlugs: string[];
}

export const SERVICES: Service[] = [
  {
    id: "housekeeping",
    slug: "housekeeping",
    title: "Housekeeping & Janitorial",
    shortTitle: "Housekeeping",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    desc: "Trained, uniformed housekeeping staff for corporate offices, commercial spaces, and institutions. Daily cleaning, deep cleaning, and specialised sanitation.",
    industries: "Offices · Malls · Hospitals · Schools",
    h1: "Professional Housekeeping & Janitorial Services",
    subhead: "ISO-certified housekeeping. 700+ trained, EPFO/ESIC-compliant staff across Mumbai, Pune and 7+ states.",
    whatIncluded: [
      "Daily office and commercial space cleaning",
      "Deep cleaning and periodic sanitation",
      "Washroom hygiene and consumable management",
      "Glass, facade, and common area upkeep",
      "Supervisor-led teams with daily attendance reports",
      "Same-day replacement guarantee on absent staff",
    ],
    benefits: [
      "Zero absenteeism impact — replacement from bench on same day",
      "Uniformed, ID-carded staff deployed with appointment letters",
      "Full EPFO/ESIC compliance — zero liability for your HR team",
      "Single account manager for all escalations",
      "Monthly service reports and audit documentation",
    ],
    relatedSlugs: ["pantry", "technical"],
  },
  {
    id: "pantry",
    slug: "pantry",
    title: "Pantry Management",
    shortTitle: "Pantry",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    desc: "Courteous, well-groomed pantry attendants and cafeteria staff. Tea/coffee service, pantry upkeep, and cafeteria operations managed end-to-end.",
    industries: "Corporate Offices · Call Centres · Hospitals",
    h1: "Pantry Management & Cafeteria Staffing Services",
    subhead: "Professional pantry staff outsourcing for corporate offices across Mumbai, Pune, Ahmedabad and Bhopal.",
    whatIncluded: [
      "Tea, coffee, and beverage service management",
      "Pantry cleanliness and consumable stock management",
      "Cafeteria operations and serving staff",
      "Guest room and boardroom hospitality",
      "Inventory tracking and monthly reconciliation",
    ],
    benefits: [
      "Well-groomed, trained staff presenting your brand professionally",
      "ISO 22000:2018 (Food Safety) certified operations",
      "Staff trained in food hygiene and FSSAI compliance",
      "Flexible shift management for early/late office hours",
    ],
    relatedSlugs: ["housekeeping", "staffing"],
  },
  {
    id: "technical",
    slug: "technical",
    title: "Electrical, Plumbing & Technical",
    shortTitle: "Technical",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    desc: "Certified electricians and skilled plumbers for installation, preventive maintenance, and emergency repair of all facility systems.",
    industries: "Offices · Factories · Warehouses · Malls",
    h1: "Electrical, Plumbing & Technical Maintenance Services",
    subhead: "Certified technical staff for installation, preventive maintenance, and emergency repair across commercial facilities.",
    whatIncluded: [
      "Electrical installation, testing, and fault rectification",
      "Plumbing maintenance and emergency leak response",
      "Preventive maintenance scheduling and reporting",
      "AMC support for HVAC, DG sets, and UPS systems",
      "Energy audit support and compliance documentation",
    ],
    benefits: [
      "Certified, licensed technical staff — not contract day-labour",
      "Preventive maintenance reduces breakdown frequency by design",
      "Emergency response SLA — on-site within agreed timeframe",
      "Full documentation for statutory compliance and audits",
    ],
    relatedSlugs: ["housekeeping", "staffing"],
  },
  {
    id: "data-entry",
    slug: "data-entry",
    title: "Data Entry & Office Support",
    shortTitle: "Data Entry",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8h2M11 8h6M7 11h6M15 11h2" />
      </svg>
    ),
    desc: "Accurate data entry operators and back-office support staff. Documentation, record-keeping, and administrative support for corporate clients.",
    industries: "Finance · Healthcare · Government Bodies",
    h1: "Data Entry & Office Support Staffing",
    subhead: "Accurate, compliant data entry operators for corporate back-office, documentation, and records management.",
    whatIncluded: [
      "Data entry and digitisation of physical records",
      "Form processing and database management",
      "Document filing, scanning, and archival",
      "Excel, ERP, and custom software data operations",
      "Verification and quality-check workflows",
    ],
    benefits: [
      "Staff trained on accuracy protocols — QC built into the process",
      "ISO 27001:2013 (Information Security) certified operations",
      "NDA-compliant data handling for sensitive records",
      "Scalable team size — ramp up for backlogs, scale down after",
    ],
    relatedSlugs: ["payroll", "staffing"],
  },
  {
    id: "payroll",
    slug: "payroll",
    title: "Payroll Management & Compliance",
    shortTitle: "Payroll",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    desc: "End-to-end payroll processing with EPFO, ESIC, Professional Tax, and MLWF compliance. Salary credited by the 7th of every month. Zero liability for clients.",
    industries: "All Sectors · Contract Labour",
    h1: "Payroll Management & Labour Compliance Services",
    subhead: "Full-service payroll outsourcing with PF, ESIC, PT, and MLWF compliance. Salary by the 7th. Zero client liability.",
    whatIncluded: [
      "Monthly payroll processing and payslip generation",
      "PF contribution calculation and EPFO remittance",
      "ESIC registration, contribution, and claim support",
      "Professional Tax (PT) deduction and payment",
      "MLWF compliance and annual returns",
      "Form 16, annual returns, and ITR filing support",
    ],
    benefits: [
      "Salary credited by the 7th — no delays, no complaints from staff",
      "Zero compliance liability transferred to your organisation",
      "EPFO, ESIC, PT, MLWF handled — one less vendor to manage",
      "Audit-ready documentation always available on request",
      "Staff disputes absorbed entirely by SNSS",
    ],
    relatedSlugs: ["staffing", "data-entry"],
  },
  {
    id: "staffing",
    slug: "staffing",
    title: "Drivers, Security & Contract Labour",
    shortTitle: "Staffing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    desc: "Background-verified drivers for corporate fleets, security personnel, and flexible contract labour for operational scaling needs.",
    industries: "Corporate · Logistics · Manufacturing",
    h1: "Facility Staffing: Drivers, Security & Contract Labour",
    subhead: "Background-verified, licensed drivers and security staff for corporate clients across Mumbai, Pune, Ahmedabad and Bhopal.",
    whatIncluded: [
      "Corporate chauffeur and executive driver deployment",
      "Office and site security personnel",
      "Contract labour for warehouses, factories, and logistics",
      "Seasonal and event-based staffing at short notice",
      "Police verification and background checks handled by SNSS",
    ],
    benefits: [
      "Police-verified, licensed staff only — no exceptions",
      "Appointment letter and ID card before day one",
      "Flexible scale — deploy more for peak season, reduce after",
      "Full EPFO/ESIC compliance — zero liability for client",
    ],
    relatedSlugs: ["payroll", "housekeeping"],
  },
];

export const PROOF_POINTS = [
  { stat: "25+", label: "Years of unbroken operation", detail: "Founded 1999. Survived economic cycles, sector shifts, and a full corporate transformation." },
  { stat: "₹2.04 Cr+", label: "Active government GeM contracts", detail: "Multiple central government audit teams have cleared SNSS — harder to fake than any certification." },
  { stat: "700+", label: "Staff deployed across India", detail: "Appointment letter, ID card, uniform, EPFO, ESIC, and police verification — before reaching your site." },
  { stat: "1", label: "Point of contact for everything", detail: "No multi-vendor coordination. One account manager handles every request and escalation." },
  { stat: "6", label: "ISO certifications active", detail: "ISO 9001 · 14001 · 45001 · 27001 · 22000 · 21001. Covers quality, safety, environment, and food." },
  { stat: "Same day", label: "Replacement guarantee", detail: "If a staff member is absent, a replacement from our bench strength is deployed the same working day." },
];

export const CORP_VALUE_PROPS = [
  { problem: "Staff absent without notice — daily in large facilities", solution: "Replacement from bench strength — same day, no calls needed from your team" },
  { problem: "Multiple vendors, multiple invoices, multiple compliance risks", solution: "Single integrated partner — one invoice, one SLA, zero coordination overhead" },
  { problem: "Labour law compliance (PF, ESIC, PT) managed by client's HR", solution: "Fully handled by SNSS — PF, ESIC, PT, MLWF — client has zero liability" },
  { problem: "New site needs staff immediately for fit-out or expansion", solution: "Ready talent pool with verified, trained staff deployable at short notice" },
  { problem: "Payroll errors, late payments, unhappy contract staff", solution: "SNSS payroll team — salary credited by the 7th of every month, every month" },
  { problem: "Seasonal scaling for events, audits, new facilities", solution: "Flexible deployment — scale up or down without penalty or delay" },
];

export const TIMELINE = [
  { year: "1999", event: "SNSS founded in Mumbai — housekeeping and facility staffing for local corporates." },
  { year: "2000", event: "Expanded into pantry management and technical maintenance services." },
  { year: "2014", event: "Secured first institutional contracts — residential complexes and hospitals." },
  { year: "2015", event: "ISO certification programme initiated — quality management systems formalised." },
  { year: "2019", event: "Incorporated as SNSS Global Services Pvt. Ltd. Expanded to Pune and Ahmedabad." },
  { year: "2022", event: "GeM vendor empanelled — first central government contracts awarded. Bhopal operations launched." },
];

export const EMPLOYEE_BENEFITS = [
  "Appointment letter on deployment",
  "Photo ID card issued immediately",
  "Quality uniform provided",
  "Monthly payslips every month",
  "Salary to bank account by 7th of every month",
  "PF deposited with EPFO",
  "ESIC health insurance",
  "Professional Tax handled",
  "Form 16 annually",
  "ITR filing assistance",
  "Police verification handled by SNSS",
];

export const INDUSTRIES_SERVED = [
  "Corporate Offices", "Shopping Malls", "Hospitals & Clinics", "Schools & Colleges",
  "Trusts & NGOs", "Cinemas & Multiplexes", "Warehouses", "Factories & Plants",
  "Call Centres", "Residential Complexes", "Government Bodies", "Central Autonomous Bodies",
];

export const TESTIMONIALS = [
  {
    quote: "SNSS has managed our 800-seat office housekeeping for over three years. Their staff consistency and responsiveness to escalations is genuinely better than anything we experienced before. One call to our account manager and it's done.",
    author: "Rajesh Kulkarni",
    role: "Facility Manager",
    company: "Leading IT Services Firm, Pune",
  },
  {
    quote: "Switching to SNSS as our IFM vendor simplified everything — one vendor, one invoice, one accountability. Compliance documentation is always ready when our auditors ask for it. That peace of mind is worth more than any savings.",
    author: "Priya Sharma",
    role: "Head of Administration",
    company: "NBFC, Mumbai",
  },
  {
    quote: "We needed trained drivers on short notice for our executive fleet expansion. SNSS arranged verified, licensed drivers within 48 hours. Background checks, appointment letters, uniforms — all handled before day one.",
    author: "Anil Desai",
    role: "Corporate Services Manager",
    company: "Pharmaceutical Company, Ahmedabad",
  },
];

export const CLIENT_LOGOS = [
  { name: "Client A", letters: "CA" },
  { name: "Client B", letters: "CB" },
  { name: "Client C", letters: "CC" },
  { name: "Client D", letters: "CD" },
  { name: "Client E", letters: "CE" },
  { name: "Client F", letters: "CF" },
];
