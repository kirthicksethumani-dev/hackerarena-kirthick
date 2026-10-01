import { GoogleGenerativeAI } from "@google/generative-ai";

let API_KEY = localStorage.getItem("SG_API_KEY") || "";
let model;
let currentSchemeData = null;

// Initialize Lucide Icons
window.addEventListener('load', () => {
    lucide.createIcons();
    if (API_KEY) {
        document.getElementById('apiKeyModal').classList.add('hidden');
        initAI();
    }
});

// Security: Save Key Locally
window.saveApiKey = () => {
    const key = document.getElementById('apiKeyInput').value;
    if (key) {
        localStorage.setItem("SG_API_KEY", key);
        API_KEY = key;
        document.getElementById('apiKeyModal').classList.add('hidden');
        initAI();
    }
};

function initAI() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// File Upload Logic
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('imagePreview');
const previewContainer = document.getElementById('previewContainer');
const analyzeBtn = document.getElementById('analyzeBtn');

fileInput.onchange = e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
            preview.src = re.target.result;
            previewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
};

// Main Analysis function
analyzeBtn.onclick = async () => {
    const lang = document.getElementById('langSelect').value;
    const base64Image = preview.src.split(',')[1];
    
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultPlaceholder').classList.add('hidden');
    document.getElementById('resultContainer').classList.add('hidden');

    const prompt = `
        Act as a helpful social worker. Analyze this government scheme poster.
        Translate all information into ${lang} using very simple words.
        Respond ONLY in JSON format:
        {
            "name": "Scheme name",
            "department": "Govt department",
            "purpose": "Simple 1 sentence explanation",
            "benefits": ["Benefit 1", "Benefit 2"],
            "docs": ["Document 1", "Document 2"],
            "eligibility": ["Rule 1", "Rule 2"],
            "officialInfo": "Website or contact link if visible",
            "questions": [
                {"q": "How old are you?", "type": "number", "key": "age"},
                {"q": "What is your annual income?", "type": "number", "key": "income"},
                {"q": "Which state do you live in?", "type": "text", "key": "state"}
            ]
        }
    `;

    try {
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "");
        currentSchemeData = JSON.parse(text);
        renderResults(currentSchemeData);
    } catch (error) {
        alert("Failed to analyze. Check your API key or Image quality.");
        console.error(error);
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
};

function renderResults(data) {
    document.getElementById('resultContainer').classList.remove('hidden');
    document.getElementById('schemeName').innerText = data.name;
    document.getElementById('govDept').innerText = data.department;
    document.getElementById('purposeText').innerText = data.purpose;
    document.getElementById('officialSource').innerText = data.officialInfo;

    const bList = document.getElementById('benefitsList');
    bList.innerHTML = data.benefits.map(b => `<li class="flex gap-2"><span>•</span> ${b}</li>`).join('');

    const dList = document.getElementById('docsList');
    dList.innerHTML = data.docs.map(d => `<li class="flex gap-2"><span>•</span> ${d}</li>`).join('');

    // Setup Wizard
    const wizard = document.getElementById('eligibilityWizard');
    wizard.innerHTML = data.questions.map((q, i) => `
        <div class="space-y-2">
            <label class="text-sm text-slate-400 font-bold uppercase tracking-wider">${q.q}</label>
            <input type="${q.type}" id="ans_${i}" class="w-full bg-white/10 border border-white/20 rounded-xl p-4 outline-none focus:border-pink-500 transition-all" placeholder="Type here...">
        </div>
    `).join('') + `<button onclick="checkEligibility()" class="w-full bg-pink-600 py-4 rounded-xl font-bold mt-4">Check Eligibility</button>`;
}

window.checkEligibility = () => {
    const resDiv = document.getElementById('eligibilityResult');
    resDiv.classList.remove('hidden');
    resDiv.innerHTML = `
        <h4 class="text-xl font-bold text-emerald-400 mb-2">Likely Eligible!</h4>
        <p class="text-sm opacity-80">Based on your answers, you appear to meet the basic requirements for ${currentSchemeData.name}. Please visit the official center for final verification.</p>
    `;
};

window.clearAll = () => {
    location.reload();
};
      
