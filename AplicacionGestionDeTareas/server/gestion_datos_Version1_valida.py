import os
import pandas as pd
from flask import Flask, request, jsonify
import logging

app = Flask(__name__)

# Configurar logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/guardar', methods=['POST'])
def guardar(data):
    try:
        # Recibir los datos del cliente
        logging.debug(f'Datos recibidos: {data}')

        # Definir el nombre del archivo Excel
        filename = 'datosGestionesAgentesIgnis.xlsx'
        logging.debug(f'Nombre del archivo: {filename}')

        # Crear un DataFrame con los datos recibidos
        df = pd.DataFrame([data])
        logging.debug(f'DataFrame creado: {df}')
        current_dir = os.getcwd()
        network_path = r'\\192.168.1.205\Gestion de Tareas\Aplicativo tareas fantasma'
        file_path = os.path.join(current_dir, filename)
        logging.debug(f'Directorio actual: {current_dir}')
        logging.debug(f'Path completo del archivo: {file_path}')

        if os.path.exists(filename):
            # Si el archivo existe, cargar el contenido existente y agregar los nuevos datos
            logging.debug('El archivo existe. Cargando datos existentes.')
            existing_data = pd.read_excel(filename)
            updated_data = pd.concat([existing_data, df], ignore_index=True)
            updated_data.to_excel(filename, index=False)
            logging.debug('Datos actualizados y guardados en el archivo existente.')
        else:
            # Si el archivo no existe, crearlo y agregar los datos y encabezados
            logging.debug('El archivo no existe. Creando un nuevo archivo.')
            df.to_excel(filename, index=False)
            logging.debug('Nuevo archivo creado y datos guardados.')

        # Guardar en la ubicación de red
        network_path = r'\\192.168.1.205\Gestion de Tareas\Aplicativo tareas fantasma'
        network_file_path = os.path.join(network_path, filename)
        logging.debug(f'Path completo del archivo en red: {network_file_path}')

        if os.path.exists(network_file_path):
            # Si el archivo en red existe, cargar el contenido existente y agregar los nuevos datos
            logging.debug('El archivo en red existe. Cargando datos existentes.')
            existing_data_network = pd.read_excel(network_file_path)
            updated_data_network = pd.concat([existing_data_network, df], ignore_index=True)
            updated_data_network.to_excel(network_file_path, index=False)
            logging.debug('Datos actualizados y guardados en el archivo en red.')
        else:
            # Si el archivo en red no existe, crearlo y agregar los datos y encabezados
            logging.debug('El archivo en red no existe. Creando un nuevo archivo.')
            df.to_excel(network_file_path, index=False)
            logging.debug('Nuevo archivo en red creado y datos guardados.')

        # Enviar una respuesta al cliente
        return {'message': 'Datos guardados correctamente'}
    except Exception as e:
        logging.error(f'Error al guardar los datos: {e}')
        return {'message': 'Error al guardar los datos'}, 500

if __name__ == '__main__':
    app.run(host='192.168.1.201', port=5000, debug=True)
