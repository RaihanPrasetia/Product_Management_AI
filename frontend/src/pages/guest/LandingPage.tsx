// LandingPage.tsx

// Pastikan path import mengarah ke file .tsx (meskipun ekstensi bisa diabaikan)
import BenefitSection from '@/components/guest/home/BenefitSection';
import HeroSection from '@/components/guest/home/HeroSection';
import { Box } from '@mui/material';
import { motion, Variants } from 'framer-motion';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

export default function LandingPage() {
  return (
    <Box>
      <section id="home">
        <HeroSection />
      </section>

      <motion.section
        id="benefits"
        className="bg-slate-50 text-black py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <BenefitSection />
      </motion.section>
    </Box>
  );
}
