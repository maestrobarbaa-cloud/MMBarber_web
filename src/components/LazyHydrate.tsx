"use client";

import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface LazyHydrateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

export function LazyHydrate({ children, fallback = null, rootMargin = "200px" }: LazyHydrateProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { ref, inView } = useInView({
    rootMargin,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      setIsHydrated(true);
    }
  }, [inView]);

  return (
    <div ref={ref}>
      {isHydrated ? children : fallback}
    </div>
  );
}
