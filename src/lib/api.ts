import { Category, ContactInfo, Profile, Project, Setting, Skill, Stat } from "@/types";
import { fetchStrapiClient, fetchStrapiServer } from "./strapi";


export async function getProfile() {
  const response = await fetchStrapiClient<{ data: Profile }>(
    '/profile?populate=*'
  );
  return response.data;
}

export async function getContactInfo() {
  const response = await fetchStrapiClient<{ data: ContactInfo }>(
    '/contact-info?populate=*'
  );
  return response.data;
}

export async function getProject() {
  const response = await fetchStrapiClient<{ data: Project[] }>(
    '/projects?populate=*&sort=order:asc'
  );
  return response.data;
}

export async function getSkills() {
  const response = await fetchStrapiClient<{ data: Skill[] }>(
    '/skills?populate=*&sort=order:asc'
  );
  return response.data;
}


export async function getStat() {
  const response = await fetchStrapiClient<{ data: Stat[] }>(
    '/stats?populate=*&sort=order:asc'
  );
  return response.data;
}

export async function getCategories() {
  const response = await fetchStrapiClient<{ data: Category[] }>(
    '/categories?populate=*&sort=order:asc'
  );
  return response.data;
}

export async function getPublicSettings() {
  const response = await fetchStrapiClient<{ data: Setting }>(
    '/setting?populate=*',
    { cache: 'no-store' }
  );
  return response.data;
}

export async function getPublicSettingsServer() {
  const response = await fetchStrapiServer<{ data: Setting }>(
    '/setting?populate=*',
    { cache: 'no-store' }
  );
  return response.data;
}
