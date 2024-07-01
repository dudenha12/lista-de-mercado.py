let produtos = [];
let total = 0;

function adicionarProduto() {
  let produto = prompt("Digite o nome do produto:");
  let preco = parseFloat(prompt("Digite o preço do produto:"));
  let quantidade = parseInt(prompt("Digite a quantidade do produto:"));

  if (produto && preco && quantidade) {
    produtos.push({ nome: produto, preco: preco, quantidade: quantidade });
    console.log(Produto adicionado: ${produto} - R$${preco} x ${quantidade});
  } else {
    console.log("Erro ao adicionar produto. Verifique os dados.");
  }
}

function calcularTotal() {
  total = 0;
  produtos.forEach(produto => {
    total += produto.preco * produto.quantidade;
  });
  console.log(Total: R$${total.toFixed(2)});
}

function mostrarProdutos() {
  console.log("Produtos adicionados:");
  produtos.forEach(produto => {
    console.log(${produto.nome} - R$${produto.preco} x ${produto.quantidade});
  });
}
adicionarProduto();
adicionarProduto();
adicionarProduto();

mostrarProdutos();
calcularTotal();
