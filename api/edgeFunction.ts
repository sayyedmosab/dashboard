// Fetch logic for Supabase edge function
type EdgeFunctionResponse = any; // TODO: Replace with real type

export async function fetchEdgeFunction(year: number, quarter: string): Promise<EdgeFunctionResponse> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getDashboardData`;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ year, quarter }),
  });
  if (!res.ok) throw new Error('Edge function error: ' + res.statusText);
  return await res.json();
}
