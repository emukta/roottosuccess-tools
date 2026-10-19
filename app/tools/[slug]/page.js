import { notFound } from "next/navigation";
import ToolShell from "@/components/ToolShell";
import ToolRenderer from "@/components/ToolRenderer";
import { TOOLS, getTool } from "@/lib/tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} (${tool.en})`,
    description: tool.desc,
    alternates: { canonical: `/tools/${tool.slug}/` },
    openGraph: { title: `${tool.name} — ফ্রি | Roottosuccess`, description: tool.desc },
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  return (
    <ToolShell tool={tool}>
      <ToolRenderer slug={slug} />
    </ToolShell>
  );
}
