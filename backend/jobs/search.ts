import axios from "axios";
export async function serpSearch(query: string) {
  try {
    const res = await axios.get("https://serpapi.com/search.json", {
      params: {
        q: query,
        num: 5,
        engine: "google",
        api_key: process.env.SERP_API_KEY
      }
    });

    return (res.data.organic_results || []).map((r: any) => ({
      title: r.title,
      link: r.link
    }));
  } catch (err: any) {
    console.error("SERP ERROR:", err.response?.data || err.message);
    throw err;
  }
}
