const fs = require('fs');
const readline = require('readline');

class Supermercado {
  constructor() {
    this.catalogo = this.carregarCatalogo();
    this.carrinho = {};
    this.total = 0.0;
    this.cliente = null;
    this.adminLogado = false;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  carregarCatalogo() {
    try {
      const data = fs.readFileSync('catalogo.txt', 'utf8');
      return data.split('\n').map((line, index) => {
        const [id, nome, preco] = line.split(' - ');
        return { id: parseInt(id), nome, preco: parseFloat(preco) };
      });
    } catch (error) {
      return [
        { id: 1, nome: 'Batata Bem Brasil Hash Brown/1,06kg', preco: 11.10 },
        { id: 2, nome: 'Ketchup Hemmer Tradicional/1kg', preco: 30.45 },
        { id: 3, nome: 'Maionese Hemmer Tradicional/1g', preco: 16.80 },
        { id: 4, nome: 'Mostarda Amarela Hemmer/1g', preco: 19.00 },
        { id: 5, nome: 'Arroz Branco/5kg', preco: 30.00 }
      ];
    }
  }

  salvarCatalogo() {
    const data = this.catalogo.map(p => `${p.id} - ${p.nome} - ${p.preco.toFixed(2)}`).join('\n');
    fs.writeFileSync('catalogo.txt', data, 'utf8');
    console.log('Catálogo salvo com sucesso!')
  }

  boasVindas() {
    console.log('Bem-vindo ao Super Mercadudismo!');
    console.log('Escolha uma opção:');
    console.log('1 - Logar como cliente');
    console.log('2 - Logar como administrador');
    console.log('3 - Sair');

    this.rl.question('Digite a opção desejada: ', (escolha) => {
      switch (escolha) {
        case '1':
          this.logarComoCliente();
          break;
        case '2':
          this.logarComoAdmin();
          break;
        case '3':
          console.log('Saindo...');
          this.rl.close();
          break;
        default:
          console.log('Opção inválida.');
          this.boasVindas();
      }
    });
  }

  logarComoCliente() {
    this.rl.question('Digite seu e-mail (@gmail.com): ', (email) => {
      if (this.validarEmail(email)) {
        this.rl.question('Digite sua senha: ', (senha) => {
          this.cliente = { email, senha };
          this.mostrarCatalogo();
        });
      } else {
        console.log('Email inválido. O e-mail deve estar no formato "usuario@gmail.com".');
        this.logarComoCliente();
      }
    });
  }

  validarEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  }

  logarComoAdmin() {
    console.log('Logando como administrador...');
    this.rl.question('Digite sua senha: ', (senha) => {
      if (senha === 'admin') {
        this.adminLogado = true;
        this.opcoesDeAdmin();
      } else {
        console.log('Senha inválida. Tente novamente.');
        this.logarComoAdmin();
      }
    });
  }

  mostrarCatalogo() {
    console.log('Catálogo:');
    this.catalogo.forEach((produto) => {
      console.log(`${produto.id} - ${produto.nome} - R$ ${produto.preco.toFixed(2)}`);
    });
    this.opcoesDeCompra();
  }

  opcoesDeCompra() {
    console.log('Escolha uma opção:');
    console.log('1 - Adicionar produto ao carrinho');
    console.log('2 - Remover produto do carrinho');
    console.log('3 - Resumir compra');
    console.log('4 - Pagar');
    console.log('5 - Cancelar compra');

    this.rl.question('Digite a opção desejada: ', (escolha) => {
      switch (escolha) {
        case '1':
          this.adicionarProduto();
          break;
        case '2':
          this.removerProduto();
          break;
        case '3':
          this.resumirCompra();
          break;
        case '4':
          this.pagar();
          break;
        case '5':
          console.log('Compra cancelada.');
          this.carrinho = {};
          this.total = 0.0;
          this.cliente = null;
          this.rl.close();
          break;
        default:
          console.log('Opção inválida.');
          this.opcoesDeCompra();
      }
    });
  }

  adicionarProduto() {
    console.log('Adicionando produto ao carrinho...');
    this.rl.question('Digite o ID do produto: ', (id) => {
      const produto = this.catalogo.find((p) => p.id === parseInt(id));
      if (produto) {
        this.rl.question('Digite a quantidade: ', (quantidade) => {
          const qtd = parseInt(quantidade);
          if (qtd > 0) {
            this.carrinho[produto.id] = this.carrinho[produto.id] || { ...produto, quantidade: 0 };
            this.carrinho[produto.id].quantidade += qtd;
            this.total += produto.preco * qtd;
            console.log('Produto adicionado com sucesso!');
            this.opcoesDeCompra();
          } else {
            console.log('Quantidade inválida. Deve ser um número positivo.');
            this.adicionarProduto();
          }
        });
      } else {
        console.log('Produto não encontrado.');
        this.adicionarProduto();
      }
    });
  }

  removerProduto() {
    console.log('Removendo produto do carrinho...');
    this.mostrarCarrinho(() => {
      this.rl.question('Digite o ID do produto que deseja remover: ', (id) => {
        const produto = this.carrinho[parseInt(id)];
        if (produto) {
          this.rl.question('Digite a quantidade a ser removida: ', (quantidade) => {
            const qtd = parseInt(quantidade);
            if (qtd > 0 && qtd <= produto.quantidade) {
              this.total -= produto.preco * qtd;
              produto.quantidade -= qtd;
              if (produto.quantidade === 0) {
                delete this.carrinho[id];
              }
              console.log('Produto removido com sucesso!');
              this.opcoesDeCompra();
            } else {
              console.log('Quantidade inválida. Deve ser um número positivo e não pode exceder a quantidade atual.');
              this.removerProduto();
            }
          });
        } else {
          console.log('Produto não encontrado no carrinho.');
          this.removerProduto();
        }
      });
    });
  }

  mostrarCarrinho(callback) {
    console.log('Produtos no carrinho:');
    Object.values(this.carrinho).forEach((produto) => {
      console.log(`${produto.id} - ${produto.nome} - Quantidade: ${produto.quantidade} - Total: R$ ${(produto.preco * produto.quantidade).toFixed(2)}`);
    });
    callback();
  }

  resumirCompra() {
    console.log('Resumo da compra:');
    Object.values(this.carrinho).forEach((produto) => {
      console.log(`${produto.nome} - Quantidade: ${produto.quantidade} - Total: R$ ${(produto.preco * produto.quantidade).toFixed(2)}`);
    });
    console.log(`Total: R$ ${this.total.toFixed(2)}`);
    this.opcoesDeCompra();
  }

  pagar() {
    console.log(`O total da sua compra é R$ ${this.total.toFixed(2)}`);
    this.rl.question('Digite o valor em dinheiro: ', (valorPago) => {
      const troco = parseFloat(valorPago) - this.total;
      if (troco >= 0) {
        this.rl.question('Deseja incluir o CPF na nota? (Digite o CPF ou deixe em branco para pular): ', (cpf) => {
          if (cpf) {
            this.cliente.cpf = cpf;
            console.log(`CPF ${cpf} adicionado à nota.`);
          }
          console.log(`Pagamento realizado com sucesso! Seu troco é R$ ${troco.toFixed(2)}.`);
          this.salvarCompra();
          this.carrinho = {};
          this.total = 0.0;
          this.cliente = null;
          this.rl.close();
        });
      } else {
        console.log('Valor insuficiente. Tente novamente.');
        this.pagar();
      }
    });
  }

  salvarCompra() {
    const data = new Date();
    const cpf = this.cliente.cpf || 'Não informado';
    const email = this.cliente.email;
    const senha = this.cliente.senha;
    const produtos = Object.values(this.carrinho).map((produto) => `${produto.nome} - Quantidade: ${produto.quantidade} - Total: R$ ${(produto.preco * produto.quantidade).toFixed(2)}`);
    const compra = `Data: ${data.toLocaleDateString()} ${data.toLocaleTimeString()}\nCPF: ${cpf}\nEmail: ${email}\nSenha: ${senha}\nProdutos:\n${produtos.join('\n')}\nTotal: R$ ${this.total.toFixed(2)}`;
    fs.appendFile('compras.txt', compra + '\n\n', (err) => {
      if (err) {
        console.log('Erro ao salvar compra:', err);
      } else {
        console.log('Compra salva com sucesso!');
      }
    });
  }

  opcoesDeAdmin() {
    console.log('Painel do Administrador');
    console.log('Escolha uma opção:');
    console.log('1 - Adicionar Produto');
    console.log('2 - Remover Produto');
    console.log('3 - Ver Histórico de Compras');
    console.log('4 - Sair');

    this.rl.question('Digite a opção desejada: ', (escolha) => {
      switch (escolha) {
        case '1':
          this.adicionarProdutoCatalogo();
          break;
        case '2':
          this.removerProdutoCatalogo();
          break;
        case '3':
          this.verHistoricoCompras();
          break;
        case '4':
          this.adminLogado = false;
          this.boasVindas();
          break;
        default:
          console.log('Opção inválida.');
          this.opcoesDeAdmin();
      }
    });
  }

  adicionarProdutoCatalogo() {
    console.log('Adicionando produto ao catálogo...');
    this.rl.question('Digite o nome do produto: ', (nome) => {
      this.rl.question('Digite o preço do produto: ', (preco) => {
        const id = this.catalogo.length > 0 ? this.catalogo[this.catalogo.length - 1].id + 1 : 1;
        this.catalogo.push({ id, nome, preco: parseFloat(preco) });
        console.log('Produto adicionado ao catálogo com sucesso!');
        this.salvarCatalogo();
        this.opcoesDeAdmin();
      });
    });
  }

  removerProdutoCatalogo() {
    console.log('Removendo produto do catálogo...');
    this.mostrarCatalogo();
    this.rl.question('Digite o ID do produto que deseja remover: ', (id) => {
      const index = this.catalogo.findIndex((p) => p.id === parseInt(id));
      if (index !== -1) {
        this.catalogo.splice(index, 1);
        console.log('Produto removido do catálogo com sucesso!');
        this.salvarCatalogo();
        this.opcoesDeAdmin();
      } else {
        console.log('Produto não encontrado.');
        this.removerProdutoCatalogo();
      }
    });
  }

  verHistoricoCompras() {
    console.log('Histórico de compras:');
    fs.readFile('compras.txt', 'utf8', (err, data) => {
      if (err) {
        console.log('Erro ao ler histórico de compras:', err);
      } else {
        console.log(data);
      }
      this.opcoesDeAdmin();
    });
  }
}

const supermercado = new Supermercado();
supermercado.boasVindas();
