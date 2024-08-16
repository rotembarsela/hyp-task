export async function fetcher<T, K = undefined>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: K | FormData
): Promise<T> {
  const options: RequestInit = {
    method,
    headers:
      body instanceof FormData ? {} : { "Content-Type": "application/json" },
    body: body instanceof FormData ? body : JSON.stringify(body),
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: T = await response.json();
  return data;
}
