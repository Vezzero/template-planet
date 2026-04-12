import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string; type?: string; sort?: string }>;
};

export default async function CercaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.sort) qs.set("sort", params.sort);
  const queryString = qs.toString();
  redirect(queryString ? `/?${queryString}` : "/");
}
