/**
 * Public MyBLOG Spring Boot API client (server-side).
 * Base URL: PUBLIC_MYBLOG_API_BASE (default http://127.0.0.1:8088)
 */

export type MyBlogArticleListItem = {
  id: number;
  categoryId: number | null;
  categoryName: string | null;
  title: string;
  summary: string | null;
  coverImage: string | null;
  tags: string[] | string | null;
  commentCount: number | null;
  isTop: boolean | number | null;
  authorNickname: string | null;
  createTime: string;
};

export type MyBlogArticleDetail = {
  id: number;
  categoryId: number | null;
  categoryName: string | null;
  title: string;
  mdContent: string;
  tags: string[] | string | null;
  commentCount: number | null;
  isTop: boolean | number | null;
  authorNickname: string | null;
  authorAvatar: string | null;
  authorBio: string | null;
  createTime: string;
};

export type MyBlogCategory = {
  id: number;
  name: string;
  [key: string]: unknown;
};

export type MyBlogPageResult<T> = {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
};

export type MyBlogApiEnvelope<T> = {
  success?: boolean;
  code?: number | string;
  message?: string;
  data: T;
};

export type ArticleListQuery = {
  currentPage?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
};

function resolveBaseUrl(): string {
  const fromEnv =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof import.meta.env.PUBLIC_MYBLOG_API_BASE === "string"
      ? import.meta.env.PUBLIC_MYBLOG_API_BASE.trim()
      : "";
  return (fromEnv || "http://127.0.0.1:8088").replace(/\/+$/, "");
}

async function parseEnvelope<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `MyBLOG API HTTP ${res.status} ${res.statusText}${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }
  const json = (await res.json()) as MyBlogApiEnvelope<T>;
  if (json && typeof json === "object" && "data" in json) {
    if (json.success === false) {
      throw new Error(json.message || `MyBLOG API failed (code=${json.code})`);
    }
    return json.data;
  }
  return json as unknown as T;
}

export function normalizeTags(tags: string[] | string | null | undefined): string[] {
  if (tags == null) return [];
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  const raw = String(tags).trim();
  if (!raw) return [];
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((t) => String(t).trim()).filter(Boolean);
      }
    } catch {
      /* fall through */
    }
  }
  return raw
    .split(/[,，;；|]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function fetchArticleList(
  query: ArticleListQuery = {},
): Promise<MyBlogPageResult<MyBlogArticleListItem>> {
  const base = resolveBaseUrl();
  const body = {
    currentPage: query.currentPage ?? 1,
    pageSize: query.pageSize ?? 20,
    ...(query.keyword ? { keyword: query.keyword } : {}),
    ...(query.categoryId != null ? { categoryId: query.categoryId } : {}),
  };
  const res = await fetch(`${base}/api/public/article/list`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  return parseEnvelope<MyBlogPageResult<MyBlogArticleListItem>>(res);
}

export async function fetchArticleById(id: number | string): Promise<MyBlogArticleDetail> {
  const base = resolveBaseUrl();
  const res = await fetch(`${base}/api/public/article/${encodeURIComponent(String(id))}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return parseEnvelope<MyBlogArticleDetail>(res);
}

export async function fetchCategoryList(): Promise<MyBlogCategory[]> {
  const base = resolveBaseUrl();
  const res = await fetch(`${base}/api/public/category/list`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const data = await parseEnvelope<MyBlogCategory[] | { records?: MyBlogCategory[] }>(res);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.records)) return data.records;
  return [];
}

export function getMyBlogApiBase(): string {
  return resolveBaseUrl();
}
