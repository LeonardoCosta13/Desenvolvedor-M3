
const serverurl = process.env.SERVER_API;

console.log("Dev m3", serverurl);

let filtroCor = "";
let filtroTamanho = "G";
let filtroPreco = "p1";
const precos = {
  'p1': [0, 50],
  'p2': [51, 150],
  'p3': [151, 300],
  'p4': [301, 500],
  'p5': [501, true],
}

let listaProdutos = [];
let listaProdutosFiltrados = [];


// filtrar({cor: 'Preto', tamanho: 'G', preco: 'p1'})
function filtrar(params) {
  filtroCor = params.hasOwnProperty('cor') && params?.cor != filtroCor ? params?.cor : filtroCor;
  filtroTamanho = params.hasOwnProperty('tamanho') && params?.tamanho != filtroTamanho ? params?.tamanho : filtroTamanho;
  filtroPreco = params.hasOwnProperty('preco') && params?.preco != filtroPreco ? params?.preco : filtroPreco;

  const produtosFiltrados = listaProdutos.filter(produtoCores => {
    if (filtroCor == produtoCores.color || filtroCor == '' || filtroCor == null) {
      return true
    } else return false
  }).filter(produtoTamanhos => {
    if ((produtoTamanhos.size).includes(filtroTamanho) || filtroTamanho == '' || filtroTamanho == null) {
      return true
    } else return false
  }).filter(produtoPrecos => {
    if (!filtroPreco) {
      return true
    }
    if ((produtoPrecos.price >= precos[filtroPreco][0] && produtoPrecos.price <= precos[filtroPreco][1]) || filtroPreco == '' || filtroPreco == null) {
      return true
    } else return false
  })

  return produtosFiltrados;
}


function aplicarFiltro(tipo, valor) {

}





const verMais = document.getElementById("ver-mais");
verMais.addEventListener("mouseup", mostrarMais);

function mostrarMais() {
  const g = document.querySelectorAll(".cor-filtro");

  g.forEach((cor) => {
    cor.style.display = "block";
  });

  verMais.style.display = "none";
}

fetch(`${serverurl}/products`)
  .then((res) => res.json())
  .then((result) => {
    let produtos = []

    for (let produto of result) {
      console.log('Produto-> ', produto)
      if (produtos.some(p => p.id == produto.id)) {
        continue
      }
      produtos.push(produto)
      console.log('produtos: ', produtos)

    }

    montarListaProdutos(produtos)

  })
  .catch(console.log);

function montarListaProdutos(arrProdutos) {
  const divProdutos = document.getElementById("produtos");
  divProdutos.innerHTML = ""

  for (let produto of arrProdutos) {
    listaProdutos.push(produto);

    const valor = elementFromHtml(`
        <div class="item" id="${produto.id}">
          <img class="img-item" src="${produto.image}" alt="camisa mesclada" class="img-item">
          <h2 class="nome-item">${produto.name}</h2>
          <b class="valor-avista">R$ ${produto.price.toFixed(2)}</b>
          <p class="valor-parcelado">até ${produto.parcelamento[0]
      }x de R$${produto.parcelamento[1].toFixed(2)}</p>
          <button class="button-item">COMPRAR</button>
        </div>
      `);

    divProdutos.appendChild(valor);
  }
}

function elementFromHtml(html) {
  const template = document.createElement("template");

  template.innerHTML = html.trim();

  return template.content.firstElementChild;
}

const btnFiltrar = document.getElementById('btn-filtar')
const containerFiltros = document.querySelector('.container-filtros')

btnFiltrar.addEventListener('mouseup', () => {

  containerFiltros.style.display = 'block'
  containerFiltros.style.position = 'absolute'
  containerFiltros.style.top = '0'
  containerFiltros.style.left = '0'
  containerFiltros.style.zIndex = '20'
  containerFiltros.style.width = '100%'

})

const btnOrdenar = document.getElementById('btn-ordenar')
const containerOrdenar = document.querySelector('.ordenar-select')

btnOrdenar.addEventListener('mouseup', () => {

  containerOrdenar.style.display = 'block'
  containerOrdenar.style.position = 'absolute'
  containerOrdenar.style.top = '0'
  containerOrdenar.style.left = '0'
  containerOrdenar.style.zIndex = '3'
  containerOrdenar.style.width = '100%'
})


// fechar modal
const btnFechar = document.querySelectorAll('.fechar')
btnFechar.forEach(botao => {
  botao.addEventListener('mouseup', fecharModal)
})

function fecharModal() {
  containerFiltros.classList.remove("modal");
  containerOrdenar.classList.remove("modal");

}


function reportWindowSize() {
  // console.log(window.innerHeight, window.innerWidth)
  if (window.innerWidth > 600) {
    fecharModal();
  }
}

window.onresize = reportWindowSize;

