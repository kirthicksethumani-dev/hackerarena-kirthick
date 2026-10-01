const fileInput =
  document.getElementById("fileInput");

const uploadMessage =
  document.getElementById("uploadMessage");

const previewContainer =
  document.getElementById("previewContainer");

const preview =
  document.getElementById("preview");

const fileName =
  document.getElementById("fileName");

const analyzeBtn =
  document.getElementById("analyzeBtn");

const sampleBtn =
  document.getElementById("sampleBtn");

const result =
  document.getElementById("result");

const statusText =
  document.getElementById("statusText");

const language =
  document.getElementById("language");

let selectedFile = null;


/* FILE UPLOAD */

fileInput.addEventListener(
  "change",
  function () {

    const file = this.files[0];

    if (!file) return;

    selectedFile = file;

    showPreview(file);
  }
);


/* SHOW PREVIEW */

function showPreview(file) {

  uploadMessage.classList.add("hidden");

  previewContainer.classList.remove("hidden");

  fileName.textContent = file.name;

  if (file.type.startsWith("image/")) {

    preview.src =
      URL.createObjectURL(file);

    preview.style.display =
      "block";

  } else {

    preview.style.display =
      "none";
  }

  statusText.textContent =
    "Poster ready to analyze";
}


/* SAMPLE */

sampleBtn.addEventListener(
  "click",
  function () {

    selectedFile = {
      name: "Sample Government Scheme Poster"
    };

    uploadMessage.classList.add(
      "hidden"
    );

    previewContainer.classList.remove(
      "hidden"
    );

    preview.style.display = "none";

    fileName.textContent =
      "Sample Government Scheme Poster";

    statusText.textContent =
      "Sample poster ready";
  }
);


/* ANALYZE */

analyzeBtn.addEventListener(
  "click",
  function () {

    if (!selectedFile) {

      alert(
        "Please upload a scheme poster first."
      );

      return;
    }

    statusText.textContent =
      "AI analysis complete";

    showResult();
  }
);


/* RESULT */

function showResult() {

  const lang =
    language.value;

  let data;


  if (lang === "ta") {

    data = {

      title:
        "பெண்கள் திறன் மேம்பாட்டு திட்டம்",

      explanation:
        "இந்த திட்டம் பெண்களுக்கு திறன் பயிற்சி மற்றும் வேலை அல்லது சுயதொழில் வாய்ப்புகளை பெற உதவுகிறது.",

      benefits: [
        "திறன் பயிற்சி",
        "வேலை வாய்ப்பு வழிகாட்டுதல்",
        "தகுதி இருந்தால் நிதி உதவி"
      ],

      eligible:
        "தகுதி இருக்க வாய்ப்பு உள்ளது",

      next:
        "அடையாளம் மற்றும் தேவையான சான்றிதழ்களை தயார் செய்து அதிகாரப்பூர்வ அரசு வழியில் விண்ணப்பிக்கவும்."
    };

  } else if (lang === "hi") {

    data = {

      title:
        "महिला कौशल सहायता योजना",

      explanation:
        "यह योजना महिलाओं को कौशल प्रशिक्षण और रोजगार या स्वरोजगार के अवसरों में सहायता करती है.",

      benefits: [
        "कौशल प्रशिक्षण",
        "रोजगार मार्गदर्शन",
        "पात्र होने पर वित्तीय सहायता"
      ],

      eligible:
        "पात्र होने की संभावना",

      next:
        "आवश्यक पहचान और प्रमाण पत्र तैयार करके आधिकारिक सरकारी माध्यम से आवेदन करें."
    };

  } else {

    data = {

      title:
        "Women Skill Support Scheme",

      explanation:
        "This scheme supports women through skill training and helps them access employment or self-employment opportunities.",

      benefits: [
        "Skill training support",
        "Employment guidance",
        "Financial support if eligible"
      ],

      eligible:
        "Likely Eligible",

      next:
        "Prepare your identity and required certificates, then apply through the official government channel."
    };
  }


  result.innerHTML = `

    <div class="result-content">

      <h2>
        ${data.title}
      </h2>

      <p>
        AI extracted information
        from the uploaded poster.
      </p>


      <div class="badges">

        <span class="badge">
          AI VISION
        </span>

        <span class="badge">
          MULTILINGUAL
        </span>

        <span class="badge">
          ELIGIBILITY
        </span>

      </div>


      <div class="result-section">

        <h4>
          Simple Explanation
        </h4>

        <p>
          ${data.explanation}
        </p>

      </div>


      <div class="result-section">

        <h4>
          Key Advantages
        </h4>

        <div class="benefits">

          ${data.benefits.map(
            benefit => `
              <div class="benefit">
                ✓ ${benefit}
              </div>
            `
          ).join("")}

        </div>

      </div>


      <div class="result-section">

        <h4>
          Eligibility Check
        </h4>

        <div class="eligibility">

          <div class="eligible">
            🟢 ${data.eligible}
          </div>

          <div class="check-row">
            <span>Age requirement</span>
            <b class="match">✓ Match</b>
          </div>

          <div class="check-row">
            <span>State requirement</span>
            <b class="match">✓ Match</b>
          </div>

          <div class="check-row">
            <span>Income requirement</span>
            <b class="match">✓ Match</b>
          </div>

          <div class="check-row">
            <span>Document verification</span>
            <b class="verify">! Verify</b>
          </div>

        </div>

      </div>


      <div class="result-section">

        <h4>
          What To Do Next
        </h4>

        <p>
          ${data.next}
        </p>

      </div>

    </div>

  `;
}
