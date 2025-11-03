window.onload = function () {
  console.log("DOM ready!");

  // Sélection du formulaire
  const form = document.querySelector("form");

  // Validation email
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Ajout écouteur sur la soumission du formulaire
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nom = document.getElementById("nom");
    const prenom = document.getElementById("prenom");
    const adresse = document.getElementById("adresse");
    const email = document.getElementById("email");
    const birthday = document.getElementById("dateNaissance");

    let valid = true;
    let message = "";

    // Vérification des champs vides (prioritaire)
    if (
      nom.value.trim() === "" ||
      prenom.value.trim() === "" ||
      adresse.value.trim() === "" ||
      email.value.trim() === "" ||
      birthday.value.trim() === ""
    ) {
      valid = false;
      message = "Tous les champs sont obligatoires";

      if (nom.value.trim() === "") nom.classList.add("is-invalid");
      if (prenom.value.trim() === "") prenom.classList.add("is-invalid");
      if (adresse.value.trim() === "") adresse.classList.add("is-invalid");
      if (email.value.trim() === "") email.classList.add("is-invalid");
      if (birthday.value.trim() === "") birthday.classList.add("is-invalid");
    } else {
      nom.classList.remove("is-invalid");
      prenom.classList.remove("is-invalid");
      adresse.classList.remove("is-invalid");
      email.classList.remove("is-invalid");
      birthday.classList.remove("is-invalid");

      // Validation des longueurs minimum 5 caractères
      if (nom.value.trim().length < 5) {
        valid = false;
        message += "Nom : 5 caractères minimum\n";
        nom.classList.add("is-invalid");
      } else {
        nom.classList.remove("is-invalid");
      }

      if (prenom.value.trim().length < 5) {
        valid = false;
        message += "Prénom : 5 caractères minimum\n";
        prenom.classList.add("is-invalid");
      } else {
        prenom.classList.remove("is-invalid");
      }

      if (adresse.value.trim().length < 5) {
        valid = false;
        message += "Adresse : 5 caractères minimum\n";
        adresse.classList.add("is-invalid");
      } else {
        adresse.classList.remove("is-invalid");
      }

      // Validation email format
      if (!validateEmail(email.value)) {
        valid = false;
        message += "Adresse : format mail invalide\n";
        email.classList.add("is-invalid");
      } else {
        email.classList.remove("is-invalid");
      }

      // Validation date de naissance
      let birthdayDate = new Date(birthday.value);
      let birthdayTimestamp = birthdayDate.getTime();
      let nowTimestamp = Date.now();

      if (birthdayTimestamp > nowTimestamp) {
        valid = false;
        message += "Date de naissance invalide\n";
        birthday.classList.add("is-invalid");
      } else {
        birthday.classList.remove("is-invalid");
      }
    }

   if (!valid) {
  // Ton modal d'erreur reste comme avant...
    document.querySelector("#myModal .modal-body").innerText = message;
  var myModal = new bootstrap.Modal(document.getElementById("myModal"));
  myModal.show();

} else {
  const prenomValue = prenom.value.trim();
  const dateNaissanceValue = birthday.value;
  const adresseValue = adresse.value.trim();

  document.querySelector("#successModal .modal-title").innerText = `Bienvenue ${prenomValue}`;
  document.querySelector("#welcomeText").innerText = `Vous êtes né(e) le ${dateNaissanceValue} et vous habitez :`;

  // Met à jour le lien Google Maps
  const googleMapsLink = `https://maps.google.com/maps?q=${encodeURIComponent(adresseValue)}`;
  const mapLinkElement = document.getElementById("mapLink");
  mapLinkElement.href = googleMapsLink;
  mapLinkElement.innerText = adresseValue;

  // Affiche la modal
  var successModal = new bootstrap.Modal(document.getElementById("successModal"));
  successModal.show();

  // Géocode avec Nominatim pour récupérer latitude et longitude
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresseValue)}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        // Initialise la carte Leaflet dans le container #map
        const mapContainer = document.getElementById('map');
        if (mapContainer._leaflet_id) {
          // Si la carte existe déjà, la supprimer avant d'initialiser une nouvelle
          mapContainer._leaflet_id = null;
          mapContainer.innerHTML = "";
        }

        const map = L.map('map').setView([lat, lon], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker([lat, lon]).addTo(map);
      } else {
        // Pas de résultat
        document.getElementById('map').innerHTML = 'Adresse introuvable sur la carte.';
      }
    })
    .catch(() => {
      document.getElementById('map').innerHTML = 'Erreur lors du chargement de la carte.';
    });

  // Soumet le formulaire après fermeture de la modal
  document.getElementById("successModal").addEventListener('hidden.bs.modal', function () {
    form.submit();
  }, { once: true });
}


  });
};
