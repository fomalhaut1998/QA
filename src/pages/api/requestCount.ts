import type { APIRoute } from "astro";

const vercelToken = import.meta.env.VERCEL_TOKEN || "";
const vercelPrjId = import.meta.env.VERCEL_PROJECT_ID || "";

export const get: APIRoute = async () => {
  try {
    const now = new Date();
    const isoDate = now.toISOString();
    const res = await fetch(
      `https://api.vercel.com/v2/usage?type=requests&from=2023-02-16T16%3A00%3A00.000Z&to=${isoDate}&projectId=${vercelPrjId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: vercelToken,
        },
        method: "GET",
      }
    );
    if (res.status === 200) {
      const resJson = await res.json();
      const totalRequests = resJson.data.reduce((acc, curr) => {
        return acc + curr.request_miss_count + curr.request_hit_count;
      }, 0);
      return new Response(totalRequests);
    }
    return new Response("1000");
  } catch (error) {
    return new Response("1001");
  }
};