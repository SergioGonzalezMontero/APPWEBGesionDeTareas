import pyodbc
import logging

# Configuración del logging
logging.basicConfig(
    filename='C:\\AplicacionGestionDeTareas\\server\\servicio.log',
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def guardarBBDD(data):
    # Configuración de conexión a SQL Server
    conn_str = (
        r'DRIVER={SQL Server};'
        r'SERVER=192.168.1.201;'
        r'DATABASE=CREADORSERGIOGONZALEZ;'
        r'UID=sa;'
        r'PWD=CONTRASENIA;'
    )

    try:
        # Establecer la conexión a la base de datos
        with pyodbc.connect(conn_str) as conn:
            with conn.cursor() as cursor:
                # Obtener los valores de cada campo del JSON recibido
                Agente = data.get('Agente')
                Fecha = data.get('Fecha')
                Inicio = data.get('Inicio')
                Fin = data.get('Fin')
                TiempoTotal = data.get('TiempoTotal', None)  # Ajustar según los campos que recibas
                TiempoTicket = data.get('TiempoTicket', None)
                Tipo = data.get('Tipo')
                NumeroContrato = data.get('NumeroContrato')
                Asunto = data.get('TicketAsunto')
                Comercializadora = data.get('comercializadora')
                Observaciones = data.get('Observaciones')

                # Registrar los datos que se intentarán guardar
                logging.info(f'Intentando guardar datos en la BBDD: {data}')

                # Ejecutar la consulta INSERT en la tabla Tareas_Fantasma
                cursor.execute('''
                    INSERT INTO Tareas_Fantasma (Agente, Fecha, Inicio, Fin, TiempoTotal, TiempoTicket, Comercializadora, NumeroContrato, Tipo, Asunto, Observaciones)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', Agente, Fecha, Inicio, Fin, TiempoTotal, TiempoTicket, Comercializadora, NumeroContrato, Tipo, Asunto, Observaciones)

                # Confirmar la transacción
                conn.commit()

        # Registrar éxito en la inserción
        logging.info('Datos guardados correctamente en SQL Server')
        # Devolver un mensaje de éxito
        return {'message': 'Datos guardados correctamente en SQL Server'}

    except Exception as e:
        # Manejar cualquier excepción que pueda ocurrir
        error_message = f'Error al guardar los datos en SQL Server: {str(e)}'
        logging.error(error_message)
        # Devolver el mensaje de error
        return {'error': error_message}
