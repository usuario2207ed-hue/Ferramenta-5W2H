const rowCount = 10;
const tbody = document.getElementById('table-body');

function renderTable() {
    tbody.innerHTML = '';
    for (let i = 1; i <= rowCount; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="td-cell text-center font-bold text-gray-600">Ação ${i}</td>
            <td class="td-cell">
                <select class="w-full text-center bg-transparent outline-none text-xs font-semibold" name="status_${i}">
                    <option value="Backlog" selected>Backlog</option>
                    <option value="Em Andamento" style="color:orange">Em Andamento</option>
                    <option value="Concluído" style="color:green">Concluído</option>
                    <option value="Cancelado" style="color:red">Cancelado</option>
                </select>
            </td>
            <td class="td-cell"><input type="text" name="what_${i}" placeholder="Descreva..."></td>
            <td class="td-cell"><input type="text" name="why_${i}" placeholder="Motivo..."></td>
            <td class="td-cell"><input type="text" name="who_${i}" placeholder="Nome..."></td>
            <td class="td-cell"><input type="text" name="where_${i}" placeholder="Local..."></td>
            <td class="td-cell"><input type="date" name="when_start_${i}"></td>
            <td class="td-cell"><input type="date" name="when_end_${i}"></td>
            <td class="td-cell"><input type="date" name="when_done_${i}"></td>
            <td class="td-cell"><input type="text" name="how_${i}" placeholder="Como fazer..."></td>
            <td class="td-cell"><input type="text" name="how_much_${i}" placeholder="R$ 0,00"></td>
        `;
        tbody.appendChild(row);
    }
}

function saveToLocal() {
    const data = {};
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        if(input.id || input.name) {
            data[input.id || input.name] = input.value;
        }
    });

    localStorage.setItem('edcell_5w2h_data', JSON.stringify(data));
    updateStatus('Salvo no navegador.');
}

function loadFromLocal() {
    const saved = localStorage.getItem('edcell_5w2h_data');
    if (saved) {
        const data = JSON.parse(saved);
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            const key = input.id || input.name;
            if (data[key] !== undefined) {
                input.value = data[key];
            }
        });
        updateStatus('Dados recuperados.');
    }
}

function clearForm() {
    if(confirm("Tem certeza que deseja limpar todos os campos?")) {
        document.getElementById('form-5w2h').reset();
        document.getElementById('meta-responsavel').value = '';
        document.getElementById('meta-area').value = '';
        document.getElementById('meta-envolvidos').value = '';
        document.getElementById('meta-data').value = '';
        localStorage.removeItem('edcell_5w2h_data');
        updateStatus('Campos limpos.');
    }
}

function updateStatus(msg) {
    const el = document.getElementById('status-msg');
    el.innerText = msg;
    el.classList.add('text-[#67b7b2]');
    setTimeout(() => el.classList.remove('text-[#67b7b2]'), 2000);
}

function saveAndDownload() {
    saveToLocal();

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    csvContent += "ID;Status;O Que;Por Que;Quem;Onde;Inicio;Fim Previsto;Realizado;Como;Quanto\n";

    for (let i = 1; i <= rowCount; i++) {
        const rowData = [
            `Ação ${i}`,
            document.querySelector(`[name='status_${i}']`).value,
            document.querySelector(`[name='what_${i}']`).value,
            document.querySelector(`[name='why_${i}']`).value,
            document.querySelector(`[name='who_${i}']`).value,
            document.querySelector(`[name='where_${i}']`).value,
            document.querySelector(`[name='when_start_${i}']`).value,
            document.querySelector(`[name='when_end_${i}']`).value,
            document.querySelector(`[name='when_done_${i}']`).value,
            document.querySelector(`[name='how_${i}']`).value,
            document.querySelector(`[name='how_much_${i}']`).value
        ];

        const sanitizedRow = rowData.map(str => `"${str.replace(/"/g, '""')}"`).join(";");
        csvContent += sanitizedRow + "\n";
    }

    csvContent += `\nResponsável:;${document.getElementById('meta-responsavel').value}\n`;
    csvContent += `Área:;${document.getElementById('meta-area').value}\n`;
    csvContent += `Envolvidos:;${document.getElementById('meta-envolvidos').value}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = "Plano_Acao_EDCELL_" + new Date().toISOString().slice(0,10) + ".csv";
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    updateStatus('Download iniciado!');
}

function showNotification() {
    const notif = document.getElementById('windows-notification');
    notif.style.display = 'block';
    setTimeout(() => {
        notif.classList.add('show');
    }, 100);
}

function closeNotification() {
    const notif = document.getElementById('windows-notification');
    notif.classList.remove('show');
    setTimeout(() => {
        notif.style.display = 'none';
    }, 500);
}

window.onload = function() {
    renderTable();
    loadFromLocal();
    setTimeout(showNotification, 1500);

    document.body.addEventListener('input', function(e) {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            saveToLocal();
        }
    });
};
