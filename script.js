document.getElementById("imageInput").addEventListener("change", function(event) {
  
    const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.getElementById("imagePreview");
    img.src = e.target.result;
  };
  if (file) {
    reader.readAsDataURL(file);
  }
});

<script src="https://cdn.jsdelivr.net/npm/tesseract.js@2.1.5/dist/tesseract.min.js"></script>

function erkenneText() {
  const imageSrc = document.getElementById("imagePreview").src;
  
  if (!imageSrc) {
    alert("Bitte ein Bild aufnehmen!");
    return;
  }

  document.getElementById("erkannterText").value = "Texterkennung läuft...";

  Tesseract.recognize(
    imageSrc,
    'deu', // Deutsch (kann auch 'eng' für Englisch sein)
    { logger: m => console.log(m) } // Log-Meldungen
  ).then(({ data: { text } }) => {
    document.getElementById("erkannterText").value = text; // Zeigt den erkannten Text
  }).catch(err => {
    console.error(err);
    document.getElementById("erkannterText").value = "Fehler bei der Texterkennung.";
  });
}

function speichereRezept() {
  const rezeptText = document.getElementById("erkannterText").value.trim();
  const rezeptBild = document.getElementById("imagePreview").src;

  if (rezeptText === "" || rezeptBild === "") {
    alert("Kein Rezept zum Speichern.");
    return;
  }

  const rezepte = JSON.parse(localStorage.getItem("rezepte")) || [];
  rezepte.push({
    id: Date.now(),
    text: rezeptText,
    bild: rezeptBild
  });

  localStorage.setItem("rezepte", JSON.stringify(rezepte));
  alert("Rezept gespeichert!");
}

function ladeRezepte() {
  const rezepte = JSON.parse(localStorage.getItem("rezepte")) || [];
  const container = document.createElement("div");

  rezepte.forEach(rezept => {
    const box = document.createElement("div");
    box.style.border = "1px solid #ccc";
    box.style.margin = "1rem 0";
    box.style.padding = "0.5rem";
    box.innerHTML = `<img src="${rezept.bild}" style="max-width: 100%; height: auto;"/><br/>${rezept.text}`;
    container.appendChild(box);
  });

  document.body.appendChild(container);
}

document.addEventListener("DOMContentLoaded", ladeRezepte);

