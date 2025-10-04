"use strict";

// Utility: generate a tiny 16x16 pixel-art SVG icon as a data URL from an 8x8 sprite matrix
function createPixelArtIcon(spriteRows, backgroundColor, foregroundColor) {
  const pixelSize = 2; // 8x8 sprite scaled to 16x16
  const width = 16;
  const height = 16;

  const rects = [];
  for (let y = 0; y < spriteRows.length; y++) {
    const row = spriteRows[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "1") {
        rects.push(
          `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${foregroundColor}" />`
        );
      }
    }
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">
  <rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}" />
  ${rects.join("\n  ")}
</svg>`;

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

// Define 8x8 sprites (strings of 0/1) for pixel-art icons
const sprites = {
  marathon: [
    "00110000",
    "01111000",
    "00110000",
    "00111000",
    "01101100",
    "01001100",
    "11001100",
    "10000110",
  ],
  bike: [
    "00000000",
    "00100100",
    "01011010",
    "01111110",
    "00100100",
    "00011000",
    "00100100",
    "01000010",
  ],
  hike: [
    "00110000",
    "00110000",
    "00110000",
    "01111000",
    "00110010",
    "00110110",
    "00111000",
    "00110000",
  ],
  martial: [
    "01000010",
    "01100110",
    "00111100",
    "00100100",
    "00100100",
    "00111100",
    "00100100",
    "00100100",
  ],
  triathlon: [
    "00000000",
    "00100100",
    "00000000",
    "00011000",
    "00000000",
    "00100100",
    "00000000",
    "00000000",
  ],
};

// Colors for categories
const colors = {
  marathon: { bg: "#e74c3c", fg: "#ffffff" },
  bike: { bg: "#3498db", fg: "#ffffff" },
  hike: { bg: "#2ecc71", fg: "#ffffff" },
  martial: { bg: "#9b59b6", fg: "#ffffff" },
  triathlon: { bg: "#e67e22", fg: "#ffffff" },
};

// Build Leaflet icons
const icons = {
  marathon: L.icon({
    iconUrl: createPixelArtIcon(sprites.marathon, colors.marathon.bg, colors.marathon.fg),
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -14],
    className: "pixel-icon",
  }),
  bike: L.icon({
    iconUrl: createPixelArtIcon(sprites.bike, colors.bike.bg, colors.bike.fg),
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -14],
    className: "pixel-icon",
  }),
  hike: L.icon({
    iconUrl: createPixelArtIcon(sprites.hike, colors.hike.bg, colors.hike.fg),
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -14],
    className: "pixel-icon",
  }),
  martial: L.icon({
    iconUrl: createPixelArtIcon(sprites.martial, colors.martial.bg, colors.martial.fg),
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -14],
    className: "pixel-icon",
  }),
  triathlon: L.icon({
    iconUrl: createPixelArtIcon(sprites.triathlon, colors.triathlon.bg, colors.triathlon.fg),
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -14],
    className: "pixel-icon",
  }),
};

// Initialize the map
const map = L.map("map", {
  zoomControl: true,
  scrollWheelZoom: true,
}).setView([46.8, 2.0], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(map);

// Layer groups
const layers = {
  Marathons: L.layerGroup(),
  "Bike tours": L.layerGroup(),
  "Hiking passages": L.layerGroup(),
  "Martial arts": L.layerGroup(),
  Triathlon: L.layerGroup(),
};

// Marathon pins (cities completed)
const marathonCities = [
  { name: "New York Marathon", coords: [40.7128, -74.006], country: "USA" },
  { name: "Chicago Marathon", coords: [41.8781, -87.6298], country: "USA" },
  { name: "Amsterdam Marathon", coords: [52.3676, 4.9041], country: "Netherlands" },
  { name: "Istanbul Marathon", coords: [41.0082, 28.9784], country: "Türkiye" },
  { name: "Paris Marathon", coords: [48.8566, 2.3522], country: "France" },
];

marathonCities.forEach((c) => {
  L.marker(c.coords, { icon: icons.marathon })
    .bindPopup(`<strong>${c.name}</strong><br/>${c.country}`)
    .addTo(layers.Marathons);
});

// Bike tours in Bretagne (example routes)
const bikeRoutes = [
  {
    name: "Bretagne coast tour",
    coords: [
      [48.649, -2.025], // Saint-Malo
      [48.39, -4.486], // Brest
      [47.996, -4.102], // Quimper
      [47.658, -2.76], // Vannes
      [47.218, -1.553], // Nantes (near Vertou)
    ],
  },
  {
    name: "Bretagne inland loop",
    coords: [
      [48.117, -1.677], // Rennes
      [48.0, -2.2], // Paimpont area
      [48.067, -2.967], // Pontivy
      [47.748, -3.366], // Lorient
      [47.653, -2.087], // Redon
      [47.154, -1.469], // Vertou
    ],
  },
];

bikeRoutes.forEach((r) => {
  L.polyline(r.coords, {
    color: colors.bike.bg,
    weight: 3,
    opacity: 0.9,
  })
    .bindPopup(`<strong>${r.name}</strong>`)
    .addTo(layers["Bike tours"]);
});

// Pyrenees hiking passage (approximate long traverse from Atlantic to Mediterranean)
const pyreneesTraverse = [
  [43.363, -1.778], // Hendaye (Atlantic)
  [43.163, -1.239], // Saint-Jean-Pied-de-Port
  [42.989, -0.53],
  [42.736, -0.013], // Gavarnie area
  [42.787, 0.593], // Bagnères-de-Luchon
  [42.65, 1.44], // Andorra region
  [42.431, 1.929], // Puigcerdà
  [42.62, 2.6],
  [42.48, 3.127], // Perpignan area
  [42.483, 3.129], // Banyuls-sur-Mer (Mediterranean)
];

L.polyline(pyreneesTraverse, {
  color: colors.hike.bg,
  weight: 3,
  opacity: 0.9,
  dashArray: "4,6",
})
  .bindPopup("<strong>Pyrenees hiking passage</strong><br/>Completed over 10 years")
  .addTo(layers["Hiking passages"]);

// Martial arts competitions around Vertou area (kendo, jujitsu)
const martialEvents = [
  { name: "Kendo competition - Vertou", coords: [47.154, -1.469] },
  { name: "Jujitsu tournament - Nantes", coords: [47.218, -1.553] },
  { name: "Kendo grading - Rezé", coords: [47.181, -1.55] },
];

martialEvents.forEach((e) => {
  L.marker(e.coords, { icon: icons.martial })
    .bindPopup(`<strong>${e.name}</strong>`)
    .addTo(layers["Martial arts"]);
});

// Triathlon layer (empty for now if none specified)
// Add markers later by pushing to this layer group with icons.triathlon

// Add overlays to map and fit bounds
const allGroups = [];
Object.values(layers).forEach((g) => {
  g.addTo(map);
  allGroups.push(g);
});

L.control.layers({}, layers, { collapsed: false }).addTo(map);

// Fit bounds to everything that exists
const featureGroup = L.featureGroup(allGroups.flatMap((g) => g.getLayers ? g.getLayers() : []));
if (featureGroup.getLayers().length > 0) {
  map.fitBounds(featureGroup.getBounds().pad(0.2));
}

// Legend control
const legend = L.control({ position: "bottomleft" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  const row = (html) => `<div class="row">${html}</div>`;
  const img = (dataUrl, alt) => `<img class="legend-swatch" src="${dataUrl}" alt="${alt}" />`;
  div.innerHTML = `
    <h3>Legend</h3>
    ${row(img(icons.marathon.options.iconUrl, "Marathon icon") + " Marathons (pins)")}
    ${row('<span class="line-swatch"></span> Bike tours (lines)')}
    ${row('<span class="line-swatch hike"></span> Hiking passages (dashed)')}
    ${row(img(icons.martial.options.iconUrl, "Martial arts icon") + " Martial arts comps")}
    ${row(img(icons.triathlon.options.iconUrl, "Triathlon icon") + " Triathlon")}
  `;
  return div;
};
legend.addTo(map);

