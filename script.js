// SELETORES
const campoBusca = document.querySelector(".search-box input");
const botaoBusca = document.querySelector("#btnBuscar");
const botaoFiltros = document.querySelector("#btnFiltros");
const selectHumor = document.querySelector("#humor");
const selectRegiao = document.querySelector("#regiao");
const areaResultados = document.querySelector("#results");

let dados = [];

// Carregar JSON 1x
async function carregarDados() {
  if (dados.length > 0) return;

  try {
    const resposta = await fetch("dados.json");
    dados = await resposta.json();
  } catch (error) {
    console.error("Erro ao carregar JSON:", error);
  }
}

// BUSCA POR TEXTO – agora mostra TODOS os resultados relacionados
async function buscarPorTexto() {
  await carregarDados();

  const termo = campoBusca.value.toLowerCase().trim();
  if (!termo) {
    mostrarMensagem("Digite algo para buscar.");
    return;
  }

  const filtrados = dados.filter(item =>
    item.nome.toLowerCase().includes(termo) ||
    item.descricao.toLowerCase().includes(termo)
  );

  renderizarResultados(filtrados);
}

// Busca combinando filtros
async function buscarPorFiltros() {
  await carregarDados();

  const humor = selectHumor.value;
  const regiao = selectRegiao.value;

  if (!humor && !regiao) {
    mostrarMensagem("Selecione pelo menos um filtro.");
    return;
  }

  const filtrados = dados.filter(item => {
    const okHumor = humor ? item.categoria === humor : true;
    const okRegiao = regiao ? item.regiao === regiao : true;
    return okHumor && okRegiao;
  });

  renderizarResultados(filtrados);
}

// Exibir resultados
function renderizarResultados(lista) {
  if (lista.length === 0) {
    mostrarMensagem("Nenhum resultado encontrado.");
    return;
  }

  areaResultados.style.display = "block";
  areaResultados.innerHTML = "";

  lista.forEach(item => {
    areaResultados.innerHTML += `
      <div class="card-item">
        <h3>${item.nome}</h3>

        <p><strong>Categoria:</strong> ${item.categoria || "Não informado"}</p>
        <p><strong>Região:</strong> ${item.regiao || "Não informado"}</p>

        <p><strong>Descrição:</strong> ${item.descricao}</p>
        <p><strong>Endereço:</strong> ${item.endereco}</p>

        <a href="${item.link}" target="_blank">Visitar site</a>
      </div>
      <hr />
    `;
  });
}

//Limpar filtros e resultados
document.getElementById("btnLimpar").addEventListener("click", () => {
    // limpa selects
    document.getElementById("humor").value = "";
    document.getElementById("regiao").value = "";

    // limpa campo de busca
    const campoBusca = document.querySelector(".search-box input");
    campoBusca.value = "";

    // limpa os resultados
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    resultsDiv.style.display = "none";
});


// Mensagens padrão
function mostrarMensagem(msg) {
  areaResultados.style.display = "block";
  areaResultados.innerHTML = `<p>${msg}</p>`;
}

// Eventos
botaoBusca.addEventListener("click", buscarPorTexto);
botaoFiltros.addEventListener("click", buscarPorFiltros);
