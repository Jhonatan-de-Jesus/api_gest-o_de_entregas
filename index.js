const SUPABASE_URL = 'https://qkxdobhzmwfabalzzcpu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zVSvmGHwQar-3sZnskHWpQ_hsb7cjDY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function criarEntrega({ motorista_id, veiculo_id, destino, status = 'pendente' }) {
  const { data, error } = await supabase
    .from('entregas')
    .insert({
      motorista_id,
      veiculo_id,
      destino,
      status
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

async function listarEntregas(status = null) {
  let query = supabase
    .from('entregas')
    .select('*')
    .order('id', { ascending: true });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Erro ao listar entregas: ${error.message}`);
  return data;
}