'use client'

import { motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';
import { StrapiImage } from '../ui/StrapiImage';
import { Profile, Stat } from '@/types';
import { getProfile, getStat } from '@/lib/api';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from 'next-intl';

const About = memo(() => {
  const t = useTranslations();
  const { locale } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [statData, setStatData] = useState<Stat[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }


    async function fetchStat() {
      try {
        const data = await getStat();
        setStatData(data);
      } catch (error) {
        console.error("Failed to fetch stat:", error);
      }
    }
    fetchProfile();
    fetchStat();
  }, [locale]);
  return (
    <section id="about" className="py-24 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('profile.textAboutMe')}</h2>
          <p className="text-muted-foreground font-mono">{t('profile.subTitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Visual with Rotating Borders */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="aspect-square w-full bg-gradient-to-br from-chart-1/20 via-chart-2/20 to-chart-3/20 rounded-3xl flex items-center justify-center overflow-hidden border border-border relative group">

              {/* Rotating Border 1 - Xoay trái (ngoài cùng) */}
              <div
                className="absolute w-[280px] h-[280px] border-2 border-dashed border-primary/30 rounded-full animate-spin-slow"
                style={{ animationDirection: 'reverse' }}   // Xoay ngược chiều kim đồng hồ
              />

              {/* Rotating Border 2 - Xoay phải (trong cùng) */}
              <div
                className="absolute w-[300px] h-[300px] border-2 border-dashed border-chart-2/30 rounded-full animate-spin-slow"
                style={{ animationDuration: '28s' }}        // Tốc độ khác nhau để đẹp hơn
              />

              {/* Avatar chính */}
              <div className="w-64 h-64 bg-gradient-to-br from-primary to-chart-1 rounded-full relative z-10 flex items-center justify-center shadow-2xl">
                <span className="text-7xl drop-shadow-md"><StrapiImage className='w-64 h-64 rounded-full object-cover' image={profile?.avatar} /></span>
              </div>

              {/* Overlay hover effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-[17px] leading-relaxed text-foreground/90"
          >
            {profile?.longDescription ? (
              <BlocksRenderer content={profile.longDescription} />
            ) : null}
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statData?.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all group"
            >
              <div className={`inline-flex p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform ${stat.bgColor}`}>
                <div className={`${stat.color}`} dangerouslySetInnerHTML={{ __html: stat?.iconSVG || '' }}/>
              </div>
              <div className="font-mono text-3xl font-semibold mb-1">{stat.title}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';
export default About;