import supabase from './supabaseClient.js';

// CREATE

export async function criarEntrega({ motorista_id, veiculo_id, destino }) {
  const { data, error } = await supabase
    .from('entregas')
    .insert({
      motorista_id,
      veiculo_id,
      destino,
      status: 'pendente'
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar:', error.message);
    return null;
  }

  return data;
}

// READ

export async function listarEntregas(status = null) {
  let query = supabase
    .from('entregas')
    .select('*')
    .order('id', { ascending: true });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao listar:', error.message);
    return [];
  }

  return data;
}

// UPDATE

export async function atualizarStatus(id, novoStatus) {
  const { data, error } = await supabase
    .from('entregas')
    .update({ status: novoStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar:', error.message);
    return null;
  }

  return data;
}

// DELETE

export async function cancelarEntrega(id) {
  const { error } = await supabase
    .from('entregas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar:', error.message);
    return false;
  }

  return true;
}

async function carregarEntregas() {
  const status = document.getElementById('filtro').value;
  const lista = document.getElementById('lista');

  const entregas = await listarEntregas(status);

  lista.innerHTML = '';

  entregas.forEach(e => {
    const li = document.createElement('li');

    li.innerHTML = `
      <strong>#${e.id}</strong> - ${e.destino} (${e.status})
      <br>
      <button onclick="window.atualizarEntrega(${e.id})">🚚 Em rota</button>
      <button onclick="window.deletarEntrega(${e.id})">❌</button>
    `;

    lista.appendChild(li);
  });
}

window.criarEntregaUI = async function () {
  const motorista_id = document.getElementById('motorista').value;
  const veiculo_id = document.getElementById('veiculo').value;
  const destino = document.getElementById('destino').value;

  await criarEntrega({ motorista_id, veiculo_id, destino });
  carregarEntregas();
};

window.atualizarEntrega = async function (id) {
  await atualizarStatus(id, 'em rota');
  carregarEntregas();
};

window.deletarEntrega = async function (id) {
  await cancelarEntrega(id);
  carregarEntregas();
};

window.carregarEntregas = carregarEntregas;

document.addEventListener('DOMContentLoaded', carregarEntregas);