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

async function cancelarEntrega(id) {
  const { error } = await supabase
    .from('entregas')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Erro ao cancelar entrega ${id}: ${error.message}`);
  return { success: true };
}

async function main() {
  try {
    console.log('--- CREATE ---');
    const nova = await criarEntrega({
      motorista_id: 1,
      veiculo_id: 2,
      destino: 'Av. Brasil, 1000 - Rio de Janeiro/RJ',
    });
    console.log('Entrega criada:', nova);

    console.log('\n--- READ (todas) ---');
    const todas = await listarEntregas();
    console.log('Total de entregas:', todas.length);

    console.log('\n--- READ (filtro: pendente) ---');
    const pendentes = await listarEntregas('pendente');
    console.log('Entregas pendentes:', pendentes);

    console.log('\n--- UPDATE ---');
    const atualizada = await atualizarStatus(nova.id, 'em rota');
    console.log('Entrega atualizada:', atualizada);

    console.log('\n--- DELETE ---');
    const resultado = await cancelarEntrega(nova.id);
    console.log('Entrega removida:', resultado);

  } catch (err) {
    console.error(err.message);
  }
}

main();