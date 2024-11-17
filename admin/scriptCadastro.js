// Recuperando os dados do Local Storage para cada categoria
let dadosCaminhoes = JSON.parse(localStorage.getItem('caminhoes')) || [];
let dadosFuncionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
let dadosVendas = JSON.parse(localStorage.getItem('vendas')) || [];

// Referências aos campos dos formulários
let ano = document.getElementById('ano');
let modelo = document.getElementById('modelo');
let status = document.getElementById('status');
let nomeFuncionario = document.getElementById('nomeFuncionario');
let dataNascimento = document.getElementById('dataNascimento');
let salario = document.getElementById('salario');
let modeloVenda = document.getElementById('modeloVenda');
let dataVenda = document.getElementById('dataVenda');
let funcionarioVenda = document.getElementById('funcionarioVenda');
let valorVenda = document.getElementById('valorVenda');

// Recuperando QueryParam para editar
const keyCaminhao = new URLSearchParams(window.location.search).get('chaveCaminhao');
const keyFuncionario = new URLSearchParams(window.location.search).get('chaveFuncionario');
const keyVenda = new URLSearchParams(window.location.search).get('chaveVenda');

// Preenchendo o formulário em caso de alteração
if (keyCaminhao) {
    ano.value = dadosCaminhoes[keyCaminhao].ano;
    modelo.value = dadosCaminhoes[keyCaminhao].modelo;
    status.value = dadosCaminhoes[keyCaminhao].status;
    document.querySelector('#formCaminhao button[type="submit"]').innerText = "Alterar Caminhão";
}

if (keyFuncionario) {
    nomeFuncionario.value = dadosFuncionarios[keyFuncionario].nome;
    dataNascimento.value = dadosFuncionarios[keyFuncionario].dataNascimento;
    salario.value = dadosFuncionarios[keyFuncionario].salario;
    document.querySelector('#formFuncionario button[type="submit"]').innerText = "Alterar Funcionário";
}

if (keyVenda) {
    modeloVenda.value = dadosVendas[keyVenda].modelo;
    dataVenda.value = dadosVendas[keyVenda].dataVenda;
    funcionarioVenda.value = dadosVendas[keyVenda].funcionarioVenda;
    valorVenda.value = dadosVendas[keyVenda].valorVenda;
    document.querySelector('#formVenda button[type="submit"]').innerText = "Alterar Venda";
}

// Reset do formulário e QueryParam
function resetForm(e, url) {
    e.preventDefault();
    window.location.href = url;
}

document.getElementById('formCaminhao')?.addEventListener('reset', (e) => resetForm(e, "./index.html"));
document.getElementById('formFuncionario')?.addEventListener('reset', (e) => resetForm(e, "./funcionarios.html"));
document.getElementById('formVenda')?.addEventListener('reset', (e) => resetForm(e, "./vendas.html"));

// Função para validar campos monetários
function validarValorMonetario(valor) {
    valor = valor.replace(/R\$/g, "").replace(/\s/g, "").replace(",", ".");
    return !isNaN(valor) ? parseFloat(valor) : NaN;
}

// Função para exibir mensagens de erro abaixo do campo
function exibirErro(campoId, mensagem) {
    const campo = document.getElementById(campoId);
    const erro = document.createElement('p');
    erro.classList.add('erro');
    erro.innerText = mensagem;
    campo.after(erro);
}

// Função para remover mensagens de erro existentes
function removerMensagensErro() {
    const erros = document.querySelectorAll('.erro');
    erros.forEach(erro => erro.remove());
}

// Função para atualizar a tabela
function atualizarTabela(tipo, tabelaId, colunas) {
    const tabela = document.querySelector(tabelaId + ' tbody');
    let dados;

    switch (tipo) {
        case 'caminhoes':
            dados = dadosCaminhoes;
            break;
        case 'funcionarios':
            dados = dadosFuncionarios;
            break;
        case 'vendas':
            dados = dadosVendas;
            break;
        default:
            dados = [];
    }

    dados.forEach((item, index) => {
        const linha = document.createElement('tr');
        colunas.forEach(coluna => {
            const td = document.createElement('td');
            td.textContent = item[coluna];
            linha.appendChild(td);
        });

        // Coluna de Ações
        const tdAcoes = document.createElement('td');
        tdAcoes.innerHTML = `<a href="?chaveCaminhao=${index}">Editar</a>
                             <a href="#" onclick="removerItem('${tipo}', ${index})">Excluir</a>`;
        linha.appendChild(tdAcoes);
        tabela.appendChild(linha);
    });
}

// Função para remover item da lista
function removerItem(tipo, index) {
    let dados;
    switch (tipo) {
        case 'caminhoes':
            dados = dadosCaminhoes;
            break;
        case 'funcionarios':
            dados = dadosFuncionarios;
            break;
        case 'vendas':
            dados = dadosVendas;
            break;
        default:
            return;
    }

    dados.splice(index, 1);
    localStorage.setItem(tipo, JSON.stringify(dados));
    window.location.reload();
}

// Função para validar campos do formulário
function validarCampos(formFields) {
    let validado = true;
    formFields.forEach(field => {
        if (!field.value || (field.name === 'salario' && isNaN(field.value))) {
            exibirErro(field.id, `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} é obrigatório`);
            validado = false;
        }
    });
    return validado;
}

// Função de cadastro dos caminhões
document.getElementById('formCaminhao')?.addEventListener('submit', function (e) {
    e.preventDefault();
    removerMensagensErro();

    if (!validarCampos([ano, modelo, status])) return;

    const caminhao = {
        ano: ano.value,
        modelo: modelo.value,
        status: status.value
    };

    if (!keyCaminhao) {
        dadosCaminhoes.push(caminhao);
    } else {
        dadosCaminhoes[keyCaminhao] = caminhao;
    }

    localStorage.setItem('caminhoes', JSON.stringify(dadosCaminhoes));
    window.location.href = './index.html';
});

// Função de cadastro de funcionários
document.getElementById('formFuncionario')?.addEventListener('submit', function (e) {
    e.preventDefault();
    removerMensagensErro();

    if (!validarCampos([nomeFuncionario, dataNascimento, salario])) return;

    const funcionario = {
        nome: nomeFuncionario.value,
        dataNascimento: dataNascimento.value,
        salario: salario.value
    };

    if (!keyFuncionario) {
        dadosFuncionarios.push(funcionario);
    } else {
        dadosFuncionarios[keyFuncionario] = funcionario;
    }

    localStorage.setItem('funcionarios', JSON.stringify(dadosFuncionarios));
    window.location.href = './funcionarios.html';
});

// Função de cadastro de vendas
document.getElementById('formVenda')?.addEventListener('submit', function (e) {
    e.preventDefault();
    removerMensagensErro();

    if (!validarCampos([modeloVenda, dataVenda, funcionarioVenda, valorVenda])) return;

    const venda = {
        modelo: modeloVenda.value,
        dataVenda: dataVenda.value,
        funcionarioVenda: funcionarioVenda.value,
        valorVenda: validarValorMonetario(valorVenda.value)
    };

    if (!keyVenda) {
        dadosVendas.push(venda);
    } else {
        dadosVendas[keyVenda] = venda;
    }

    localStorage.setItem('vendas', JSON.stringify(dadosVendas));
    window.location.href = './vendas.html';
});

// Atualizar tabelas ao carregar
window.onload = function () {
    if (document.getElementById('tabelaCaminhoes')) {
        atualizarTabela('caminhoes', '#tabelaCaminhoes', ['ano', 'modelo', 'status']);
    }

    if (document.getElementById('tabelaFuncionarios')) {
        atualizarTabela('funcionarios', '#tabelaFuncionarios', ['nome', 'dataNascimento', 'salario']);
    }

    if (document.getElementById('tabelaVendas')) {
        atualizarTabela('vendas', '#tabelaVendas', ['modelo', 'dataVenda', 'funcionarioVenda', 'valorVenda']);
    }
};
