document.getElementById('aplicarDesconto').addEventListener('change', function() {
    const descontoPredefinido = document.getElementById('descontoPredefinido');
    const desconto = document.getElementById('desconto');

    if (this.checked) {
        descontoPredefinido.disabled = false;
        desconto.disabled = false;
    } else {
        descontoPredefinido.disabled = true;
        desconto.disabled = true;
        descontoPredefinido.value = "";
        desconto.value = "";
    }
});

function calcular() {
    const precos = {
        pistola: 110000 / 100,
        fuzil: 72000 / 100,
        sub: 72000 / 100,
        escopeta: 165000 / 15,
        sniper: 700000 / 10
    };

    const quantidade = {
        pistola: parseInt(document.getElementById('pistola').value) || 0,
        fuzil: parseInt(document.getElementById('fuzil').value) || 0,
        sub: parseInt(document.getElementById('sub').value) || 0,
        escopeta: parseInt(document.getElementById('escopeta').value) || 0,
        sniper: parseInt(document.getElementById('sniper').value) || 0
    };

    let valido = true;
    let totalQuantidade = 0;

    for (let key in quantidade) {
        const input = document.getElementById(key);
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
    }

    if (totalQuantidade === 0) {
        document.getElementById('mensagemErro').innerText = "Por favor, insira pelo menos uma quantidade de munição.";
        return;
    } else {
        document.getElementById('mensagemErro').innerText = "";
    }

    if (!valido) {
        return;
    }

    let total = 
        (quantidade.pistola * precos.pistola) +
        (quantidade.fuzil * precos.fuzil) +
        (quantidade.sub * precos.sub) +
        (quantidade.escopeta * precos.escopeta) +
        (quantidade.sniper * precos.sniper);

    const aplicarDesconto = document.getElementById('aplicarDesconto').checked;
    const descontoPredefinido = document.getElementById('descontoPredefinido').value;
    const desconto = document.getElementById('desconto').value;

    let descontoPercentual = 0;
    if (aplicarDesconto) {
        if (descontoPredefinido) {
            descontoPercentual = parseFloat(descontoPredefinido);
        } else if (desconto) {
            descontoPercentual = parseFloat(desconto);
        }

        if (descontoPercentual < 0 || descontoPercentual > 100 || isNaN(descontoPercentual)) {
            const erroDesconto = document.getElementById('erroDesconto');
            erroDesconto.innerText = "Por favor, insira uma porcentagem de desconto válida entre 0 e 100.";
            document.getElementById('desconto').classList.add('invalid');
            return;
        } else {
            document.getElementById('erroDesconto').innerText = '';
            document.getElementById('desconto').classList.remove('invalid');
        }
    }

    if (descontoPercentual > 0) {
        total -= total * (descontoPercentual / 100);
    }

    document.getElementById('resultado').innerText = `Total: R$${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('mensagemSucesso').innerText = "Cálculo realizado com sucesso!";
    document.getElementById('mensagemSucesso').style.display = 'block';

    salvarConfiguracoes(quantidade, aplicarDesconto, descontoPredefinido, desconto);
}

function limpar() {
    document.getElementById('municaoForm').reset();
    document.getElementById('aplicarDesconto').checked = false;
    document.getElementById('descontoPredefinido').value = "";
    document.getElementById('desconto').value = "";
    document.getElementById('descontoPredefinido').disabled = true;
    document.getElementById('desconto').disabled = true;
    document.getElementById('resultado').innerText = "";
    document.getElementById('mensagemSucesso').innerText = "";
    document.getElementById('mensagemErro').innerText = "";
    document.querySelectorAll('input').forEach(input => input.classList.remove('invalid'));
    document.querySelectorAll('small.error-message').forEach(small => small.innerText = "");
    localStorage.removeItem('configuracoesMunicao');
}

function salvarConfiguracoes(quantidade, aplicarDesconto, descontoPredefinido, desconto) {
    const configuracoes = {
        quantidade,
        aplicarDesconto,
        descontoPredefinido,
        desconto
    };
    localStorage.setItem('configuracoesMunicao', JSON.stringify(configuracoes));
}

function carregarConfiguracoes() {
    const configuracoes = JSON.parse(localStorage.getItem('configuracoesMunicao'));
    if (configuracoes) {
        document.getElementById('pistola').value = configuracoes.quantidade.pistola || 0;
        document.getElementById('fuzil').value = configuracoes.quantidade.fuzil || 0;
        document.getElementById('sub').value = configuracoes.quantidade.sub || 0;
        document.getElementById('escopeta').value = configuracoes.quantidade.escopeta || 0;
        document.getElementById('sniper').value = configuracoes.quantidade.sniper || 0;

        document.getElementById('aplicarDesconto').checked = configuracoes.aplicarDesconto;
        const descontoPredefinido = document.getElementById('descontoPredefinido');
        const desconto = document.getElementById('desconto');

        if (configuracoes.aplicarDesconto) {
            descontoPredefinido.disabled = false;
            desconto.disabled = false;
        } else {
            descontoPredefinido.disabled = true;
            desconto.disabled = true;
        }

        descontoPredefinido.value = configuracoes.descontoPredefinido || "";
        desconto.value = configuracoes.desconto || "";
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

window.onload = carregarConfiguracoes;
