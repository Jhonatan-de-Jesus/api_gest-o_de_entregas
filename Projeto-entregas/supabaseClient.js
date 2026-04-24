const SUPABASE_URL = 'SUA_URL_SUPABASE_AQUI';
const SUPABASE_KEY = 'SUA_CHAVE_SUPABASE_AQUI';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;