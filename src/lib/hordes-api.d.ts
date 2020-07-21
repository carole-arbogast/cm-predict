export interface APIBase {
  [k: string]: any;
}

export interface HordesAPI {
  "/me": {
    params?: {
      fields?: Field<PlayerInfo>[];
    };
    response: PlayerInfo;
  };
  "/status": {
    response: Status;
  };

  "/user": {
    params: { uid: number; fields?: Field<PlayerInfo>[] };
    response: PlayerInfo;
  };

  "/map": {
    params: { mapId: number; fields?: Field<Map>[] };
    response: Map;
  };
}

export interface PlayerInfo {
  id: number;
  isGhost: boolean;
  name: string;
  twinId: number;
  mapId: number;
  map: Map;
  homeMessage: string;
  avatar: string;
  hero: boolean;
  dead: boolean;
  job: string;
  out: boolean;
  baseDef: number;
  ban: boolean;
  x: number;
  y: number;
  playedMaps: Cadaver[];
}

export interface Map {
  id: number; //ID de la map de jeu
  date: Date; //heure du serveur
  wid: number; //dimension de la carte
  hei: number; //dimension de la carte
  conspiracy: boolean; //S'il y a insurrection
  bonusPts: number; //points bonus
  days: number; //jour de la ville
  custom: boolean; //booléen qui indique si la ville est privée ou non
  zones: Array<Zone>; //liste des zones connues
  citizens: Array<PlayerInfo>; //liste des citoyens
  city: City; //informations de la ville
  cadavers: Array<Cadaver>; //liste des cadavres
  expeditions: Array<Expedition>; //liste des expeditions
  season: number; //ID de la saison de la création de la ville
  shaman?: number; //UID du joueur qui est chaman
  guide?: number; //UID du joueur qui est guide
}

export interface Expedition {
  name: string; //nom de l'expédition
  author: PlayerInfo; //l'auteur
  length: number; //longueur de l'expédition
  points: Array<{ x: number; y: number }>; //points définisant le parcours
}

export interface Cadaver {
  id: number; //ID du joueur
  twinId: number; //ID twinoid du joueur
  mapId: number; //ID de la map
  survival: number; //nombre de jours survécus
  day: number; //Jour de la map
  avatar: string;
  name: string; //nom joeuur,
  mapName: string; //nom de la map
  season: number; //numéro de la saison
  v1: boolean; //vrai si ce cadavre provient de la V1 du jeu

  score: number; //score
  season: number; //saison de jeu concernée
  dtype: number; //identifiant de type de mort
  msg: string; //message de mort
  comment: string; //commentaire
  cleanup: { user: string | null; type: "garbage" | "water" | "cook" | "ghoul" }; //information sur la destruction du cadavre (cook et ghoul sont expérimentaux)
}

export interface Zone {
  details: { z: number; h: number; dried: boolean }; //details sur le nombre de zombies, d'humains et sur l'assèchement de la zone
  items: Array<Resource>; //liste des items dans cette zone
  building: { type: number; name: string; dig: number; desc: string; camped: boolean }; //informations sur le bâtiment présent sur la zone
}

export interface Resource {
  id: number;
  name: string;
  count: number;
  broken: boolean;
  img: string;
  broken: boolean;
  cat: string;
  heavy: boolean;
  deco: number;
  guard?: number;
  desc?: string;
}

export interface Status {
  attack: boolean;
  maintenance: boolean;
}

type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export type Field<T> = keyof T | Partial<{ [K in keyof T]: Field<Unpacked<T[K]>>[] }>;
