window.onload = function () {
  console.log("DOM ready!");

  const form = document.querySelector("form");
  const gpsBtn = document.getElementById("btnGPS");
  const resetBtn = document.getElementById("resetContacts");

  // Affiche la liste des contacts au chargement
  displayContactList();

  // -----------------------------
  // Bouton GPS
  // -----------------------------
  gpsBtn.addEventListener("click", function () {
    console.log("Bouton GPS cliqué");
    getLocation(); // Appelle la fonction définie dans gps.js
  });

  // -----------------------------
  // Bouton Reset
  // -----------------------------
  resetBtn?.addEventListener("click", function () {
    contactStore.reset(); // vide le localStorage
    displayContactList(); // rafraîchit le tableau
  });

  // -----------------------------
  // Validation email
  // -----------------------------
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // -----------------------------
  // Soumission du formulaire
  // -----------------------------
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nom = document.getElementById("nom");
    const prenom = document.getElementById("prenom");
    const adresse = document.getElementById("adresse");
    const email = document.getElementById("email");
    const birthday = document.getElementById("dateNaissance");

    let valid = true;
    let message = "";

    // Vérification des champs vides
    if (
      nom.value.trim() === "" ||
      prenom.value.trim() === "" ||
      adresse.value.trim() === "" ||
      email.value.trim() === "" ||
      birthday.value.trim() === ""
    ) {
      valid = false;
      message = "Tous les champs sont obligatoires\n";

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

      // Longueur minimum 5 caractères
      if (nom.value.trim().length < 5) {
        valid = false;
        message += "Nom : 5 caractères minimum\n";
        nom.classList.add("is-invalid");
      }
      if (prenom.value.trim().length < 5) {
        valid = false;
        message += "Prénom : 5 caractères minimum\n";
        prenom.classList.add("is-invalid");
      }
      if (adresse.value.trim().length < 5) {
        valid = false;
        message += "Adresse : 5 caractères minimum\n";
        adresse.classList.add("is-invalid");
      }

      // Email
      if (!validateEmail(email.value)) {
        valid = false;
        message += "Adresse mail invalide\n";
        email.classList.add("is-invalid");
      }

      // Date de naissance
      let birthdayDate = new Date(birthday.value);
      if (birthdayDate.getTime() > Date.now()) {
        valid = false;
        message += "Date de naissance invalide\n";
        birthday.classList.add("is-invalid");
      }
    }

    // -----------------------------
    // Affichage modal erreur
    // -----------------------------
    if (!valid) {
      document.querySelector("#myModal .modal-body").innerText = message;
      const myModal = new bootstrap.Modal(document.getElementById("myModal"));
      myModal.show();
    } else {
      // -----------------------------
      // FORMULAIRE VALIDE → ajout contact
      // -----------------------------
      const nomValue = nom.value.trim();
      const prenomValue = prenom.value.trim();
      const dateNaissanceValue = birthday.value;
      const adresseValue = adresse.value.trim();
      const emailValue = email.value.trim();

      // Ajouter dans le localStorage
      contactStore.add(
        nomValue,
        prenomValue,
        dateNaissanceValue,
        adresseValue,
        emailValue
      );

      // Mettre à jour le tableau
      displayContactList();

      // -----------------------------
      // Modal succès et carte
      // -----------------------------
      document.querySelector(
        "#successModal .modal-title"
      ).innerText = `Bienvenue ${prenomValue}`;
      document.querySelector(
        "#welcomeText"
      ).innerText = `Vous êtes né(e) le ${dateNaissanceValue} et vous habitez :`;

      const googleMapsLink = `https://maps.google.com/maps?q=${encodeURIComponent(
        adresseValue
      )}`;
      const mapLinkElement = document.getElementById("mapLink");
      mapLinkElement.href = googleMapsLink;
      mapLinkElement.innerText = adresseValue;

      const successModal = new bootstrap.Modal(
        document.getElementById("successModal")
      );
      successModal.show();

      // Géocode avec Nominatim
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          adresseValue
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          const mapContainer = document.getElementById("map");
          if (mapContainer._leaflet_id) {
            mapContainer._leaflet_id = null;
            mapContainer.innerHTML = "";
          }
          if (data && data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;

            const map = L.map("map").setView([lat, lon], 14);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);

            L.marker([lat, lon]).addTo(map);
          } else {
            mapContainer.innerHTML = "Adresse introuvable sur la carte.";
          }
        })
        .catch(() => {
          document.getElementById("map").innerHTML =
            "Erreur lors du chargement de la carte.";
        });

      // Soumettre le formulaire après fermeture de la modal
      document.getElementById("successModal").addEventListener(
        "hidden.bs.modal",
        function () {
          form.submit();
        },
        { once: true }
      );
    }
  });
};

function calcNbChar(id) {
  const input = document.querySelector(`#${id}`);

  const countElement = input.parentElement.parentElement // .col-sm-X // .row
    .querySelector("[data-count]");

  countElement.textContent = input.value.length + " car.";
}

function displayContactList() {
  const contactListString = localStorage.getItem("contactList");
  const contactList = contactListString ? JSON.parse(contactListString) : [];

  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = ""; // vide le tableau avant de remplir

  for (const contact of contactList) {
    tbody.innerHTML += `<tr>
      <td>${contact.name}</td>
      <td>${contact.firstname}</td>
      <td>${contact.date}</td>
      <td><a href="https://maps.google.com/maps?q=${encodeURIComponent(
        contact.adress
      )}" target="_blank">${contact.adress}</a></td>
      <td><a href="mailto:${contact.mail}">${contact.mail}</a></td>
    </tr>`;
  }
}
