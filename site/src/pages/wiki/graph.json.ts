// The wiki graph as data: /wiki/graph.json. Built at build time from the links
// between the articles; positions come from the seeded layout in src/lib/wiki.ts.
import type { APIRoute } from 'astro';
import { CLUSTERS, getWiki } from '../../lib/wiki';
import { url } from '../../lib/nav';

export const GET: APIRoute = async () => {
  const { graph, articles } = await getWiki();
  const body = {
    clusters: CLUSTERS.map(({ id, label, shape, tone }) => ({ id, label, shape, tone })),
    nodes: graph.nodes.map((n) => {
      const a = articles.find((x) => x.slug === n.slug)!;
      return {
        slug: n.slug,
        title: n.title,
        cluster: n.cluster,
        summary: n.summary,
        aliases: n.aliases,
        degree: n.degree,
        url: url(`wiki/${n.slug}/`),
        x: n.x,
        y: n.y,
        linksTo: a.out,
        linkedFrom: a.in,
      };
    }),
    edges: graph.edges.map(([a, b]) => [graph.nodes[a].slug, graph.nodes[b].slug]),
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
