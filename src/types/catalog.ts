export type LipFinish =
  | "matte"
  | "velvet"
  | "gloss"
  | "satin"
  | "metallic"
  | "glitter"
  | "shimmer"
  | "sheer"
  | "stain";

export type LipAttribute =
  | "waterproof"
  | "longWear"
  | "transferProof"
  | "hydrating"
  | "vegan"
  | "crueltyFree";

export interface CatalogItem {
  id: string;
  brand: string;
  shadeName: string;
  descFa: string;
  hex: string;
  priceToman: number;
  rating: number;
  ratingCount: number;
  url: string;
  imageURL: string | null;
  finish: LipFinish | null;
  styleFa: string | null;
  longevityFa: string | null;
  code: string | null;
  attributes: LipAttribute[];
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface Facets {
  brands: FacetOption[];
  colors: FacetOption[];
  specs: FacetOption[];
  longevity: FacetOption[];
}
