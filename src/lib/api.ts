import { ContactInfo, Profile, Project, Skill, Stat } from "@/types";
import { fetchStrapiClient} from "./strapi";


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
    '/projects?populate=*'
  );
  return response.data;
}

export async function getSkills() {
  const response = await fetchStrapiClient<{ data: Skill[] }>(
    '/skills?populate=*'
  );
  return response.data;
}


export async function getStat() {
  const response = await fetchStrapiClient<{ data: Stat[] }>(
    '/stats?populate=*'
  );
  return response.data;
}