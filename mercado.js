const readline = require('readline');
const fs = require('fs');

class Supermercado {
    constructor() {
        this.catalogo = {
            1: { produto: 'Arroz integral', preço: 10.0 },
            2: { produto: 'Pote de sorvete de maracujá 3l', preço: 50.0 },
            3: { produto: 'Pote de sorvete de chocolate 2l', preço: 25.0 },
            4: { produto: 'Pote de sorvete de morango 3l', preço: 40.0 },
            5: { produto: 'Coca-cola 2l', preço: 12.0 },
            6: { produto: 'Fanta latinha', preço: 3.5 },
            7: { produto: 'Guaraná latinha', preço: 4.5 },
            8: { produto: 'Coca-cola latinha', preço: 5.0 },
            9: { produto: 'Bolo de morango/inteiro', preço: 30.0 },
            10: { produto: 'Bolo de chocolate/inteiro', preço: 40.0 },
            11: { produto: 'Pão de queijo/cada', preço: 1.0 },
            12: { produto: 'Feijão /kg', preço: 8.0 },
            13: { produto: 'Carne de porco/2kg', preço: 30.0 },
            14: { produto: 'Pacote de peito de frango', preço: 18.0 },
            15: { produto: 'Cheetos assado/23g', preço: 6.0 },
            16: { produto: 'Doritos', preço: 6.0 },
            17: { produto: 'Fandangos', preço: 5.0 },
            18: { produto: 'Nestle/clássico', preço: 3.5 },
            19: { produto: 'Lacta/clássico', preço: 5.0 }
        };
        this.carrinho = {};
        this.total = 0.0;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    boasVindas() {
        console.log('Bem-vindo ao Mercado Dudão!');
        console.log('Você pode escolher os produtos do nosso catálogo a seguir.');
    }

    adicionarProduto(codigo, quantidade) {
        if (this.catalogo[codigo]) {
            if (this.carrinho[codigo]) {
                this.carrinho[codigo] += quantidade;
            } else {
                this.carrinho[codigo] = quantidade;
            }
            console.log(`${quantidade} unidade(s) de ${this.catalogo[codigo].produto} adicionada(s) ao carrinho.`);
        } else {
            console.log('Produto não encontrado no catálogo.');
        }
    }

    removerProduto(codigo, quantidade) {
        if (this.carrinho[codigo]) {
            if (quantidade >= this.carrinho[codigo]) {
                delete this.carrinho[codigo];
                console.log(`${this.catalogo[codigo].produto} removido do carrinho.`);
            } else {
                this.carrinho[codigo] -= quantidade;
                console.log(`${quantidade} unidade(s) de ${this.catalogo[codigo].produto} removida(s) do carrinho.`);
            }
        } else {
            console.log('Produto não encontrado no carrinho.');
        }
    }

    resumirCompra() {
        console.log('\nResumo da compra:');
        this.total = 0.0;
        for (const [codigo, quantidade] of Object.entries(this.carrinho)) {
            const produto = this.catalogo[codigo].produto;
            const precoUnitario = this.catalogo[codigo].preço;
            const precoTotal = precoUnitario * quantidade;
            console.log(`${quantidade} unidade(s) de ${produto} - R$${precoTotal.toFixed(2)}`);
            this.total += precoTotal;
        }
    }

    pagar() {
        this.resumirCompra();

        console.log('\nEscolha uma opção:');
        console.log('1 - Pagar');
        console.log('2 - Alterar carrinho');
        console.log('3 - Cancelar compra');

        this.rl.question('Digite a opção desejada: ', (escolha) => {
            if (escolha === '3') {
                console.log('Compra cancelada.');
                this.carrinho = {};
                this.total = 0.0;
                this.rl.close();
                return;
            } else if (escolha === '1') {
                this.rl.question('Digite o valor recebido pelo cliente: ', (pagamento) => {
                    const valorPago = parseFloat(pagamento);
                    const troco = valorPago - this.total;

                    if (troco < 0) {
                        console.log(`Valor insuficiente. Faltam R$${(-troco).toFixed(2)}.`);
                        this.pagar(); // Chama novamente se valor for insuficiente
                    } else {
                        if (troco > 0) {
                            console.log(`Troco: R$${troco.toFixed(2)}`);
                        }

                        console.log('\nDeseja informar o CPF na nota?');
                        console.log('Digite "Sim" para informar o CPF ou "Não" para não informar.');

                        this.rl.question('Escolha uma opção: ', (cpfOpcao) => {
                            let cpfInfo = 'CPF: Não informado';
                            if (cpfOpcao.toLowerCase() === 'sim') {
                                this.rl.question('Digite o CPF: ', (cpf) => {
                                    cpfInfo = `CPF: ${cpf}`;
                                    this.gerarNotaFiscal(cpfInfo);
                                });
                            } else {
                                this.gerarNotaFiscal(cpfInfo);
                            }
                        });
                    }
                });
            } else if (escolha === '2') {
                this.alterarCarrinho();
            } else {
                console.log('Opção inválida. Digite "1" para pagar, "2" para alterar o carrinho ou "3" para cancelar a compra.');
                this.pagar();
            }
        });
    }

    gerarNotaFiscal(cpfInfo) {
        console.log('\nNota Fiscal:');
        console.log(`Total da compra - R$${this.total.toFixed(2)}`);
        console.log(cpfInfo);
        console.log('Compra concluída');

        const dataAtual = new Date();
        const data = dataAtual.toLocaleDateString('pt-BR');

        const notaFiscal = [
            `Data: ${data}`,
            cpfInfo,
            'Resumo da compra:'
        ];

        for (const [codigo, quantidade] of Object.entries(this.carrinho)) {
            const produto = this.catalogo[codigo].produto;
            const precoUnitario = this.catalogo[codigo].preço;
            const precoTotal = precoUnitario * quantidade;
            notaFiscal.push(`${quantidade} unidade(s) de ${produto} - R$${precoTotal.toFixed(2)}`);
        }
        notaFiscal.push(`Total da compra: R$${this.total.toFixed(2)}`);
        notaFiscal.push('');

        fs.appendFile('notafiscal.txt', notaFiscal.join('\n') + '\n', (err) => {
            if (err) throw err;
            this.carrinho = {};
            this.total = 0.0;
            this.rl.close();
        });
    }

    alterarCarrinho() {
        console.log('\nEscolha uma opção:');
        console.log('1 - Adicionar produto ao carrinho');
        console.log('2 - Remover produto do carrinho');
        console.log('3 - Voltar para o menu de pagamento');

        this.rl.question('Digite a opção desejada: ', (opcaoAlterar) => {
            if (opcaoAlterar === '1') {
                this.rl.question('Digite o código do produto: ', (codigo) => {
                    const cod = parseInt(codigo);
                    this.rl.question('Digite a quantidade desejada: ', (quantidade) => {
                        const quant = parseInt(quantidade);
                        this.adicionarProduto(cod, quant);
                        this.alterarCarrinho();
                    });
                });
            } else if (opcaoAlterar === '2') {
                this.rl.question('Digite o código do produto a remover: ', (codigo) => {
                    const cod = parseInt(codigo);
                    this.rl.question('Digite a quantidade a remover: ', (quantidade) => {
                        const quant = parseInt(quantidade);
                        this.removerProduto(cod, quant);
                        this.alterarCarrinho();
                    });
                });
            } else if (opcaoAlterar === '3') {
                this.pagar();
            } else {
                console.log('Opção inválida. Tente novamente.');
                this.alterarCarrinho();
            }
        });
    }

    comprar() {
        this.boasVindas();
        console.log('\nCatálogo de produtos:');
        for (const [codigo, detalhes] of Object.entries(this.catalogo)) {
            console.log(`${codigo} - ${detalhes.produto} - R$${detalhes.preço.toFixed(2)}`);
        }

        console.log('\nEscolha uma opção:');
        console.log('1 - Adicionar produto ao carrinho');
        console.log('2 - Remover produto do carrinho');
        console.log('3 - Finalizar compra');
        console.log('Digite "sair" para encerrar o programa.');

        this.rl.question('Digite a opção desejada: ', (escolha) => {
            if (escolha === 'sair') {
                this.rl.close();
            } else if (escolha === '1') {
                this.rl.question('Digite o código do produto: ', (codigo) => {
                    const cod = parseInt(codigo);
                    this.rl.question('Digite a quantidade desejada: ', (quantidade) => {
                        const quant = parseInt(quantidade);
                        this.adicionarProduto(cod, quant);
                        this.comprar();
                    });
                });
            } else if (escolha === '2') {
                this.rl.question('Digite o código do produto a remover: ', (codigo) => {
                    const cod = parseInt(codigo);
                    this.rl.question('Digite a quantidade a remover: ', (quantidade) => {
                        const quant = parseInt(quantidade);
                        this.removerProduto(cod, quant);
                        this.comprar();
                    });
                });
            } else if (escolha === '3') {
                this.pagar();
            } else {
                console.log('Opção inválida. Tente novamente.');
                this.comprar();
            }
        });
    }
}

const mercado = new Supermercado();
mercado.comprar();
