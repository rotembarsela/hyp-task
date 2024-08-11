export async function fetcher<T, K>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: K
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: T = await response.json();
  return data;
}
