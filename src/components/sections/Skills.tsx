import { useLanguage } from '@/contexts/LanguageContext';
import { getSkills } from '@/lib/api';
import { Skill } from '@/types';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';


const Skills = () => {
  const t = useTranslations();
  const { locale } = useLanguage();
  const [skillGroups, setSkills] = useState<Object>([]);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await getSkills();
        const grouped = data?.reduce<Record<string, Skill[]>>((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
        setSkills(grouped);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    }

    fetchSkills();
  }, [locale]);
  return (
    <section id="skills" className="py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('skills.title')}</h2>
          <p className="text-muted-foreground font-mono">{t('skills.subTitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skillGroups)?.map(([category, skills], idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-3xl p-8 hover:border-primary/50 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 rounded-2xl bg-muted ${skills[0].color}`}>
                   <div className={`${skills[0].color}`} dangerouslySetInnerHTML={{ __html: skills[0]?.iconSVG || '' }}/>
                </div>
                <h3 className="text-2xl font-semibold">{category}</h3>
              </div>

              <div className="space-y-6">
                {skills?.map((skill: Skill, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-mono">{skill.name}</span>
                      <span className="text-muted-foreground font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.1 }}
                        className={`h-full bg-gradient-to-r ${skill.gradient} to-chart-1/70 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;