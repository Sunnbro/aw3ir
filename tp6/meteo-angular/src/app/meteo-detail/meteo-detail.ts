import { Component, OnInit, importProvidersFrom } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MeteoService } from "../services/meteo";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-meteo-detail",
  standalone: true,                      // composant autonome
  imports: [CommonModule, RouterModule], // pour *ngIf, *ngFor et routing
  templateUrl: "./meteo-detail.html",
  styleUrls: ["./meteo-detail.css"],
})
export class MeteoDetailComponent implements OnInit {
  meteo: any;
  latlon: string = "";

  constructor(
    private route: ActivatedRoute,
    private meteoService: MeteoService
  ) {}

  ngOnInit() {
    this.getMeteo();
  }

  getMeteo(): void {
    // Lecture du paramètre 'name' depuis l'URL
    const name = this.route.snapshot.paramMap.get("name");
    console.log("getmeteo pour", name);

    if (name) {
      this.meteoService
        .getMeteo(name)
        .then((response) => {
          this.meteo = response;
          this.latlon = `${this.meteo.coord.lat},${this.meteo.coord.lon}`;
        })
        .catch((fail) => (this.meteo = fail));
    }
  }
}
