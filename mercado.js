class Supermercado {
    constructor() {
        this.catalogo = {
            1: { produto: 'Batata Bem Brasil Hash Brown/1,06kg', preco: 11.10 },
            2: { produto: 'Ketchup Hemmer Tradicional/1kg', preco: 30.45 },
            3: { produto: 'Maionese Hemmer Tradicional/1g', preco: 16.80 },
            4: { produto: 'Mostarda Amarela Hemmer/1g', preco: 19.00 },
            5: { produto: 'Arroz Branco/5kg', preco: 30.00 },
            6: { produto: 'Biscoito Princesa Sortido/400g', preco: 29.80 },
            7: { produto: 'Biscoito de Manteiga Doce Magia Hansen/300g', preco: 12.90 },
            8: { produto: 'Coca Cola Original/2l', preco: 11.00 },
            9: { produto: 'Coca Cola Original lata/350ml', preco: 4.00 },
            10: { produto: 'Coca Cola Zero lata/350ml', preco: 3.50 },
            11: { produto: 'Pão de Queijo Grande/cada', preco: 1.00 }
        };
        this.carrinho = {};
        this.total = 0.0;
        this.clientes = {};
    }

    cadastrarCliente() {
        let nome = prompt("Digite o nome do cliente: ");
        let email = prompt("Digite o email do cliente: ");
        if (!email.endsWith('@gmail.com')) {
            alert("O email deve ser do tipo @gmail.com. Cadastro não realizado.");
            return;
        }
        let senha = prompt("Digite a senha do cliente: ");
        this.clientes[email] = { nome, senha };
        alert("Cliente cadastrado com sucesso!");
    }

    entrar() {
        let email = prompt("Digite o email do cliente: ");
        if (!email.endsWith('@gmail.com')) {
            alert("O email deve ser do tipo @gmail.com. Login não realizado.");
            return;
        }
        let senha = prompt("Digite a senha do cliente: ");
        if (this.clientes[email] && this.clientes[email].senha === senha) {
            alert("Login efetuado com sucesso!");
            this.comprar();  // Direto ao catálogo
        } else {
            alert("Email ou senha incorretos.");
        }
    }

    boasVindas() {
        alert('Bem-vindo ao Mercado Dudão!\nVocê pode escolher os produtos do nosso catálogo a seguir.');
    }

    atualizarTotal() {
        this.total = Object.keys(this.carrinho).reduce((acc, codigo) => {
            return acc + this.catalogo[codigo].preco * this.carrinho[codigo];
        }, 0);
    }

    adicionarProduto(codigo, quantidade) {
        if (this.catalogo[codigo]) {
            this.carrinho[codigo] = (this.carrinho[codigo] || 0) + quantidade;
            this.atualizarTotal();
            alert(`${quantidade} unidade(s) de ${this.catalogo[codigo].produto} adicionada(s) ao carrinho.`);
        } else {
            alert('Produto não encontrado no catálogo.');
        }
    }

    removerProduto(codigo, quantidade) {
        if (this.carrinho[codigo]) {
            this.carrinho[codigo] -= quantidade;
            if (this.carrinho[codigo] <= 0) {
                delete this.carrinho[codigo];
                alert('Produto removido do carrinho.');
            }
            this.atualizarTotal();
        } else {
            alert('Produto não encontrado no carrinho.');
        }
    }

    resumirCompra() {
        let resumo = 'Resumo da compra:\n';
        for (let codigo in this.carrinho) {
            let produto = this.catalogo[codigo].produto;
            let preco = this.catalogo[codigo].preco;
            let quantidade = this.carrinho[codigo];
            resumo += `${quantidade} unidade(s) de ${produto} - R$${(preco * quantidade).toFixed(2)}\n`;
        }
        resumo += `Total: R$${this.total.toFixed(2)}`;
        alert(resumo);
    }

    pagar() {
        this.resumirCompra();
        let valorPago = parseFloat(prompt('Digite o valor recebido pelo cliente: '));
        let troco = valorPago - this.total;
        if (troco >= 0) {
            alert(`Compra concluída! Troco: R$${troco.toFixed(2)}`);
        } else {
            alert(`Valor insuficiente. Faltam R$${Math.abs(troco).toFixed(2)}.`);
        }
        this.carrinho = {};
        this.total = 0;
    }

    comprar() {
        this.boasVindas();
        let opcao = '';
        do {
            opcao = prompt(`Catálogo:\n${Object.keys(this.catalogo).map(key => 
                `${key} - ${this.catalogo[key].produto} - R$${this.catalogo[key].preco.toFixed(2)}`).join('\n')}\n\n1 - Adicionar produto ao carrinho\n2 - Remover produto do carrinho\n3 - Finalizar compra\nDigite "sair" para sair.`);

            if (opcao === '1') {
                let codigo = parseInt(prompt('Digite o código do produto: '));
                let quantidade = parseInt(prompt('Digite a quantidade: '));
                this.adicionarProduto(codigo, quantidade);
            } else if (opcao === '2') {
                let codigo = parseInt(prompt('Digite o código do produto: '));
                let quantidade = parseInt(prompt('Digite a quantidade: '));
                this.removerProduto(codigo, quantidade);
            } else if (opcao === '3') {
                this.pagar();
            }
        } while (opcao !== 'sair');
    }

    entrarAdmin() {
        let email = prompt("Digite o email do administrador: ");
        let senha = prompt("Digite a senha do administrador: ");
        if (email === 'admin@gmail.com' && senha === 'admin') {
            alert("Login de administrador bem-sucedido!");
            let adminOpcao = '';
            do {
                adminOpcao = prompt('1 - Adicionar Produto\n2 - Remover Produto\n3 - Ver histórico de compras\nDigite "sair" para sair.');
                if (adminOpcao === '1') {
                    let nome = prompt('Digite o nome do produto: ');
                    let preco = parseFloat(prompt('Digite o preço do produto: '));
                    let codigo = Object.keys(this.catalogo).length + 1;
                    this.catalogo[codigo] = { produto: nome, preco };
                    alert('Produto adicionado com sucesso!');
                } else if (adminOpcao === '2') {
                    let codigo = parseInt(prompt('Digite o código do produto a remover: '));
                    delete this.catalogo[codigo];
                    alert('Produto removido com sucesso!');
                } else if (adminOpcao === '3') {
                    alert('Visualizando o histórico de compras (não implementado).');
                }
            } while (adminOpcao !== 'sair');
        } else {
            alert('Credenciais de administrador incorretas.');
        }
    }

    main() {
        let opcao = '';
        do {
            opcao = prompt('1 - Cadastro do Cliente\n2 - Entrar\n3 - Entrar como Administrador\nDigite "sair" para sair.');
            if (opcao === '1') {
                this.cadastrarCliente();
            } else if (opcao === '2') {
                this.entrar();
            } else if (opcao === '3') {
                this.entrarAdmin();
            }
        } while (opcao !== 'sair');
        alert('Saindo do sistema.');
    }
}

const mercado = new Supermercado();
mercado.main();
