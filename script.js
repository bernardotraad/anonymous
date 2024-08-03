// Cache DOM elements to avoid repeated lookups
const formElements = {
    pistola: document.getElementById('pistola'),
    fuzil: document.getElementById('fuzil'),
    sub: document.getElementById('sub'),
    escopeta: document.getElementById('escopeta'),
    sniper: document.getElementById('sniper'),
    aplicarDesconto: document.getElementById('aplicarDesconto'),
    descontoPredefinido: document.getElementById('descontoPredefinido'),
    desconto: document.getElementById('desconto'),
    valorDesejado: document.getElementById('valorDesejado'),
    tipoMunicao: document.getElementById('tipoMunicao'),
    resultado: document.getElementById('resultado'),
    resultadoQuantidade: document.getElementById('resultadoQuantidade'),
    mensagemSucesso: document.getElementById('mensagemSucesso'),
    mensagemErro: document.getElementById('mensagemErro')
};

const precos = {
    pistola: 1100,
    fuzil: 720,
    sub: 720,
    escopeta: 11000,
    sniper: 70000
};

// Event listener for discount checkbox
formElements.aplicarDesconto.addEventListener('change', function() {
    const { descontoPredefinido, desconto } = formElements;
    if (this.checked) {
        descontoPredefinido.disabled = false;
        desconto.disabled = false;
    } else {
        descontoPredefinido.disabled = true;
        desconto.disabled = true;
        descontoPredefinido.value = "";
        desconto.value = "";
    }
    calcular();
    calcularQuantidade();
});

// Add event listeners to all relevant inputs and selects for dynamic updates
const inputs = [
    formElements.pistola, formElements.fuzil, formElements.sub, formElements.escopeta,
    formElements.sniper, formElements.desconto, formElements.valorDesejado, formElements.tipoMunicao
];

inputs.forEach(input => {
    input.addEventListener('input', () => {
        calcular();
        calcularQuantidade();
    });
});

formElements.descontoPredefinido.addEventListener('change', () => {
    calcular();
    calcularQuantidade();
});

function calcular() {
    const quantidade = {
        pistola: parseInt(formElements.pistola.value) || 0,
        fuzil: parseInt(formElements.fuzil.value) || 0,
        sub: parseInt(formElements.sub.value) || 0,
        escopeta: parseInt(formElements.escopeta.value) || 0,
        sniper: parseInt(formElements.sniper.value) || 0
    };

    let valido = true;
    let totalQuantidade = 0;
    let total = 0;

    Object.keys(quantidade).forEach(key => {
        const input = formElements[key];
        const erroMsg = document.getElementById(`erro${capitalize(key)}`);
        if (quantidade[key] < 0 || isNaN(quantidade[key])) {
            erroMsg.innerText = `Por favor, insira um número válido para a quantidade de munição de ${key}.`;
            input.classList.add('invalid');
            valido = false;
        } else {
            erroMsg.innerText = '';
            input.classList.remove('invalid');
        }
        totalQuantidade += quantidade[key];
        total += quantidade[key] * precos[key];
    });

    if (totalQuantidade === 0) {
        formElements.mensagemErro.innerText = "Por favor, insira pelo menos uma quantidade de munição.";
        formElements.resultado.innerText = "";
        return;
    } else {
        formElements.mensagemErro.innerText = "";
    }

    if (!valido) {
        return;
    }

    total = aplicarDesconto(total);

    formElements.resultado.innerText = `Total: R$${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    formElements.mensagemSucesso.innerText = "Cálculo realizado com sucesso!";
    formElements.mensagemSucesso.style.display = 'block';

    salvarConfiguracoes(quantidade, formElements.aplicarDesconto.checked, formElements.descontoPredefinido.value, formElements.desconto.value);
}

function calcularQuantidade() {
    const valorDesejado = parseFloat(formElements.valorDesejado.value) || 0;
    const tipoMunicao = formElements.tipoMunicao.value;

    if (valorDesejado <= 0 || isNaN(valorDesejado)) {
        formElements.resultadoQuantidade.innerText = "Por favor, insira um valor válido.";
        return;
    }

    let precoPorUnidade = precos[tipoMunicao];
    precoPorUnidade = aplicarDesconto(precoPorUnidade);

    const quantidade = Math.floor(valorDesejado / precoPorUnidade);

    formElements.resultadoQuantidade.innerText = `R$${valorDesejado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} compram ${quantidade} munições de ${tipoMunicao}.`;
}

function aplicarDesconto(valor) {
    let descontoPercentual = 0;
    if (formElements.aplicarDesconto.checked) {
        if (formElements.descontoPredefinido.value) {
            descontoPercentual = parseFloat(formElements.descontoPredefinido.value);
        } else if (formElements.desconto.value) {
            descontoPercentual = parseFloat(formElements.desconto.value);
        }

        if (descontoPercentual < 0 || descontoPercentual > 100 || isNaN(descontoPercentual)) {
            formElements.mensagemErro.innerText = "Por favor, insira uma porcentagem de desconto válida entre 0 e 100.";
            return valor;
        }

        return valor - (valor * (descontoPercentual / 100));
    }
    return valor;
}

function limpar() {
    document.getElementById('municaoForm').reset();
    formElements.aplicarDesconto.checked = false;
    formElements.descontoPredefinido.value = "";
    formElements.desconto.value = "";
    formElements.descontoPredefinido.disabled = true;
    formElements.desconto.disabled = true;
    formElements.valorDesejado.value = "";
    formElements.tipoMunicao.value = "pistola";
    formElements.resultado.innerText = "";
    formElements.resultadoQuantidade.innerText = "";
    formElements.mensagemSucesso.innerText = "";
    formElements.mensagemErro.innerText = "";
    document.querySelectorAll('input').forEach(input => input.classList.remove('invalid'));
    document.querySelectorAll('small.error-message').forEach(small => small.innerText = "");
    localStorage.removeItem('configuracoesMunicao');
}

function salvarConfiguracoes(quantidade, aplicarDesconto, descontoPredefinido, desconto) {
    const configuracoes = {
        quantidade,
        aplicarDesconto,
        descontoPredefinido,
        desconto,
        valorDesejado: formElements.valorDesejado.value,
        tipoMunicao: formElements.tipoMunicao.value
    };
    localStorage.setItem('configuracoesMunicao', JSON.stringify(configuracoes));
}

function carregarConfiguracoes() {
    const configuracoes = JSON.parse(localStorage.getItem('configuracoesMunicao'));
    if (configuracoes) {
        formElements.pistola.value = configuracoes.quantidade.pistola || 0;
        formElements.fuzil.value = configuracoes.quantidade.fuzil || 0;
        formElements.sub.value = configuracoes.quantidade.sub || 0;
        formElements.escopeta.value = configuracoes.quantidade.escopeta || 0;
        formElements.sniper.value = configuracoes.quantidade.sniper || 0;

        formElements.aplicarDesconto.checked = configuracoes.aplicarDesconto;
        if (configuracoes.aplicarDesconto) {
            formElements.descontoPredefinido.disabled = false;
            formElements.desconto.disabled = false;
        } else {
            formElements.descontoPredefinido.disabled = true;
            formElements.desconto.disabled = true;
        }

        formElements.descontoPredefinido.value = configuracoes.descontoPredefinido || "";
        formElements.desconto.value = configuracoes.desconto || "";

        formElements.valorDesejado.value = configuracoes.valorDesejado || "";
        formElements.tipoMunicao.value = configuracoes.tipoMunicao || "pistola";
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

window.onload = carregarConfiguracoes;