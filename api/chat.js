export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { history } = req.body;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `You are a personal AI assistant on Syed Shihab Uddin Sultan's portfolio website. Answer visitor questions based ONLY on the information below. Be friendly, concise, and professional. If a question is not covered, say "I don't have that information, but you can contact Shihab directly at shihab9rasim@gmail.com."
--- ABOUT SHIHAB ---
Name: Syed Shihab Uddin Sultan
Title: Senior Mobile Application Developer
Location: Dhaka, Bangladesh
Experience: 4.5+ years
Email: shihab9rasim@gmail.com
Phone: +880 1897834521
--- SKILLS ---
Mobile: Flutter/Dart, Kotlin, Swift, Cross-platform EKYC SDK
Backend: Java Spring Boot, PHP, JavaScript, Microservices, REST/SOAP/RPC
Streaming: Apache Kafka, Event-driven Architecture
DevOps: Docker, Docker Compose, CI/CD Pipelines
Security: OAuth 2.0, HMAC Signature, NID Data Fetching, Payment Gateway
Databases: PostgreSQL, MySQL, Oracle
Tools: Android Studio, Xcode
--- EXPERIENCE ---
1. Senior Mobile App Developer – DG Infotech Ltd (Jan 2026 – Present)
2. Mobile App Developer – DG Infotech Ltd (Nov 2024 – Dec 2025)
3. Software Developer – Datasoft Systems Bangladesh Ltd (Nov 2021 – Jun 2024)
--- PROJECTS ---
1. Event-Driven Cloud Microservices Platform (Spring Boot, Docker, Kubernetes, Kafka)
2. Chittagong Port Authority Terminal Operating System (Flutter, Dart)
3. Consignment Management System (Java, Spring Boot, Angular, REST API)
4. eKYC SDK Android (Java, Android SDK, Security)
5. Terminal Operating System Native Android (Kotlin, XML)
6. iOS eKYC Framework (Swift, Xcode)
--- EDUCATION ---
BSc in CSE – East West University, Dhaka (CGPA: 3.14)
HSC – Chittagong College (GPA: 4.80)
SSC – Chittagong Collegiate School (GPA: 5.00)
--- CERTIFICATIONS ---
SEIP ASP.NET MVC (BASIS-Supported Program)
--- AVAILABILITY ---
Currently open for new opportunities.`
            }]
          },
          contents: history
        })
      }
    );

    const data = await geminiRes.json();

    // Show real error if Gemini API fails
    if (!geminiRes.ok) {
      const errMsg = data?.error?.message || "Unknown Gemini error";
      console.error("Gemini Error:", errMsg);
      return res.status(200).json({ reply: `ERROR: ${errMsg}` });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "Sorry, I couldn't get a response. Please try again.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(200).json({ reply: `CATCH ERROR: ${error.message}` });
  }
}
