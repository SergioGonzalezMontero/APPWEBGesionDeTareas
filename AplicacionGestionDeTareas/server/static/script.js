$(document).ready(function() {
    // Función para agregar opciones al select con prefijo
    function addOption(select, value) {
        select.append(new Option(value, value));
    }

    // Select donde se agregarán las opciones
    const reasonSelect = $('#ticketSubject');

    // Opciones para Consulta
    const consultaOptions = [
        'Acceso a OV', 'Autoconsumo', 'Avería', 'Cargos/transferencia', 'Contrato',
        'Deuda', 'Duplicado de contrato', 'Duplicado de facturas', 'Factura', 'Ignis(wallet)',
        'Información(SVA)', 'Llamada de comercial/canal', 'Otros', 'Pago(tarjeta)', 'Renovación',
        'Solicitud contacto del comercial', 'Solicitud de oferta', 'Suministro(cortado)'
    ];

    // Opciones para Gestión
    const gestionOptions = [
        'Alta de SVA', 'Baja de SVA', 'Baja definitiva', 'Cambio a autoconsumo', 'Cambio de contador',
        'Cambio de cuenta bancaria', 'Cambio de datos de contacto', 'Cambio de datos de facturación',
        'Cambio de dirección del PS', 'Cambio de modalidad de facturación', 'Cambio de potencia', 'Cambio de producto',
        'Cambio de representante', 'Cambio de tarifa', 'Cambio de titular', 'Cambio potencia y titular',
        'Campaña mail erróneo', 'Desistimiento', 'Incidencias acceso OV', 'Incidencias con SVA',
        'Incluir/modificar autorizado', 'Nueva contratación', 'Otros', 'Paso de obra a definitivo', 'Reposición',
        'Solicitud de documentos/información'
    ];

    // Opciones para Reclamación
    const reclamacionOptions = [
        'Atención incorrecta del comercial', 'Atención incorrecta del SAC', 'Corte indebido', 'Devolución depósito distribuidora',
        'Duplicidad factura', 'Fraude/Inspección', 'Incidencia alquiler equipo de medida', 'Incidencia conceptos facturados',
        'Incidencia consumo', 'Incidencia en derechos, depósito', 'Incidencia equipo de medida', 'Incidencia excedentes',
        'Incidencia potencia', 'Incidencia precios facturados', 'Indemnización', 'Malas praxis', 'No recibe factura',
        'Otros', 'Pago duplicado', 'Permuta de contador', 'Privacidad de los datos', 'Remesar nuevamente', 'Retraso en activación contrato',
        'Retraso en activación de modificación', 'Retraso en baja definitiva', 'Retraso en corte', 'Retraso en desistimiento',
        'Retraso en reclamaciones/gestiones', 'Retraso en reenganche tras corte', 'Retraso facturación', 'Revisión línea de tensión',
        'Solicitud de aplazamiento', 'Solicitud de fraccionamiento', 'Solicitud precintado de contador'
    ];

    // Añadir opciones a los select con prefijo
    addOption(reasonSelect, "", "");
    addOption(reasonSelect, "0. INCIDENCIA");
    consultaOptions.forEach(option => addOption(reasonSelect, `1. Consulta - ${option}`));
    gestionOptions.forEach(option => addOption(reasonSelect, `2. Gestion - ${option}`));
    reclamacionOptions.forEach(option => addOption(reasonSelect, `3. Reclamacion - ${option}`));
	addOption(reasonSelect, "4. Gestion Interna BO (Solo BackOffice)");

    // Inicializar Select2
    reasonSelect.select2();
});


let timer;
let startTime;
let startedTime;
let endTime;
let pausedTime = 0;
let elapsedMilliseconds = 0;
let detalleTarea = document.getElementById('detalle-tarea');
let detalleTarea2 = document.getElementById('detalle-tarea2');




// Evento cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
    startTimer(); // Inicia automáticamente el contador al cargar la página
});

document.getElementById('endButton').addEventListener('click', endTimer);

function startTimer() {
    startedTime = Date.now();
    startTime = Date.now();
    timer = setInterval(updateTimer, 1000);
}





function endTimer() {
    console.log('entro en end timer');
    console.log(agentName);
    if(comprobarCampos()){

        clearInterval(timer);
        endTime = Date.now();
        pausedTime += endTime - startTime;

        saveDataToExcel();

        resetForm();

        startTimer();
        }

}

function comprobarCampos(){

    let agente = document.getElementById('agentName').value;
    let ticketNumber = document.getElementById('ticketNumber').value;
    let contratadoras = document.querySelectorAll('input[name="COMERCIALIZADORAS"]');
    let seleccionado = false;
    let comercializadora = '';
        // Itera sobre todos los botones de radio
    for (const radio of contratadoras) {
        if (radio.checked) {
            seleccionado = true;
            comercializadora = radio.value;
            break; // Sale del bucle si encuentra una opción seleccionada
        }
    }

    let asunto = document.getElementById('ticketSubject').value;

    let tipo = document.getElementById('transactionType').value
    let tiempoTicket = document.getElementById('tiempoTicket').value;

    if(agente.trim() === "VACIO"){
        mensajeError('Introduce el nombre del agente');
    }
    else if (ticketNumber.trim() === ""){
        mensajeError('Introduce el número del contrato');
    }
    else if (isNaN(ticketNumber)){
        mensajeError('El contrato debe de ser un número');
    }
    else if(!seleccionado){
        mensajeError('Selecciona una comercializadora');
    }
    else if(asunto.trim()===""){
        mensajeError('Selecciona un asunto');
    }
    else if(tipo.trim()===""){
        mensajeError('Selecciona un tipo');
    }
    else if(tiempoTicket.trim()===""){
        mensajeError('Introduce el tiempo invertido');
    }
    else if(isNaN(tiempoTicket)){
        mensajeError('El tiempo invertido debe de ser un número, en minutos');
    }
    else{
    // Actualiza el contenido de las celdas
        let ultimaGestionAnterior = detalleTarea.textContent;
        if(ultimaGestionAnterior!==""){
        // Actualiza el contenido de la penúltima gestión con el valor anterior de la última gestión
        detalleTarea2.textContent = ultimaGestionAnterior;
        }
		
		let ahora_hora = new Date();

        // Formatea la hora y los minutos en dos dígitos
        let horas_ahora = ahora_hora.getHours().toString().padStart(2, '0');
        let minutos_ahora = ahora_hora.getMinutes().toString().padStart(2, '0');

        // Combina la fecha y hora actual en un solo string
        let horaActual_ahora = `${horas_ahora}:${minutos_ahora}`;
		
        // Actualiza el contenido de la última gestión con la nueva información
        detalleTarea.textContent = `${comercializadora} - Contrato ${ticketNumber} - ${asunto} - ${tipo} - ${horaActual_ahora}`;

        return true;
    }
    return false;
}

function updateTimer() {
    let currentTime = Date.now();
    let totalElapsedTime = pausedTime + (currentTime - startTime);
    document.getElementById('timer').innerText = formatTime(totalElapsedTime);
}

function formatTime(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function saveDataToExcel() {

    let Agente = document.getElementById('agentName').value;
    let Fecha = getCurrentDate();
    let Inicio = new Date(startedTime).toLocaleString();
    let Fin = new Date(endTime).toLocaleString();
    let TiempoTotal = document.getElementById('timer').innerText;
	let TiempoTicket = document.getElementById('tiempoTicket').value;
    let Tipo = document.getElementById('transactionType').value;
    let NumeroContrato = document.getElementById('ticketNumber').value;
    let TicketAsunto = document.getElementById('ticketSubject').value;
    let Comercializadora = document.querySelectorAll('input[name="COMERCIALIZADORAS"]');
    let comercializadora = "";
        for (const radio of Comercializadora) {
        if (radio.checked) {
            seleccionado = true;
            comercializadora = radio.value;
            break; // Sale del bucle si encuentra una opción seleccionada
        }
    }
    let Observaciones = document.getElementById('OBSERVACIONES').value.toUpperCase();

    // Crear objeto con los datos
    let data = {
        Agente,
        Fecha,
        Inicio,
        Fin,
        TiempoTotal,
		TiempoTicket,
		NumeroContrato,
        Tipo,
        TicketAsunto,
        comercializadora,
        Observaciones
    };

    // Enviar los datos al servidor mediante una solicitud POST
    fetch('/guardar', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {

            return response.text().then(text => {

                throw new Error(`Error al guardar los datos: ${response.status} ${text}`);
            });
        }
    })
    .then(function(data) {
        console.log('Datos guardados correctamente:', data);
        Swal.fire({
        title: 'Éxito',
        text: 'Datos guardados correctamente.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
    })
    .catch(function(error) {
        console.error('Error:', error);
        // Muestra un mensaje de alerta al usuario
            Swal.fire({
        title: 'Error',
        html: 'Error al guardar, por favor:<br><br>1º Informa al supervisor<br>2º Guarda la información a parte.',
        icon: 'error',
        confirmButtonText: 'OK'
    });
    });
}

function resetForm() {
let mismoTicket = document.getElementById('mismoTicket').checked;

if(mismoTicket){
    document.getElementById('transactionType').value = "";
	document.getElementById('tiempoTicket').value = "";
    document.getElementById('OBSERVACIONES').value = "";
}else{
    //document.getElementById('agentName').value = "";
    document.getElementById('transactionType').value = "";
	document.getElementById('tiempoTicket').value = "";
    document.getElementById('ticketNumber').value = "";
    document.getElementById('ticketSubject').value = "";
    document.getElementById('OBSERVACIONES').value = "";
    const radios = document.querySelectorAll('input[name="COMERCIALIZADORAS"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
}
    // Detener y reiniciar temporizador
    clearInterval(timer);
    document.getElementById('timer').innerText = '00:00:00';
    pausedTime = 0;
    elapsedMilliseconds = 0;

}

function getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}


function mensajeError(mensaje){
    Swal.fire({
        title: 'Datos incompletos',
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}
function showAlert(message) {
            alert(message);
        }