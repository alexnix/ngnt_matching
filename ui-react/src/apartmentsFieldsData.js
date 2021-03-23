const keyToName = {
  usableArea: "Suprafata (mp)",
  district: "Sector",
  constructionYear: "An constructie",
  floor: "Etaj",
  rooms: "Numar Camere",
  balconies: "Numar balcoane",
  kitchens: "Numar bucatarii",
  bathrooms: "Numar bai",
  noPark: "Numar parcari",
  condition: "Nivel Finisaje",
  constructionYearRange: "Perioada constructie",
  typeOfBuilding: "Tip Cladire",
  structure: "Structura",
  floorType: "Tip eraj",
  partitioning: "Impartire",
};

const nameToKey = {
  "Suprafata (mp)": "usableArea",
  "Sector": "district",
  "An constructie": "constructionYear",
  Etaj: "floor",
  "Numar Camere": "rooms",
  "Numar balcoane": "balconies",
  "Numar bucatarii": "kitchens",
  "Numar bai": "bathrooms",
  "Numar parcari": "noPark",
  "Nivel Finisaje": "condition",
  "Perioada constructie": "constructionYearRange",
  "Tip Cladire": "typeOfBuilding",
  Structura: "structure",
  "Tip eraj": "floorType",
  Impartire: "partitioning",
};

export default [
  {
    type: "number",
    name: "Suprafata (mp)",
    value: "",
  },
  {
    type: "number",
    name: "Sector",
    value: "",
  },
  {
    type: "number",
    name: "An constructie",
    value: "",
  },
  {
    type: "number",
    name: "Numar Camere",
    value: "",
  },
  {
    type: "number",
    name: "Etaj",
    value: "",
  },
  {
    type: "number",
    name: "Numar balcoane",
    value: "",
  },
  {
    type: "number",
    name: "Numar bucatarii",
    value: "",
  },
  {
    type: "number",
    name: "Numar bai",
    value: "",
  },
  {
    type: "number",
    name: "Numar parcari",
    value: "",
  },
  {
    type: "select",
    name: "Nivel Finisaje",
    options: ["Inferior", "Standard", "Superior", "Lux"],
    value: "",
  },
  {
    type: "select",
    name: "Perioada constructie",
    options: ["dupa2000", "intre1960si1977", "intre1977si2000", "inainte1960"],
    value: "",
  },
  {
    type: "select",
    name: "Tip Cladire",
    options: ["bloc de apartamente", "casa/vila"],
    value: "",
  },
  {
    type: "select",
    name: "Structura",
    options: ["beton", "caramida", "altele", "bca", "lemn", "metal"],
    value: "",
  },
  {
    type: "select",
    name: "Tip eraj",
    options: ["parter", "intermediar", "ultimul etaj"],
    value: "",
  },
  {
    type: "select",
    name: "Impartire",
    options: [
      "decomandat",
      "semidecomandat",
      "vagon",
      "nedecomandat",
      "circular",
    ],
    value: "",
  },
];

export { keyToName, nameToKey };
