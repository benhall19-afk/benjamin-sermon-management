const BASE_URL = import.meta.env.VITE_CRAFT_API_URL;
const API_KEY = import.meta.env.VITE_CRAFT_API_KEY;

export async function craftFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Collection IDs
export const COLLECTIONS = {
  SCHEDULE: '3', // Bible Teaching Overview (destination)
  SERMONS: '5', // Sermons (source)
} as const;
