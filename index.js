const SUPABASE_URL = 'SUA_URL_SUPABASE_AQUI';
const SUPABASE_KEY = 'SUA_CHAVE_SUPABASE_AQUI';

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

async function atualizarStatus(id, novoStatus) {
  const { data, error } = await supabase
    .from('entregas')
    .update({ status: novoStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erro ao atualizar entrega ${id}: ${error.message}`);
  return data;
}