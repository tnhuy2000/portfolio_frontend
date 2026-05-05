import { getContactInfo } from '@/lib/api';
import { ContactInfo } from '@/types';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

const contactMethods = [
  { icon: Mail, title: "Email", value: "tnhuy2000@gmail.com", href: "mailto:tnhuy2000@gmail.com", color: "text-chart-1" },
  { icon: Mail, title: "LinkedIn", value: "/truongnhuy0511", href: "https://www.linkedin.com/in/truongnhuy0511", color: "text-chart-2" },
  { icon: Mail, title: "GitHub", value: "@tnhuy2000", href: "https://github.com/tnhuy2000", color: "text-chart-3" },
];

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      }
    }

    fetchContactInfo();
  }, []);
  return (
    <section id="contact" className="py-24 px-6 bg-secondary/30 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{contactInfo?.title}</h2>
          <p className="text-muted-foreground font-mono mb-4">{contactInfo?.subtitle}</p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {contactInfo?.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.a
            href={contactInfo?.email}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="bg-card border border-border rounded-3xl p-8 text-center hover:border-primary/50 hover:shadow-xl transition-all group"
          >
            <div className={`inline-flex p-5 rounded-2xl bg-muted mb-6 group-hover:scale-110 transition-transform text-chart-1`}>
              <Mail className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Email</h4>
            {/* <p className="text-muted-foreground font-mono break-all">{contactInfo?.email}</p> */}
          </motion.a>

          <motion.a
            href={contactInfo?.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="bg-card border border-border rounded-3xl p-8 text-center hover:border-primary/50 hover:shadow-xl transition-all group"
          >
            <div className={`inline-flex p-5 rounded-2xl bg-muted mb-6 group-hover:scale-110 transition-transform text-chart-2`}>
              <Linkedin className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold mb-2">LinkedIn</h4>
            {/* <p className="text-muted-foreground font-mono break-all">{contactInfo?.linkedin}</p> */}
          </motion.a>
          <motion.a
            href={contactInfo?.github}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="bg-card border border-border rounded-3xl p-8 text-center hover:border-primary/50 hover:shadow-xl transition-all group"
          >
            <div className={`inline-flex p-5 rounded-2xl bg-muted mb-6 group-hover:scale-110 transition-transform text-chart-1`}>
              <Github className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Github</h4>
            {/* <p className="text-muted-foreground font-mono break-all">{contactInfo?.github}</p> */}
          </motion.a>
        </div>

        <div className="text-center">
          <motion.a
            href={`${contactInfo?.buttonUrl}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-chart-1 text-primary-foreground rounded-2xl shadow-lg hover:shadow-2xl transition-all font-mono text-lg group"
          >
            {contactInfo?.buttonText}
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        <div className="pt-16 border-t border-border text-center mt-16">
          <p className="text-muted-foreground font-mono mb-2">&lt;/portfolio&gt;</p>
          <p className="text-muted-foreground">© 2026 Nhu Y. Built with React &amp; Tailwind CSS</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;