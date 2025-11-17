var app;

window.onload = function () {
  app = new Vue({
    el: "#weatherApp",
    data: {
      loaded: false,
      formCityName: "",
      message: "WebApp Loaded.",
      messageForm: "",
      cityList: [{ name: "Paris" }],
      cityWeather: null,
      cityWeatherLoading: false,
    },
    mounted: function () {
      this.loaded = true;
      this.readData();
    },
    methods: {
      readData: function () {
        console.log(
          "JSON.stringify(this.cityList):",
          JSON.stringify(this.cityList)
        );
        console.log("this.loaded:", this.loaded);
      },
      addCity: function (event) {
        event.preventDefault(); // empêche le rechargement de la page

        // Vérifie si la ville existe déjà
        if (this.isCityExist(this.formCityName)) {
          // Affiche un message d'erreur
          this.messageForm = "existe déjà";
        } else {
          // Ajoute la ville à cityList
          this.cityList.push({ name: this.formCityName });

          // Réinitialise le message et le champ de saisie
          this.messageForm = "";
          this.formCityName = "";
        }
      },
      isCityExist: function (_cityName) {
        // La méthode 'filter' retourne tous les items ayant un nom égal à _cityName (insensible à la casse)
        return (
          this.cityList.filter(
            (item) => item.name.toUpperCase() === _cityName.toUpperCase()
          ).length > 0
        );
      },
      remove: function (_city) {
        // on utilise 'filter' pour retourner une liste avec tous les items ayant un nom différent de _city.name
        this.cityList = this.cityList.filter(
          (item) => item.name !== _city.name
        );
      },
      meteo: function (_city) {
        this.cityWeatherLoading = true; // indicateur de chargement

        // Remplace 'VOTRE_APIKEY' par ta clé API OpenWeatherMap
        const apiKey = "02816333a1a73457e18eba7f12f2c35d";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${_city.name}&units=metric&lang=fr&apikey=${apiKey}`;

        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            this.cityWeatherLoading = false;

            if (json.cod == 200) {
              // réponse OK → on stocke les données dans cityWeather
              this.cityWeather = json;
              this.message = null;
            } else {
              // ville non trouvée
              this.cityWeather = null;
              this.message =
                "Météo introuvable pour " +
                _city.name +
                " (" +
                json.message +
                ")";
            }
          })
          .catch((error) => {
            this.cityWeatherLoading = false;
            this.cityWeather = null;
            this.message =
              "Erreur lors de la récupération de la météo : " + error;
          });
      },
    },
    computed: {
      cityWheaterDate: function () {
        if (!this.cityWeather) return "";
        let date = new Date(this.cityWeather.dt * 1000);
        let minutes =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return date.getHours() + ":" + minutes;
      },
      cityWheaterSunrise: function () {
        if (!this.cityWeather) return "";
        let date = new Date(this.cityWeather.sys.sunrise * 1000);
        let minutes =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return date.getHours() + ":" + minutes;
      },
      cityWheaterSunset: function () {
        if (!this.cityWeather) return "";
        let date = new Date(this.cityWeather.sys.sunset * 1000);
        let minutes =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return date.getHours() + ":" + minutes;
      },
      openStreetMapArea: function () {
        if (!this.cityWeather) return "";
        const zoom = 8;
        const delta = 0.05 / Math.pow(2, zoom - 10);
        const bboxEdges = {
          south: this.cityWeather.coord.lat - delta,
          north: this.cityWeather.coord.lat + delta,
          west: this.cityWeather.coord.lon - delta,
          east: this.cityWeather.coord.lon + delta,
        };
        return `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
      },
    },
  });
};
