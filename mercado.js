const readline = require('readline');

class Supermercado {
    constructor() {
        this.catalogo = [
            { id: 1, nome: 'Batata Bem Brasil Hash Brown/1,06kg', preco: 11.10 },
            { id: 2, nome: 'Ketchup Hemmer Tradicional/1kg', preco: 30.45 },
            { id: 3, nome: 'Maionese Hemmer Tradicional/1g', preco: 16.80 },
            { id: 4, nome: 'Mostarda Amarela Hemmer/1g', preco: 19.00 },
            { id: 5, nome: 'Arroz Branco/5kg', preco: 30.00 },
            { id: 6, nome: 'Biscoito Princesa Sortido/400g', preco: 29.80 },
            { id: 7, nome: 'Biscoito de Manteiga Doce Magia Hansen/300g', preco: 12.90 },
            { id: 8, nome: 'Coca Cola Original/2l', preco: 11.00 },
            { id: 9, nome: 'Coca Cola Original lata/350ml', preco: 4.00 },
            { id: 10, nome: 'Coca Cola Zero lata/350ml', preco: 3.50 },
            { id: 11, nome: 'Pão de Queijo Grande/cada', preco: 1.00 }
        ];
        this.carrinho = {};
        this.total = 0.0;
        this.cliente = null;
        this.adminLogado = false;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
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
        console.log('Logando como cliente...');
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

    mostrarCatalogo() {
        console.log('Catálogo:');
        this.catalogo.forEach((produto) => {
            console.log(`${produto.id} - ${produto.nome} - R$ ${produto.preco}`);
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
        this.rl.question('Digite o ID do produto: ', (id) => {
            const produto = this.catalogo.find((p) => p.id == id);
            if (produto) {
                this.carrinho[produto.nome] = produto.preco;
                this.total += produto.preco;
                console.log('Produto adicionado com sucesso!');
            } else {
                console.log('Produto não encontrado.');
            }
            this.opcoesDeCompra();
        });
    }

    removerProduto() {
        this.rl.question('Digite o nome do produto: ', (nome) => {
            if (this.carrinho[nome]) {
                this.total -= this.carrinho[nome];
                delete this.carrinho[nome];
                console.log('Produto removido com sucesso!');
            } else {
                console.log('Produto não encontrado no carrinho.');
            }
            this.opcoesDeCompra();
        });
    }

    resumirCompra() {
        console.log('Resumo da compra:');
        Object.keys(this.carrinho).forEach((nome) => {
            console.log(`${nome} - R$ ${this.carrinho[nome]}`);
        });
        console.log(`Total: R$ ${this.total}`);
        this.opcoesDeCompra();
    }

    pagar() {
        console.log(`Total da compra: R$ ${this.total.toFixed(2)}`);
        this.rl.question('Digite o valor entregue pelo cliente: ', (valorEntregue) => {
            valorEntregue = parseFloat(valorEntregue);
            if (valorEntregue >= this.total) {
                const troco = valorEntregue - this.total;
                console.log(`Pagamento realizado com sucesso! Troco: R$ ${troco.toFixed(2)}`);
                this.carrinho = {};
                this.total = 0.0;
                this.cliente = null;
            } else {
                console.log('Valor insuficiente para realizar o pagamento.');
            }
            this.rl.close();
        });
    }
}

const supermercado = new Supermercado();
supermercado.boasVindas();
