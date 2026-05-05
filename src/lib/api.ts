import { ContactInfo, Profile, Project, Skill, Stat } from "@/types";
import { fetchStrapi } from "./strapi";


export async function getProfile() {
  const response = await fetchStrapi<{ data: Profile }>(
    '/profile?populate=*'
  );
  return response.data;
}

export async function getContactInfo() {
  const response = await fetchStrapi<{ data: ContactInfo }>(
    '/contact-info?populate=*'
  );
  return response.data;
}

export async function getProject() {
  const response = await fetchStrapi<{ data: Project[] }>(
    '/projects?populate=*'
  );
  return response.data;
}

export async function getSkills() {
  const response = await fetchStrapi<{ data: Skill[] }>(
    '/skills?populate=*'
  );
  return response.data;
}


export async function getStat() {
  const response = await fetchStrapi<{ data: Stat[] }>(
    '/stats?populate=*'
  );
  return response.data;
}