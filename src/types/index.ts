// src/types/index.ts

import type { BlocksContent } from "@strapi/blocks-react-renderer";

// ====================Media ====================
type Media = {
  url: string;
  alternativeText?: string;
} 

// ====================Profile ====================
export interface Profile {
  name: string;
  roles: string[];
  location: string;
  skills: string[];
  experience: string;
  avatar?: {
    url: string;
    alternativeText?: string;
  };
  passionDescription?: BlocksContent;
  longDescription?: BlocksContent;
  buttonText1?: string;
  buttonText2?: string;
  buttonText1Url?: string;
  buttonText2Url?: string;
  mail: string;
  gitHubUrl?: string;
  linkedInUrl?: string;

}

// ==================== Stat (About Section) ====================
export interface Stat {
  title: string;
  label: string;
  iconSVG: string;
  color: string;
  bgColor: string;
  order: number;
}

// ==================== Project ====================
export interface Project {
  title: string;
  slug: string;
  description: string;
  longDescription?: BlocksContent;
  thumbnail: Object;
  galary?: {
    url: string;
    alternativeText?: string;
  };
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order: number;
}

// ==================== Contact Info ====================
export interface ContactInfo {
  title: string;
  subtitle: string;
  description: string;
  email: string;
  linkedin: string;
  github: string;
  buttonText: string;
  buttonUrl: string
}

// ==================== SKill ====================
export interface Skill {
  name: string;
  level: number;
  category: string;
}

// ==================== SKill ====================
export interface Category {
  title: string;
  iconSVG?: string;
  color: string;
  gradient: string;
  skills: Skill[];
}

export interface Setting {
  SEO_metaTitle: string;
  SEO_metaDescription: string;
  SEO_metaImage: Media;
  SEO_keywords: string;
  favicon: Media;
  logo: Media
  copyright: string
}


// ==================== Strapi Response Types ====================
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: any;
  };
}

export interface StrapiSingleResponse<T> {
  data: {
    attributes: T;
    id: number;
  };
}

export interface StrapiCollectionResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta: any;
}