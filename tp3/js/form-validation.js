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
  document.querySelector("#myModal .modal-body").innerText = message;
  var myModal = new bootstrap.Modal(document.getElementById("myModal"));
  myModal.show();
} else {
  // Préparer le contenu personnalisé de la modal succès
  const prenomValue = prenom.value.trim();
  const dateNaissanceValue = birthday.value;
  const adresseValue = adresse.value.trim();
  const adresseEncoded = encodeURIComponent(adresseValue);
  const mapLink = `https://maps.google.com/maps?q=${adresseEncoded}`;

  // Générer le contenu HTML
  document.querySelector("#successModal .modal-title").innerText = `Bienvenue ${prenomValue}`;
  document.querySelector("#successModal .modal-body").innerHTML = `
    <p>Vous êtes né(e) le ${dateNaissanceValue} et vous habitez</p>
    <a href="${mapLink}" target="_blank">
      <img src="maps.png" alt="Carte de votre adresse">
    </a>
    <br>
    <a href="${mapLink}" target="_blank">${adresseValue}</a>
  `;

  var successModal = new bootstrap.Modal(document.getElementById("successModal"));
  successModal.show();

  document.getElementById("successModal").addEventListener('hidden.bs.modal', function () {
    form.submit();
  }, { once: true });
}

  });
};
