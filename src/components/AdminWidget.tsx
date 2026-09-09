"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AdminWidget = () => {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check initial auth state
    const checkAuth = () => {
      setIsAdminAuth(sessionStorage.getItem("mmbarber_admin_auth") === "true");
    };
    
    checkAuth();

    // Listen for storage changes in case login/logout happens in another tab
    window.addEventListener("storage", checkAuth);
    
    // Custom event to trigger re-check on same page
    window.addEventListener("mmbarber_admin_auth_changed", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("mmbarber_admin_auth_changed", checkAuth);
    };
  }, [pathname]); // Re-check on navigation

  // Don't show if not authorized or if we are already in the admin section
  if (!isAdminAuth || pathname?.startsWith('/admin')) return null;

  return (
    <AnimatePresence>
      <Link href="/admin">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex fixed bottom-40 left-6 md:bottom-[13.5rem] md:left-10 z-40 p-3 md:p-4 rounded-full bg-black/80 border border-mafia-red/50 shadow-[0_0_20px_rgba(255,0,0,0.3)] text-mafia-red backdrop-blur-sm group overflow-visible items-center justify-center"
          title="Admin Centrála"
        >
          <div className="absolute inset-0 bg-mafia-red/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
          <ShieldCheck size={28} className="relative z-10 group-hover:text-white transition-colors group-hover:scale-110" />
        </motion.button>
      </Link>
    </AnimatePresence>
  );
};
