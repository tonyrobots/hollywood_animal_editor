export interface TalentTag {
  overallValues: unknown[];
  id: string;
  dateAdded: string;
  movieId: number;
  value: string;
  IsOverall: boolean;
  [key: string]: unknown;
}

export interface TalentProfessions {
  [key: string]: string | undefined;
}

export interface TalentMovies {
  [role: string]: unknown;
}

export interface TalentData {
  $type?: string;
  id?: number;
  firstNameId?: string;
  lastNameId?: string;
  customName?: string | null;
  birthDate?: string;
  gender?: number;
  limit?: string;
  Limit?: string;
  profession?: string;
  professions?: TalentProfessions;
  whiteTagsNEW?: Record<string, TalentTag>;
  whiteTagsNew?: Record<string, TalentTag>;
  movies?: TalentMovies;
  studioId?: string | null;
  [key: string]: unknown;
}

export interface SaveRoot {
  characters?: TalentData[];
  [key: string]: unknown;
}
