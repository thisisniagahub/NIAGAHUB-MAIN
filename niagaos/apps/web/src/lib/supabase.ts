
import { createClient } from '@supabase/supabase-js';

// Get Environment Variables
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for Validity (Must start with http/https)
// If placeholder or missing, use Safe Fallback for Demo Mode
const isValidUrl = (url: string | undefined): boolean => {
    return !!url && (url.startsWith('http://') || url.startsWith('https://'));
};

const finalUrl = isValidUrl(envUrl) ? envUrl : 'https://demo-placeholder.supabase.co';
const finalKey = envKey || 'demo-placeholder-key';

if (!isValidUrl(envUrl)) {
    console.warn('⚠️ [Supabase] Invalid or Missing URL. Using Demo Fallback.');
    console.warn('   Expected: https://... | Found:', envUrl);
}

// Initialize Client (Safe)
export const supabase = createClient(finalUrl, finalKey);
