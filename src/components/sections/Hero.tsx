'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Terminal, Mail, Github, Linkedin } from 'lucide-react';
import { getProfile } from '@/lib/api';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Link from "next/link";
import { useLazyApiData } from '@/hooks/useLazyApiData';

const MotionLink = motion.create(Link);
export default function Hero() {
  const { data: profile } = useLazyApiData(getProfile, { enabled: true });
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const count = useMotionValue(0);
  const roundedCount = useTransform(count, (latest) => Math.floor(latest));

  const currentRole = profile?.roles?.[currentRoleIndex] || "";
  useEffect(() => {
    if (!profile?.roles?.length) return;
    const roleLength = currentRole.length;

    const controls = animate(count, isDeleting ? 0 : roleLength, {
      duration: isDeleting ? 1.3 : 2.3,
      ease: "easeInOut",
      onComplete: () => {
        if (!isDeleting) {
          setTimeout(() => setIsDeleting(true), 1600);
        } else {
          setTimeout(() => {
            setCurrentRoleIndex((prev) => (prev + 1) % (profile?.roles?.length || 0));
            setIsDeleting(false);
            count.set(0);
          }, 600);
        }
      },
    });

    return () => controls.stop();
  }, [currentRoleIndex, isDeleting, count, profile]);

  const displayedText = useTransform(roundedCount, (latest) =>
    currentRole.slice(0, latest)
  );

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 relative pt-16 md:pt-20 mt-10">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-40">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--primary-rgb), 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--primary-rgb), 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl mb-12 mt-2"
        >
          <div className="bg-muted px-5 py-3.5 flex items-center gap-3 border-b border-border">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 text-center text-muted-foreground font-mono text-sm">
              portfolio.tsx
            </div>
          </div>

          <div className="p-8 md:p-10 font-mono text-[15px] md:text-base bg-card">
            <div className="flex items-start gap-4">
              <Terminal className="w-6 h-6 mt-1 text-chart-2 flex-shrink-0" />
              <div className="flex-1 space-y-3 text-foreground/90">
                <p>
                  <span className="text-blue-600 dark:text-blue-400">const</span>{" "}
                  <span className="text-orange-600 dark:text-orange-400">developer</span> = {'{'}
                </p>
                <p className="pl-6">
                  name: <span className="text-emerald-600 dark:text-emerald-400">"{profile?.name}"</span>,
                </p>
                <p className="pl-6">
                  role:{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    "<motion.span>{displayedText}</motion.span>"
                  </span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-[3px] h-5 bg-emerald-500 dark:bg-emerald-400 ml-1 align-middle"
                  />
                </p>
                <p className="pl-6">
                  location: <span className="text-emerald-600 dark:text-emerald-400">"{profile?.location}"</span>,
                </p>
                 <p className="pl-6">
                  skills: [
                    {profile?.skills?.map((skill, index) => (
                      <span key={index}>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          "{skill}"
                        </span>
                        {index !== (profile?.skills?.length - 1) && ", "}
                      </span>
                    ))}
                    ],
                </p>
                <p className="pl-6">
                  passion: <span className="text-emerald-600 dark:text-emerald-400">"{profile?.passion}"</span>
                </p>
                <p>{'}'}</p>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="text-center px-4">
          <div className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            {profile?.passionDescription ? (
              <BlocksRenderer content={profile.passionDescription} />
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <MotionLink
              href={profile?.buttonText1Url || '/'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-mono flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
            >
              {profile?.buttonText1} <span className="text-xl">→</span>
            </MotionLink>

            <MotionLink
              href={profile?.buttonText2Url || '/'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border border-border hover:bg-accent rounded-2xl font-mono flex items-center justify-center transition-all"
            >
              {profile?.buttonText2}
            </MotionLink>
          </div>

          <div className="flex gap-6 justify-center">
            {[
              { Icon: Mail, href: `mailto:${profile?.mail}` },
              { Icon: Github, href: `${profile?.gitHubUrl}` },
              { Icon: Linkedin, href: `${profile?.linkedInUrl}` },
            ].map(({ Icon, href }, i) => (
              <MotionLink
                key={i}
                href={href || '/'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.25, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-accent hover:rotate-15 hover:bg-accent/80 rounded-2xl transition-transform duration-200"
              >
                <Icon className="w-6 h-6" />
              </MotionLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
