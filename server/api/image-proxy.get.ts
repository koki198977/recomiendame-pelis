import { defineEventHandler, getQuery, createError, setHeader } from "h3";

const ALLOWED_HOSTS = ["image.tmdb.org"];

export default defineEventHandler(async (event) => {
  const { url } = getQuery<{ url?: string }>(event);

  if (!url || typeof url !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing url parameter",
    });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid URL",
    });
  }

  if (!ALLOWED_HOSTS.includes(target.hostname)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Host not permitted",
    });
  }

  const response = await fetch(target.toString(), {
    headers: {
      Referer: "https://www.themoviedb.org/",
    },
  });

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `Upstream request failed: ${response.statusText}`,
    });
  }

  const buffer = await response.arrayBuffer();

  const contentType =
    response.headers.get("content-type") ?? "application/octet-stream";

  setHeader(event, "Content-Type", contentType);
  setHeader(event, "Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");

  return new Uint8Array(buffer);
});
