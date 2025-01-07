import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const apiKey = Deno.env.get('TINYMCE_API_KEY')
  
  return new Response(
    JSON.stringify({ apiKey }),
    { headers: { "Content-Type": "application/json" } },
  )
})