import { usePortfolioData } from '@/contexts/PortfolioDataContext';
import { Skill } from '@/types';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';


const Skills = () => {
  const t = useTranslations();
  const { categories } = usePortfolioData();

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
          {categories?.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-3xl p-8 hover:border-primary/50 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 rounded-2xl bg-muted ${category?.color}`}>
                   <div className={`${category?.color}`} dangerouslySetInnerHTML={{ __html: category?.iconSVG || '' }}/>
                </div>
                <h3 className="text-2xl font-semibold">{category?.title}</h3>
              </div>

              <div className="space-y-6">
                {category?.skills?.map((skill: Skill, i: number) => (
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
                        className={`h-full bg-gradient-to-r ${category?.gradient} to-chart-1/70 rounded-full`}
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
