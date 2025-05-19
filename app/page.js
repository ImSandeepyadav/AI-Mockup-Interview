"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatingAnimation = {
    y: ["-5px", "5px"],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  // Not showing anything until client-side hydration
  if (!mounted) return null;

  return (
    <main className="min-h-screen overflow-hidden relative bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-pink-500 opacity-20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-500 opacity-20 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-40 right-40 w-72 h-72 rounded-full bg-indigo-500 opacity-20 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          className="container max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              className="inline-block"
              animate={floatingAnimation}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-2">
                AI Interview Mocker
              </h1>
            </motion.div>
            <motion.div
              className="h-1 w-32 mx-auto bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "8rem" }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>

          <motion.p variants={itemVariants} className="text-xl font-medium text-white mb-8 max-w-lg mx-auto">
            Master your interview skills with AI-powered mock interviews. Get real-time feedback and boost your confidence.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-12"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SignInButton>
              <Button className="text-lg px-10 py-6 rounded-full font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/30 transition-all duration-300">
                <span className="flex items-center">
                  Get Started
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </motion.svg>
                </span>
              </Button>
            </SignInButton>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          >
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-purple-900 to-indigo-800 p-6 rounded-xl border border-indigo-400 border-opacity-30 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40"
            >
              <div className="mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Interviews</h3>
              <p className="text-white">Practice with intelligent interviews that adapt to your responses and skill level</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-pink-800 to-rose-900 p-6 rounded-xl border border-pink-400 border-opacity-30 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/40"
            >
              <div className="mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Feedback</h3>
              <p className="text-white">Get instant analysis and actionable suggestions to improve your interview performance</p>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <p className="text-white text-sm font-medium">
              Join thousands of job seekers who have improved their interview success rate by 99%
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}