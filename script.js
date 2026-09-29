// ==========================================================
// UTILIDADES COMUNES Y FORMATEADORES
// ==========================================================

function formatMoney(amount) {
    if (isNaN(amount)) return "$0";
    const sign = amount < 0 ? "-" : "";
    const absVal = Math.round(Math.abs(amount));
    return sign + "$" + absVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseInputNumber(id) {
    const el = document.getElementById(id);
    if (!el) return NaN;
    const raw = el.value.toString().replace(/\./g, '').replace(/,/g, '').trim();
    return parseInt(raw, 10);
}

function validarCampo(id, valUsuario, valReal) {
    const el = document.getElementById(id);
    if (!el) return 0;
    if (isNaN(valUsuario)) {
        el.classList.add('is-invalid');
        el.classList.remove('is-valid');
        return 0;
    }
    if (Math.abs(valUsuario - Math.round(valReal)) <= 2) {
        el.classList.add('is-valid');
        el.classList.remove('is-invalid');
        return 1;
    } else {
        el.classList.add('is-invalid');
        el.classList.remove('is-valid');
        return 0;
    }
}

function mostrarInteractivo(mod) {
    document.getElementById(mod + '-panel-eval').style.display = 'block';
    document.getElementById(mod + '-sol-card').style.display = 'none';
    document.getElementById(mod + '-panel-eval').scrollIntoView({ behavior: 'smooth' });
}

function mostrarSolucion(mod) {
    document.getElementById(mod + '-sol-card').style.display = 'block';
    document.getElementById(mod + '-sol-card').scrollIntoView({ behavior: 'smooth' });
}

function renderFeedback(msgElementId, score, total) {
    const msg = document.getElementById(msgElementId);
    msg.style.display = 'block';
    if (score === total) {
        msg.innerHTML = `<div class="alert alert-success d-flex align-items-center mb-0">
            <span class="fs-2 me-3">🏆</span>
            <div><strong>¡Excelente! ${score}/${total} aciertos.</strong> Has dominado esta sección.</div>
        </div>`;
    } else {
        msg.innerHTML = `<div class="alert alert-warning d-flex align-items-center mb-0">
            <span class="fs-2 me-3">⚠️</span>
            <div><strong>Obtuviste ${score}/${total} aciertos.</strong> Revisa los campos resaltados en rojo o consulta la solución explicada.</div>
        </div>`;
    }
}

// ==========================================================
// SESIÓN 1: TRATAMIENTO DE IVA (19%) Y F29
// ==========================================================
let s1Data = {};

function generarS1() {
    document.getElementById('s1-sol-card').style.display = 'none';
    document.getElementById('s1-panel-eval').style.display = 'none';
    document.getElementById('s1-eval-msg').style.display = 'none';

    ['s1-in-neto', 's1-in-debito', 's1-in-credito', 's1-in-saldo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('is-valid', 'is-invalid'); }
    });

    const netVentas = (Math.floor(Math.random() * 8) + 30) * 1000000;
    const debito = netVentas * 0.19;
    const brutoVentas = netVentas + debito;

    const netCompras = (Math.floor(Math.random() * 5) + 15) * 1000000;
    const credito = netCompras * 0.19;
    const brutoCompras = netCompras + credito;

    const saldoIva = debito - credito;

    s1Data = { netVentas, debito, brutoVentas, netCompras, credito, brutoCompras, saldoIva };

    document.getElementById('s1-enunciado').innerHTML = `
        Durante el mes comercial, una empresa registra ventas brutas totales por <strong>${formatMoney(brutoVentas)}</strong> y compras netas por <strong>${formatMoney(netCompras)}</strong> (ambas afectas a IVA del 19%).<br><br>
        <strong>Se solicita:</strong><br>
        a) Determinar el <strong>Valor Neto de las Ventas</strong> desglosando el IVA.<br>
        b) Obtener el <strong>Débito Fiscal</strong> generado por las ventas.<br>
        c) Calcular el <strong>Crédito Fiscal</strong> originado por las compras.<br>
        d) Establecer el <strong>Saldo de IVA a Pagar</strong> en el F29 del mes siguiente.
    `;

    document.getElementById('s1-sol-box-ventas').innerHTML = `
        <div><strong>Fórmula:</strong> Valor Neto = Valor Bruto / 1,19</div>
        <div><strong>Cálculo:</strong> ${formatMoney(brutoVentas)} / 1,19 = <strong class="text-primary">${formatMoney(netVentas)}</strong></div>
        <div class="mt-1"><strong>Débito Fiscal:</strong> ${formatMoney(netVentas)} &times; 19% = <strong class="text-danger">${formatMoney(debito)}</strong> (O bien: Bruto - Neto)</div>
    `;

    document.getElementById('s1-sol-box-compras').innerHTML = `
        <div><strong>Fórmula:</strong> Crédito Fiscal = Valor Neto Compras &times; 19%</div>
        <div><strong>Cálculo:</strong> ${formatMoney(netCompras)} &times; 0,19 = <strong class="text-success">${formatMoney(credito)}</strong></div>
        <div class="mt-1"><strong>Total Compras Brutas:</strong> ${formatMoney(netCompras)} + ${formatMoney(credito)} = ${formatMoney(brutoCompras)}</div>
    `;

    document.getElementById('s1-sol-box-liq').innerHTML = `
        <div><strong>Fórmula:</strong> Saldo IVA = Débito Fiscal - Crédito Fiscal</div>
        <div><strong>Cálculo:</strong> ${formatMoney(debito)} - ${formatMoney(credito)}</div>
        <div class="mt-2 text-danger res-highlight">Saldo IVA a Pagar en Caja = ${formatMoney(saldoIva)}</div>
    `;
}

function evaluarS1() {
    const userNeto = parseInputNumber('s1-in-neto');
    const userDeb = parseInputNumber('s1-in-debito');
    const userCred = parseInputNumber('s1-in-credito');
    const userSaldo = parseInputNumber('s1-in-saldo');

    let score = 0;
    score += validarCampo('s1-in-neto', userNeto, s1Data.netVentas);
    score += validarCampo('s1-in-debito', userDeb, s1Data.debito);
    score += validarCampo('s1-in-credito', userCred, s1Data.credito);
    score += validarCampo('s1-in-saldo', userSaldo, s1Data.saldoIva);

    renderFeedback('s1-eval-msg', score, 4);
}

// ==========================================================
// SESIÓN 2: CÉDULA DE COBRANZAS
// ==========================================================
let s2Data = {};

function generarS2() {
    document.getElementById('s2-sol-card').style.display = 'none';
    document.getElementById('s2-panel-eval').style.display = 'none';
    document.getElementById('s2-eval-msg').style.display = 'none';

    ['s2-in-c-oct', 's2-in-c-sep', 's2-in-c-ago', 's2-in-c-tot'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('is-valid', 'is-invalid'); }
    });

    const netAgo = (Math.floor(Math.random() * 5) + 30) * 1000000;
    const netSep = netAgo + 1000000;
    const netOct = netSep + 3000000;

    const bAgo = netAgo * 1.19;
    const bSep = netSep * 1.19;
    const bOct = netOct * 1.19;

    const cOct = bOct * 0.50;
    const cSep = bSep * 0.25;
    const cAgo = bAgo * 0.25;
    const cTot = cOct + cSep + cAgo;

    s2Data = { bAgo, bSep, bOct, cOct, cSep, cAgo, cTot };

    document.getElementById('s2-enunciado').innerHTML = `
        La empresa <strong>Tecnología Ltda.</strong> mantiene la siguiente política de cobranza sobre sus ventas brutas:<br>
        • <strong>50% al contado</strong> (en el mes de la venta).<br>
        • <strong>25% a 30 días</strong> (en el mes siguiente).<br>
        • <strong>25% a 60 días</strong> (dos meses después).<br><br>
        Las ventas brutas proyectadas son: <strong>Agosto: ${formatMoney(bAgo)}</strong> | <strong>Septiembre: ${formatMoney(bSep)}</strong> | <strong>Octubre: ${formatMoney(bOct)}</strong>.<br>
        <em>Determine la recaudación de caja efectiva que ingresará durante el mes de Octubre.</em>
    `;

    document.getElementById('s2-sol-tabla').innerHTML = `
        <tr>
            <td class="text-start">Ventas Contado Octubre</td>
            <td>${formatMoney(bOct)} &times; 50%</td>
            <td class="fw-bold">${formatMoney(cOct)}</td>
        </tr>
        <tr>
            <td class="text-start">Recuperación 30 días (Ventas Septiembre)</td>
            <td>${formatMoney(bSep)} &times; 25%</td>
            <td class="fw-bold">${formatMoney(cSep)}</td>
        </tr>
        <tr>
            <td class="text-start">Recuperación 60 días (Ventas Agosto)</td>
            <td>${formatMoney(bAgo)} &times; 25%</td>
            <td class="fw-bold">${formatMoney(cAgo)}</td>
        </tr>
    `;

    document.getElementById('s2-sol-box-tot').innerHTML = `
        <div><strong>Total Recaudación Efectiva Octubre:</strong> ${formatMoney(cOct)} + ${formatMoney(cSep)} + ${formatMoney(cAgo)}</div>
        <div class="mt-2 text-primary res-highlight">Total Ingreso por Ventas = ${formatMoney(cTot)}</div>
    `;
}

function evaluarS2() {
    const userOct = parseInputNumber('s2-in-c-oct');
    const userSep = parseInputNumber('s2-in-c-sep');
    const userAgo = parseInputNumber('s2-in-c-ago');
    const userTot = parseInputNumber('s2-in-c-tot');

    let score = 0;
    score += validarCampo('s2-in-c-oct', userOct, s2Data.cOct);
    score += validarCampo('s2-in-c-sep', userSep, s2Data.cSep);
    score += validarCampo('s2-in-c-ago', userAgo, s2Data.cAgo);
    score += validarCampo('s2-in-c-tot', userTot, s2Data.cTot);

    renderFeedback('s2-eval-msg', score, 4);
}

// ==========================================================
// SESIÓN 3: SUELDOS E IMPOSICIONES
// ==========================================================
let s3Data = {};

function generarS3() {
    document.getElementById('s3-sol-card').style.display = 'none';
    document.getElementById('s3-panel-eval').style.display = 'none';
    document.getElementById('s3-eval-msg').style.display = 'none';

    ['s3-in-liq-oct', 's3-in-imp-pag', 's3-in-tot-sueldos'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('is-valid', 'is-invalid'); }
    });

    const sueldoSep = (Math.floor(Math.random() * 4) + 5) * 1000000;
    const sueldoOct = sueldoSep + 1000000;

    const liqOct = sueldoOct * 0.80;
    const impSepPagada = sueldoSep * 0.20;
    const totDesembolso = liqOct + impSepPagada;

    s3Data = { sueldoSep, sueldoOct, liqOct, impSepPagada, totDesembolso };

    document.getElementById('s3-enunciado').innerHTML = `
        La nómina de sueldos brutos es: <strong>Septiembre: ${formatMoney(sueldoSep)}</strong> y <strong>Octubre: ${formatMoney(sueldoOct)}</strong>.<br>
        Las imposiciones previsionales corresponden al <strong>20% del sueldo bruto</strong> y se pagan al mes siguiente. El <strong>80% restante (líquido)</strong> se paga a los trabajadores al finalizar el mes en curso.<br><br>
        <em>Determine los egresos reales de caja en Octubre por concepto de sueldos e imposiciones.</em>
    `;

    document.getElementById('s3-sol-box-sueldos').innerHTML = `
        <div>• <strong>Sueldo Líquido Octubre:</strong> ${formatMoney(sueldoOct)} &times; 80% = <strong class="text-primary">${formatMoney(liqOct)}</strong> (Pagado a los empleados en Octubre).</div>
        <div>• <strong>Imposiciones retenidas en Septiembre:</strong> ${formatMoney(sueldoSep)} &times; 20% = <strong class="text-danger">${formatMoney(impSepPagada)}</strong> (Desembolsadas al Fisco/Previred en Octubre).</div>
    `;

    document.getElementById('s3-sol-box-res').innerHTML = `
        <div><strong>Total Egresos en Octubre:</strong> ${formatMoney(liqOct)} + ${formatMoney(impSepPagada)}</div>
        <div class="mt-2 text-danger res-highlight">Total Desembolso = ${formatMoney(totDesembolso)}</div>
    `;
}

function evaluarS3() {
    const userLiq = parseInputNumber('s3-in-liq-oct');
    const userImp = parseInputNumber('s3-in-imp-pag');
    const userTot = parseInputNumber('s3-in-tot-sueldos');

    let score = 0;
    score += validarCampo('s3-in-liq-oct', userLiq, s3Data.liqOct);
    score += validarCampo('s3-in-imp-pag', userImp, s3Data.impSepPagada);
    score += validarCampo('s3-in-tot-sueldos', userTot, s3Data.totDesembolso);

    renderFeedback('s3-eval-msg', score, 3);
}

// ==========================================================
// SESIÓN 4: PRESUPUESTO MAESTRO COMPLETO (2 O 3 MESES)
// ==========================================================
let mesesProyeccion = 2; // Por defecto 2 meses (Oct, Nov)
let s4Data = {};

function cambiarMeses(n) {
    mesesProyeccion = n;
    generarS4();
}

function generarS4() {
    document.getElementById('s4-sol-card').style.display = 'none';
    document.getElementById('s4-panel-eval').style.display = 'none';
    document.getElementById('s4-eval-msg').style.display = 'none';

    // Definición de nombres de meses
    // Índices base: 0: Agosto, 1: Septiembre (históricos).
    // Proyección: 2: Octubre, 3: Noviembre, 4: Diciembre (si aplica)
    const nombresMeses = mesesProyeccion === 2 
        ? ["Agosto", "Septiembre", "Octubre", "Noviembre"] 
        : ["Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const totalMeses = nombresMeses.length;

    // Generar Ventas Netas con aleatoriedad (múltiplos de 1.000.000)
    const baseVenta = (Math.floor(Math.random() * 8) + 28) * 1000000;
    const netV = [];
    for (let i = 0; i < totalMeses; i++) {
        const incremento = i * (Math.floor(Math.random() * 3) + 2) * 1000000;
        netV.push(baseVenta + incremento);
    }

    const ivaV = netV.map(v => Math.round(v * 0.19));
    const brutV = netV.map((v, i) => v + ivaV[i]);

    // Compras Brutas (50% de las ventas brutas)
    const brutC = brutV.map(b => b * 0.50);
    const netC = brutC.map(b => Math.round(b / 1.19));
    const ivaC = brutC.map((b, i) => b - netC[i]);

    // Sueldos Brutos variables
    const baseSueldo = (Math.floor(Math.random() * 4) + 4) * 1000000;
    const sBruto = [];
    for (let i = 0; i < totalMeses; i++) {
        sBruto.push(baseSueldo + i * 1000000);
    }
    const sImp = sBruto.map(s => s * 0.20);
    const sLiq = sBruto.map(s => s * 0.80);

    // Saldo IVA por mes (a pagar al mes subsiguiente)
    const ivaSaldo = ivaV.map((deb, i) => deb - ivaC[i]);

    // Costos fijos y saldo inicial variables
    const gastosAdmin = (Math.floor(Math.random() * 6) + 10) * 100000;
    const seguro = (Math.floor(Math.random() * 4) + 2) * 50000;
    const arriendoIngreso = (Math.floor(Math.random() * 5) + 5) * 100000;
    const saldoInicialOct = (Math.floor(Math.random() * 10) + 8) * 100000;

    // Calcular flujos para los meses proyectados (a partir de índice 2: Octubre)
    const columnas = [];
    let saldoInicialActual = saldoInicialOct;

    for (let idx = 2; idx < totalMeses; idx++) {
        const mesNombre = nombresMeses[idx];

        // Ingresos
        const vContado = brutV[idx] * 0.50;
        const v30dias = brutV[idx - 1] * 0.25;
        const v60dias = brutV[idx - 2] * 0.25;
        const totalIngresos = vContado + v30dias + v60dias + arriendoIngreso;

        // Egresos
        const cContado = brutC[idx] * 0.50;
        const c30dias = brutC[idx - 1] * 0.25;
        const c60dias = brutC[idx - 2] * 0.25;
        const sueldoLiq = sLiq[idx];
        const imposiciones = sImp[idx - 1]; // Del mes anterior
        const saldoIvaMesAnt = ivaSaldo[idx - 1]; // Del mes anterior

        const totalEgresos = cContado + c30dias + c60dias + gastosAdmin + seguro + sueldoLiq + imposiciones + saldoIvaMesAnt;
        const flujoNeto = totalIngresos - totalEgresos;
        const saldoFinal = saldoInicialActual + flujoNeto;

        columnas.push({
            mesNombre,
            saldoInicial: saldoInicialActual,
            vContado,
            v30dias,
            v60dias,
            totalIngresos,
            cContado,
            c30dias,
            c60dias,
            sueldoLiq,
            imposiciones,
            saldoIvaMesAnt,
            totalEgresos,
            flujoNeto,
            saldoFinal
        });

        // El saldo final se convierte en el saldo inicial del mes siguiente
        saldoInicialActual = saldoFinal;
    }

    s4Data = {
        nombresMeses,
        mesesProyeccion,
        gastosAdmin,
        seguro,
        arriendoIngreso,
        brutV,
        brutC,
        sBruto,
        columnas
    };

    // Actualizar Título
    document.getElementById('s4-titulo-sesion').textContent = `Sesión 4: Presupuesto de Caja Completo (${mesesProyeccion === 2 ? 'Octubre y Noviembre' : 'Octubre, Noviembre y Diciembre'})`;

    // Renderizar enunciado dinámico
    const ventasTxt = nombresMeses.map((m, i) => `<strong>${m}:</strong> ${formatMoney(brutV[i])}`).join(', ');
    const sueldosTxt = nombresMeses.map((m, i) => `<strong>${m}:</strong> ${formatMoney(sBruto[i])}`).join(', ');

    document.getElementById('s4-enunciado').innerHTML = `
        Construya el Presupuesto de Caja para <strong>${mesesProyeccion === 2 ? 'los meses de Octubre y Noviembre' : 'los meses de Octubre, Noviembre y Diciembre'}</strong> de la empresa <strong>Tecnología Ltda.</strong> con la siguiente información:<br><br>
        1. <strong>Ventas brutas proyectadas:</strong> ${ventasTxt}.<br>
        2. <strong>Política de cobro de las ventas:</strong> 50% al contado, 25% a 30 días y 25% a 60 días.<br>
        3. <strong>Compras brutas:</strong> Corresponden al 50% de las ventas brutas y se cancelarán con la misma política que las ventas (50% contado, 25% a 30 días y 25% a 60 días).<br>
        4. <strong>Costos fijos de administración:</strong> ${formatMoney(gastosAdmin)} mensuales.<br>
        5. <strong>Seguro pagado mensual:</strong> ${formatMoney(seguro)}.<br>
        6. <strong>Sueldos mensuales brutos:</strong> ${sueldosTxt}. Las imposiciones son 20% (se pagan al mes siguiente) y el Líquido es 80% (se paga en el mes).<br>
        7. <strong>Ingreso por arriendo de galpón:</strong> Pagan a la empresa ${formatMoney(arriendoIngreso)} mensual.<br>
        8. <strong>Saldo final de caja al cierre de Septiembre (Inicial de Octubre):</strong> ${formatMoney(saldoInicialOct)}.<br>
        9. <strong>IVA (19%):</strong> Ventas y compras afectas a 19%. La diferencia entre Débito Fiscal y Crédito Fiscal se declara y paga en la caja del mes posterior.
    `;

    // Generar Inputs interactivos dinámicamente
    renderInputsS4();

    // Generar Tabla de Solución
    renderSolucionS4();
}

function renderInputsS4() {
    const container = document.getElementById('s4-inputs-dinamicos');
    let html = '';

    s4Data.columnas.forEach((col, idx) => {
        html += `
            <div class="col-md-${mesesProyeccion === 2 ? '6' : '4'}">
                <div class="card p-2 bg-white border">
                    <span class="badge bg-primary mb-2">${col.mesNombre}</span>
                    <label class="form-label small fw-bold">Total Ingresos ($)</label>
                    <input type="text" id="s4-in-ing-${idx}" class="form-control form-control-sm mb-2" placeholder="Total Ingresos">
                    
                    <label class="form-label small fw-bold">Total Egresos ($)</label>
                    <input type="text" id="s4-in-egr-${idx}" class="form-control form-control-sm mb-2" placeholder="Total Egresos">
                    
                    <label class="form-label small fw-bold">Saldo Final Caja ($)</label>
                    <input type="text" id="s4-in-sfin-${idx}" class="form-control form-control-sm" placeholder="Saldo Final">
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderSolucionS4() {
    const thead = document.getElementById('s4-tabla-head');
    let theadHtml = '<tr><th class="text-start">ITEM / CONCEPTO</th>';
    s4Data.columnas.forEach(col => {
        theadHtml += `<th class="text-uppercase">${col.mesNombre}</th>`;
    });
    theadHtml += '</tr>';
    thead.innerHTML = theadHtml;

    const tbody = document.getElementById('s4-tabla-caja');
    const cols = s4Data.columnas;

    let bodyHtml = `
        <tr class="table-primary fw-bold">
            <td class="text-start">Saldo Inicial</td>
            ${cols.map(c => `<td>${formatMoney(c.saldoInicial)}</td>`).join('')}
        </tr>
        <tr class="table-light text-start fw-bold">
            <td colspan="${cols.length + 1}"><i class="bi bi-arrow-down-right-circle text-success me-1"></i> INGRESOS</td>
        </tr>
        <tr>
            <td class="text-start ps-4">Ventas Contado (50%)</td>
            ${cols.map(c => `<td>${formatMoney(c.vContado)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Ventas 30 días (25%)</td>
            ${cols.map(c => `<td>${formatMoney(c.v30dias)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Ventas 60 días (25%)</td>
            ${cols.map(c => `<td>${formatMoney(c.v60dias)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Arriendo Galpón</td>
            ${cols.map(() => `<td>${formatMoney(s4Data.arriendoIngreso)}</td>`).join('')}
        </tr>
        <tr class="table-info fw-bold">
            <td class="text-start">TOTAL INGRESOS</td>
            ${cols.map(c => `<td>${formatMoney(c.totalIngresos)}</td>`).join('')}
        </tr>
        <tr class="table-light text-start fw-bold">
            <td colspan="${cols.length + 1}"><i class="bi bi-arrow-up-right-circle text-danger me-1"></i> EGRESOS</td>
        </tr>
        <tr>
            <td class="text-start ps-4">Compras Contado (50%)</td>
            ${cols.map(c => `<td>${formatMoney(c.cContado)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Compras 30 días (25%)</td>
            ${cols.map(c => `<td>${formatMoney(c.c30dias)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Compras 60 días (25%)</td>
            ${cols.map(c => `<td>${formatMoney(c.c60dias)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Costos de Administración</td>
            ${cols.map(() => `<td>${formatMoney(s4Data.gastosAdmin)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Seguro</td>
            ${cols.map(() => `<td>${formatMoney(s4Data.seguro)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Sueldo Líquido (80%)</td>
            ${cols.map(c => `<td>${formatMoney(c.sueldoLiq)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Imposiciones (20% mes anterior)</td>
            ${cols.map(c => `<td>${formatMoney(c.imposiciones)}</td>`).join('')}
        </tr>
        <tr>
            <td class="text-start ps-4">Saldo de IVA (mes anterior)</td>
            ${cols.map(c => `<td>${formatMoney(c.saldoIvaMesAnt)}</td>`).join('')}
        </tr>
        <tr class="table-warning fw-bold">
            <td class="text-start">TOTAL EGRESOS</td>
            ${cols.map(c => `<td>${formatMoney(c.totalEgresos)}</td>`).join('')}
        </tr>
        <tr class="table-secondary">
            <td class="text-start">Flujo Neto (Ingresos - Egresos)</td>
            ${cols.map(c => `<td>${formatMoney(c.flujoNeto)}</td>`).join('')}
        </tr>
        <tr class="table-success fw-bold fs-6">
            <td class="text-start">SALDO FINAL DE CAJA</td>
            ${cols.map(c => `<td>${formatMoney(c.saldoFinal)}</td>`).join('')}
        </tr>
    `;

    tbody.innerHTML = bodyHtml;
}

function evaluarS4() {
    let score = 0;
    const totalCampos = s4Data.columnas.length * 3;

    s4Data.columnas.forEach((col, idx) => {
        const uIng = parseInputNumber(`s4-in-ing-${idx}`);
        const uEgr = parseInputNumber(`s4-in-egr-${idx}`);
        const uSfin = parseInputNumber(`s4-in-sfin-${idx}`);

        score += validarCampo(`s4-in-ing-${idx}`, uIng, col.totalIngresos);
        score += validarCampo(`s4-in-egr-${idx}`, uEgr, col.totalEgresos);
        score += validarCampo(`s4-in-sfin-${idx}`, uSfin, col.saldoFinal);
    });

    renderFeedback('s4-eval-msg', score, totalCampos);
}

// ==========================================================
// INICIALIZACIÓN GLOBAL
// ==========================================================
window.onload = function() {
    generarS1();
    generarS2();
    generarS3();
    generarS4();
};