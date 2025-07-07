
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

const openRouterApiKey = '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';
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
    console.log('Received request:', { message, personality, sessionId, userId });

    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    // Get the personality prompt
    const personalityConfig = personalities[personality as keyof typeof personalities];
    if (!personalityConfig) {
      throw new Error('Invalid personality selected');
    }

    // Save user message to database
    console.log('Saving user message to database...');
    const { error: insertError } = await supabase.from('messages').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'user',
      content: message,
    });

    if (insertError) {
      console.error('Error saving user message:', insertError);
      throw insertError;
    }

    // Prepare the prompt with user input
    const fullPrompt = personalityConfig.prompt + message;
    console.log('Calling OpenRouter API with prompt:', fullPrompt);

    // Call OpenRouter API with chat completions format
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mantrik.lovable.app',
        'X-Title': 'Mantrik AI Mentor'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: personalityConfig.prompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    console.log('OpenRouter API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data, null, 2));

    // Extract the generated text from OpenAI-compatible response
    let aiResponse = '';
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      aiResponse = data.choices[0].message.content;
    } else {
      // Fallback response if API doesn't return expected format
      console.warn('Unexpected OpenRouter response format, using fallback');
      aiResponse = "I'm here to help! Could you please rephrase your message?";
    }

    console.log('AI Response:', aiResponse);

    // Save AI response to database
    const { error: aiInsertError } = await supabase.from('messages').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'assistant',
      content: aiResponse,
    });

    if (aiInsertError) {
      console.error('Error saving AI message:', aiInsertError);
      throw aiInsertError;
    }

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
