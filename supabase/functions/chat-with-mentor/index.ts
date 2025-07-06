
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          role: string;
          content: string;
          created_at?: string;
        };
      };
    };
  };
}

const geminiApiKey = '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';
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const personalities = {
  jarvis: {
    prompt: "You are Jarvis — a superintelligent, witty AI assistant like Iron Man's helper. You respond clearly, efficiently, and with a touch of sarcasm. User says: ",
  },
  'calm-guru': {
    prompt: "You are Calm Guru — a wise, spiritual mentor who speaks slowly, peacefully, and deeply. You provide gentle advice with kindness and insight. Never rush. Use short, simple, calming sentences. User says: ",
  },
  vegeta: {
    prompt: "You are Vegeta from Dragon Ball Z. You are blunt, aggressive, and always push the user to be stronger. User says: ",
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, personality, sessionId, userId } = await req.json();

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    // Get the personality prompt
    const personalityConfig = personalities[personality as keyof typeof personalities];
    if (!personalityConfig) {
      throw new Error('Invalid personality selected');
    }

    // Save user message to database
    await supabase.from('messages').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'user',
      content: message,
    });

    // Prepare the prompt with user input
    const fullPrompt = personalityConfig.prompt + message;

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${geminiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    const data = await response.json();
    console.log('Gemini response:', data);

    // Extract the generated text
    let aiResponse = '';
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      aiResponse = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }

    // Save AI response to database
    await supabase.from('messages').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'assistant',
      content: aiResponse,
    });

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-mentor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
