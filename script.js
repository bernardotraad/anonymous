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
    calcular();
    calcularQuantidade();
});

const inputs = [
    document.getElementById('pistola'), document.getElementById('fuzil'), document.getElementById('sub'), document.getElementById('escopeta'),
    document.getElementById('sniper'), document.getElementById('desconto'), document.getElementById('valorDesejado'), document.getElementById('tipoMunicao')
];

inputs.forEach(input => {
    input.addEventListener('input', () => {
        calcular();
        calcularQuantidade();
    });
});

document.getElementById('descontoPredefinido').addEventListener('change', () => {
    calcular();
    calcularQuantidade();
});

function calcular() {
    const data = {
        pistola: document.getElementById('pistola').value,
        fuzil: document.getElementById('fuzil').value,
        sub: document.getElementById('sub').value,
        escopeta: document.getElementById('escopeta').value,
        sniper: document.getElementById('sniper').value,
        aplicarDesconto: document.getElementById('aplicarDesconto').checked,
        descontoPredefinido: document.getElementById('descontoPredefinido').value,
        desconto: document.getElementById('desconto').value
    };

    const precos = {
        pistola: 1100,
        fuzil: 720,
        sub: 720,
        escopeta: 11000,
        sniper: 70000
    };

    const quantidade = {
        pistola: parseInt(data.pistola) || 0,
        fuzil: parseInt(data.fuzil) || 0,
        sub: parseInt(data.sub) || 0,
        escopeta: parseInt(data.escopeta) || 0,
        sniper: parseInt(data.sniper) || 0
    };

    let total = 0;
    for (let key in quantidade) {
        total += quantidade[key] * precos[key];
    }

    let descontoPercentual = 0;
    if (data.aplicarDesconto) {
        if (data.descontoPredefinido) {
            descontoPercentual = parseFloat(data.descontoPredefinido);
        } else if (data.desconto) {
            descontoPercentual = parseFloat(data.desconto);
        }

        if (descontoPercentual > 0 && descontoPercentual <= 100) {
            total -= total * (descontoPercentual / 100);
        } else {
            descontoPercentual = 0; // Invalid discount; no discount applied
        }
    }

    document.getElementById('resultado').innerText = `Total: R$${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('mensagemSucesso').innerText = descontoPercentual > 0 ? "Cálculo realizado com desconto!" : "Cálculo realizado sem desconto!";
    document.getElementById('mensagemSucesso').style.display = 'block';
}


function calcularQuantidade() {
    const valorDesejado = parseFloat(document.getElementById('valorDesejado').value) || 0;
    const tipoMunicao = document.getElementById('tipoMunicao').value;

    if (valorDesejado <= 0 || isNaN(valorDesejado)) {
        document.getElementById('resultadoQuantidade').innerText = "Por favor, insira um valor válido.";
        return;
    }

    const precos = {
        pistola: 1100,
        fuzil: 720,
        sub: 720,
        escopeta: 11000,
        sniper: 70000
    };

    let precoPorUnidade = precos[tipoMunicao];

    let descontoPercentual = 0;
    if (document.getElementById('aplicarDesconto').checked) {
        const descontoPredefinido = parseFloat(document.getElementById('descontoPredefinido').value) || 0;
        const desconto = parseFloat(document.getElementById('desconto').value) || 0;

        if (descontoPredefinido > 0 && descontoPredefinido <= 100) {
            descontoPercentual = descontoPredefinido;
        } else if (desconto > 0 && desconto <= 100) {
            descontoPercentual = desconto;
        }

        if (descontoPercentual > 0 && descontoPercentual <= 100) {
            precoPorUnidade -= precoPorUnidade * (descontoPercentual / 100);
        } else {
            descontoPercentual = 0; // Invalid discount; no discount applied
        }
    }

    const quantidade = Math.floor(valorDesejado / precoPorUnidade);

    document.getElementById('resultadoQuantidade').innerText = `R$${valorDesejado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ${quantidade} muni de ${tipoMunicao} ${descontoPercentual > 0 ? 'com desconto aplicado.' : 'sem desconto aplicado.'}`;
}


function limpar() {
    document.getElementById('municaoForm').reset();
    document.getElementById('aplicarDesconto').checked = false;
    document.getElementById('descontoPredefinido').value = "";
    document.getElementById('desconto').value = "";
    document.getElementById('descontoPredefinido').disabled = true;
    document.getElementById('desconto').disabled = true;
    document.getElementById('valorDesejado').value = "";
    document.getElementById('tipoMunicao').value = "pistola";
    document.getElementById('resultado').innerText = "";
    document.getElementById('resultadoQuantidade').innerText = "";
    document.getElementById('mensagemSucesso').innerText = "";
    document.getElementById('mensagemErro').innerText = "";
    document.querySelectorAll('input').forEach(input => input.classList.remove('invalid'));
    document.querySelectorAll('small.error-message').forEach(small => small.innerText = "");
}
