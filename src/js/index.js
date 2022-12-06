
const serverurl = process.env.SERVER_API;

console.log("Dev m3", serverurl);

let filtroCor = "";
let filtroTamanho = "";
let filtroPreco = "";
const precos = {
  'p1': [0, 50],
  'p2': [51, 150],
  'p3': [151, 300],
  'p4': [301, 500],
  'p5': [501, true],
}

let carregado = false
let listaProdutos = [];
let listaProdutosFiltrados = [];


// filtrar({cor: 'Preto', tamanho: 'G', preco: 'p1'})
const filtrar = (params) => {
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

const checkFiltros = document.querySelectorAll('.check-filtrar')
checkFiltros.forEach(radio => {

  radio.onclick = aplicarFiltro

})

function aplicarFiltro(elem) {
  const id = elem.target.id
  const params = (id).split('-')
  const filtro = { [params[0]]: params[1] }
  const filtrados = filtrar(filtro)

  montarListaProdutos(filtrados)
}

const verMais = document.getElementById("ver-mais");
const carregarMais = document.getElementById("btn-carregar-mais");
verMais.addEventListener("mouseup", mostrarMais);
carregarMais.addEventListener("mouseup", carregarMaisProdutos);

function mostrarMais() {
  const g = document.querySelectorAll(".cor-filtro");

  g.forEach((cor) => {
    cor.style.display = "block";
  });

  verMais.style.display = "none";
}

function carregarMaisProdutos() {
  console.log('carregarMaisProdutos')
  const item = document.querySelectorAll(".item");

  item.forEach((elem) => {
    elem.style.display = "flex";
  });

  carregarMais.style.display = "none";
}

fetch(`${serverurl}/products`)
  .then((res) => res.json())
  .then((result) => {
    let produtos = []

    for (let produto of result) {

      if (produtos.some(p => p.id == produto.id)) {
        continue
      }
      produtos.push(produto)

    }

    montarListaProdutos(produtos)

  })
  .catch(console.log);

function montarListaProdutos(arrProdutos, ordem = 'mais-recentes') {
  const divProdutos = document.getElementById("produtos");
  listaProdutosFiltrados = []

  divProdutos.innerHTML = ""

  const ordenado = ordenar(arrProdutos, ordem )

  for (let [index, produto] of ordenado.entries()) {
    if (listaProdutosFiltrados.some(p => p.id == produto.id)) {
      continue
    }

    if (carregado) {
      listaProdutosFiltrados.push(produto)
    } else {
      listaProdutos.push(produto)
      listaProdutosFiltrados.push(produto)
    }

    const valor = elementFromHtml(`
        <div class="item" id="${produto.id}" ${index > 5 ? 'style="display: none;"' : ''}>
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

  if(listaProdutosFiltrados.length > 6){
    carregarMais.style.display = "block";
  } else {
    carregarMais.style.display = "none";
  }

  carregado = true
}



function elementFromHtml(html) {
  const template = document.createElement("template");

  template.innerHTML = html.trim();

  return template.content.firstElementChild;
}

const btnFiltrar = document.getElementById('btn-filtar')
const containerFiltros = document.querySelector('.container-filtros')
const btnMostrarOrdenar = document.getElementById('btn-ordenar')
const containerOrdenar = document.querySelector('.ordenar-select')
const arrOrdenarText = document.querySelectorAll('.ordenar-text')
const containerProdutos = document.querySelector('.container-produtos')

btnFiltrar.addEventListener('mouseup', () => {

  containerFiltros.classList.add('modal')
  containerProdutos.classList.add('oculto')

})

arrOrdenarText.forEach(elem => {
  elem.onclick = function(){
    
    montarListaProdutos(listaProdutosFiltrados, elem.id)
    fecharModal()
  }
})

const selectOrdenar = document.getElementById('ordenar-select-desk')
selectOrdenar.onchange = function (elem) {
  const criterio = elem.target.value
  
  montarListaProdutos(listaProdutosFiltrados, criterio)
}

function ordenar(arr, criterio) {
  
  if (criterio == 'mais-recentes') {
    arr.sort((a, b) => {
      const d1 = new Date(a['date']).getTime();
      const d2 = new Date(b['date']).getTime();

      return Number(d2) - Number(d1)
    })
  } else if (criterio == 'menor-preco') {
    arr.sort((a, b) => a.price - b.price)

  } else if (criterio == 'maior-preco') {
    arr.sort((a, b) => b.price - a.price)

  }

  return arr

}

btnMostrarOrdenar.addEventListener('mouseup', () => {

  containerOrdenar.classList.add('modal')
  containerProdutos.classList.add('oculto')

})


// fechar modal
const btnFechar = document.querySelectorAll('.fechar')
btnFechar.forEach(botao => {
  botao.addEventListener('mouseup', fecharModal)
})

function fecharModal() {
  containerFiltros.classList.remove("modal");
  containerOrdenar.classList.remove("modal");
  containerProdutos.classList.remove('oculto')

}


const btnLimparFiltros = document.getElementById('limpar-filtros')
btnLimparFiltros.onclick = function(){
  filtrar({cor: '', tamanho: '', preco: ''})
  
  montarListaProdutos(listaProdutos)

  checkFiltros.forEach(elem => {

    elem.checked = false
  
  })
}


function reportWindowSize() {
  if (window.innerWidth > 600) {
    fecharModal();
    containerProdutos.style.display = 'flex'
    containerProdutos.classList.remove('oculto')
  } else {
    if (containerFiltros.classList.contains('modal') || containerOrdenar.classList.contains('modal')) {
      containerProdutos.classList.add('oculto')
    } else {
      containerProdutos.classList.remove('oculto')
    }
  }
}

window.onresize = reportWindowSize;

