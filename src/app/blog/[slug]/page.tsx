import { SEOPageLayout } from "@/components/SEOPageLayout";
import { blogPosts } from "@/lib/blogData";
import { notFound } from "next/navigation";

// Generate static params for SSG
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <SEOPageLayout
      url={`/blog/${post.slug}`}
      title={post.title}
      subtitle={post.excerpt}
      keywords={post.keywords}
      content={
        <div className="blog-content">
          <div className="mb-12 text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em]">
            Publikováno: {new Date(post.date).toLocaleDateString("cs-CZ")}
          </div>
          {/* Inject HTML content. In production, we'd use a safe HTML parser or MDX */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose prose-invert prose-mafia-gold max-w-none" />
        </div>
      }
    />
  );
}
