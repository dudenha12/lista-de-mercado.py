const fs = require('fs');
const readline = require('readline');

class Supermercado {
    constructor() {
        // Carrega o catálogo de um arquivo JSON ou usa um catálogo padrão se o arquivo não existir
        this.catalogo = this.carregarCatalogo();
        this.carrinho = {};
        this.total = 0.0;
        this.cliente = null;
        this.senhas = {};
        this.adminLogado = false;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    carregarCatalogo() {
        try {
            const data = fs.readFileSync('catalogo.json');
            return JSON.parse(data);
        } catch (error) {
            console.log('Arquivo de catálogo não encontrado. Usando catálogo padrão.');
            return [
                {
                    id: 1, nome: 'Batata Bem Brasil Hash Brown/1,06kg', preco: 11.10
                },
                {
                    id: 2, nome: 'Ketchup Hemmer Tradicional/1kg', preco: 30.45
                },
                {
                    id: 3, nome: 'Maionese Hemmer Tradicional/1g', preco: 16.80
                },
                {
                    id: 4, nome: 'Mostarda Amarela Hemmer/1g', preco: 19.00
                },
                {
                    id: 5, nome: 'Arroz Branco/5kg', preco: 30.00
                }
            ];
        }
    }

    salvarCatalogo() {
        fs.writeFileSync('catalogo.json', JSON.stringify(this.catalogo, null, 2));
        console.log('Catálogo salvo com sucesso!');
    }

    boasVindas() {
        console.log('Bem-vindo ao Supermercado!');
        console.log('Escolha uma opção:');
        console.log('1 - Logar como cliente');
        console.log('2 - Logar como administrador');
        console.log('3 - Sair');

        this.rl.question('Digite a opção desejada: ', (escolha) => {
            if (escolha === '1') {
                this.logarComoCliente();
            } else if (escolha === '2') {
                this.logarComoAdmin();
            } else if (escolha === '3') {
                console.log('Saindo...');
                this.rl.close();
            } else {
                console.log('Opção inválida.');
                this.boasVindas();
            }
        });
    }

    logarComoCliente() {
        this.rl.question('Digite seu e-mail (@gmail.com): ', (email) => {
            if (email.endsWith('@gmail.com')) {
                this.rl.question('Digite sua senha: ', (senha) => {
                    this.cliente = { email, senha };
                    this.mostrarCatalogo();
                });
            } else {
                console.log('O e-mail deve conter "@gmail.com".');
                this.logarComoCliente();
            }
        });
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
            if (escolha === '1') {
                this.adicionarProduto();
            } else if (escolha === '2') {
                this.removerProduto();
            } else if (escolha === '3') {
                this.resumirCompra();
            } else if (escolha === '4') {
                this.pagar();
            } else if (escolha === '5') {
                console.log('Compra cancelada.');
                this.carrinho = {};
                this.total = 0.0;
                this.cliente = null;
                this.rl.close();
            } else {
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
                if (this.carrinho[produto.id]) {
                    this.carrinho[produto.id].quantidade++;
                } else {
                    this.carrinho[produto.id] = { ...produto, quantidade: 1 };
                }
                this.total += produto.preco;
                console.log('Produto adicionado com sucesso!');
                this.opcoesDeCompra();
            } else {
                console.log('Produto não encontrado.');
                this.adicionarProduto();
            }
        });
    }

    removerProduto() {
        console.log('Removendo produto do carrinho...');
        this.rl.question('Digite o ID do produto: ', (id) => {
            const produto = this.carrinho[parseInt(id)];
            if (produto) {
                this.total -= produto.preco * produto.quantidade;
                delete this.carrinho[id];
                console.log('Produto removido com sucesso!');
                this.opcoesDeCompra();
            } else {
                console.log('Produto não encontrado no carrinho.');
                this.removerProduto();
            }
        });
    }

    resumirCompra() {
        console.log('Resumo da compra:');
        Object.keys(this.carrinho).forEach((id) => {
            const produto = this.carrinho[id];
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
                console.log(`Pagamento realizado com sucesso! Seu troco é R$ ${troco.toFixed(2)}.`);
                this.carrinho = {};
                this.total = 0.0;
                this.cliente = null;
                this.rl.close();
            } else {
                console.log('Valor insuficiente. Tente novamente.');
                this.pagar();
            }
        });
    }

    opcoesDeAdmin() {
        console.log('Opções de administrador:');
        console.log('1 - Adicionar produto ao catálogo');
        console.log('2 - Remover produto do catálogo');
        console.log('3 - Alterar preço de produto');
        console.log('4 - Listar produtos do catálogo');
        console.log('5 - Sair do modo administrador');

        this.rl.question('Digite a opção desejada: ', (escolha) => {
            if (escolha === '1') {
                this.adicionarProdutoAoCatalogo();
            } else if (escolha === '2') {
                this.removerProdutoDoCatalogo();
            } else if (escolha === '3') {
                this.alterarPrecoDeProduto();
            } else if (escolha === '4') {
                this.listarProdutosDoCatalogo();
            } else if (escolha === '5') {
                this.sairDoAdmin();
            } else {
                console.log('Opção inválida.');
                this.opcoesDeAdmin();
            }
        });
    }

    adicionarProdutoAoCatalogo() {
        console.log('Adicionando produto ao catálogo...');
        this.rl.question('Digite o nome do produto: ', (nome) => {
            this.rl.question('Digite o preço do produto: ', (preco) => {
                const novoProduto = {
                    id: this.catalogo.length + 1, // Gera um novo ID automaticamente
                    nome: nome,
                    preco: parseFloat(preco)
                };
                this.catalogo.push(novoProduto);
                this.salvarCatalogo(); // Salva as alterações no arquivo
                console.log('Produto adicionado ao catálogo com sucesso!');
                this.opcoesDeAdmin();
            });
        });
    }

    removerProdutoDoCatalogo() {
        console.log('Removendo produto do catálogo...');
        this.rl.question('Digite o nome do produto: ', (nome) => {
            const index = this.catalogo.findIndex((p) => p.nome === nome);
            if (index !== -1) {
                this.catalogo.splice(index, 1);
                this.salvarCatalogo(); // Salva as alterações no arquivo
                console.log('Produto removido do catálogo com sucesso!');
                this.opcoesDeAdmin();
            } else {
                console.log('Produto não encontrado no catálogo.');
                this.removerProdutoDoCatalogo();
            }
        });
    }

    alterarPrecoDeProduto() {
        console.log('Alterando preço de produto...');
        this.rl.question('Digite o nome do produto: ', (nome) => {
            const produto = this.catalogo.find((p) => p.nome === nome);
            if (produto) {
                this.rl.question('Digite o novo preço: ', (preco) => {
                    produto.preco = parseFloat(preco);
                    this.salvarCatalogo(); // Salva as alterações no arquivo
                    console.log('Preço alterado com sucesso!');
                    this.opcoesDeAdmin();
                });
            } else {
                console.log('Produto não encontrado.');
                this.alterarPrecoDeProduto();
            }
        });
    }

    listarProdutosDoCatalogo() {
        console.log('Listando produtos do catálogo...');
        this.catalogo.forEach((produto) => {
            console.log(`${produto.id} - ${produto.nome} - R$ ${produto.preco.toFixed(2)}`);
        });
        this.opcoesDeAdmin();
    }

    sairDoAdmin() {
        console.log('Saindo do modo administrador...');
        this.adminLogado = false;
        this.boasVindas();
    }
}

const supermercado = new Supermercado();
supermercado.boasVindas();
