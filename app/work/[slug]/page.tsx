import { notFound } from "next/navigation";
import { siteConfig } from "@/content/site";
import { CaseStudyView } from "@/components/case-study/CaseStudyView";
import type { Metadata } from "next";

export function generateStaticParams() {
  return siteConfig.projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = siteConfig.projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} · ${siteConfig.name}`,
    description: project.tagline,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = siteConfig.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Filter out all TODO (unsourced) metrics so they are never rendered or serialized into HTML
  const sanitizedProject = {
    ...project,
    metrics: project.metrics.filter((m) => !m.isTodo),
  };

  return <CaseStudyView project={sanitizedProject} />;
}

