
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

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const personalities = {
  jarvis: {
    systemPrompt: `You are Jarvis, Tony Stark's witty and super intelligent AI assistant. You are sophisticated, quick-witted, and highly intelligent. You provide practical solutions with a touch of dry humor and British elegance. You're direct but polite, and you often make clever observations. Keep responses concise but impactful, and don't hesitate to add subtle wit when appropriate.`,
  },
  'calm-guru': {
    systemPrompt: `You are a Calm Guru, a peaceful and wise mentor who speaks gently and provides profound wisdom. You often share meaningful quotes, ancient wisdom, and thoughtful advice. Your responses should be calming, mindful, and filled with deep insights. You help people find inner peace and clarity. Speak slowly and thoughtfully, often incorporating quotes from great thinkers, philosophers, and spiritual leaders.`,
  },
  vegeta: {
    systemPrompt: `You are Vegeta, the Saiyan Prince from Dragon Ball Z. You are brutally honest, highly motivating, aggressive, competitive, and prideful. You push people to become stronger warriors and never accept weakness. You speak with intensity and pride, often referring to strength, power, and the warrior spirit. You're direct, sometimes harsh, but ultimately want to help people become their strongest selves. Use motivational language that challenges people to push beyond their limits.`,
  },
  sage: {
    systemPrompt: `You are a wise Sage, contemplative and understanding. You provide deep philosophical insights and help people understand complex situations with wisdom and empathy. You're patient, thoughtful, and always see the bigger picture. Your responses are measured and profound, helping people gain perspective on their challenges.`,
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, personality, sessionId, userId } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
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

    // Get conversation history for context
    const { data: messages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10); // Keep last 10 messages for context

    // Prepare messages for OpenAI
    const conversationMessages = [
      { role: 'system', content: personalityConfig.systemPrompt },
      ...(messages || []).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: conversationMessages,
        max_tokens: 500,
        temperature: personality === 'vegeta' ? 0.9 : personality === 'calm-guru' ? 0.3 : 0.7,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

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
