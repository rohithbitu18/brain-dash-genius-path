
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, image } = await req.json()
    
    const GEMINI_API_KEY = "AIzaSyB4AH_Ls9hIMC9DzVXZrHJWjNzNkAEyI1Q"
    
    let requestBody: any = {
      contents: [{
        parts: []
      }]
    }

    // Add text prompt if provided
    if (prompt) {
      requestBody.contents[0].parts.push({ text: prompt })
    }

    // Add image if provided (base64 encoded)
    if (image) {
      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: image
        }
      })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from Gemini AI')
    }

    return new Response(
      JSON.stringify({
        response: data.candidates[0]?.content?.parts[0]?.text || 'No response generated',
        usage: data.usageMetadata
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
