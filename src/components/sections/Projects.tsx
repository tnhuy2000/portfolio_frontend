
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { getProjectColor } from '@/utils';
import { useEffect, useState } from 'react';
import { getProject } from '@/lib/api';
import { Project } from '@/types';
import { StrapiImage } from '../ui/StrapiImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Projects = () => {
  const t = useTranslations();
  const { locale } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProject();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      }
    }

    fetchProject();
  }, [locale]);

  return (
    <section id="projects" className="py-24 px-6 bg-secondary/30 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('projects.title')}</h2>
          <p className="text-muted-foreground font-mono">{t('projects.subTitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project, index) => {
            const colorClass = getProjectColor(index);
            const githubLink = project.githubUrl
            const demoLink = project.demoUrl
            return (
              <motion.div
                key={project?.order || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group bg-card border border-border rounded-3xl p-6 hover:shadow-2xl hover:border-primary/50 transition-all relative overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-20 transition-opacity`} />

                {/* Giữ nguyên phần giao diện như cũ, chỉ thay dữ liệu */}
                <div className="relative z-10">
                  <div className="relative h-32 mb-6 rounded-2xl bg-muted flex items-center justify-center">
                    <div className="absolute z-10 w-16 h-16 border-4 border-dashed border-primary/50 rounded-xl group-hover:rotate-45 transition-transform duration-500" />
                    <StrapiImage className='absolute z-0 w-full h-full rounded-2xl object-cover' image={project?.thumbnail} />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {project?.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">{project?.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project?.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-mono group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 text-sm">
                    {githubLink && (
                      <Link href={githubLink} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <Github className="w-4 h-4" /> {t('projects.textCode')}
                      </Link>
                    )}
                    {demoLink && (
                      <Link href={demoLink} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="w-4 h-4" /> {t('projects.textDemo')}
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;