"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";
import { blogPosts } from "@/lib/blogData";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function BlogIndex() {
  return (
    <SEOPageLayout
      url="/blog"
      title="MM BARBER MAGAZÍN"
      subtitle="Zápisník z podsvětí. Trendy, návody a tipy pro dokonalý styl a péči."
      keywords={["barber blog", "účesy 2026", "péče o vousy", "skin fade"]}
      content={
        <div className="space-y-12">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
              <article className="p-8 border border-white/5 bg-mafia-dark/30 hover:bg-mafia-dark/50 hover:border-mafia-gold/30 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold font-heading text-smoke-white group-hover:text-mafia-gold transition-colors m-0">
                    {post.title}
                  </h2>
                  <ChevronRight className="text-mafia-gold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0" />
                </div>
                <p className="text-smoke-white/60 mb-6 m-0 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-mafia-gold/50">
                  <span>{new Date(post.date).toLocaleDateString("cs-CZ")}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-mafia-gold">Číst dál</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      }
    />
  );
}
