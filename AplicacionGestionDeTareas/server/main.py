import os
from flask import Flask, render_template, request, jsonify
from gestion_datos import guardar  # Importa la función `guardar` del módulo gestion_datos
from gestion_datosBBDD import guardarBBDD

# Define la ruta base del directorio del proyecto
base_dir = os.path.abspath(os.path.dirname(__file__))
print(f"Directorio actual de trabajo: {os.getcwd()}")  # Imprime el directorio actual de trabajo
print(f"Directorio base del proyecto: {base_dir}")  # Imprime el directorio base del proyecto

# Configura Flask para utilizar las carpetas relativas a base_dir
app = Flask(__name__,
            template_folder=os.path.join(base_dir, 'templates'),
            static_folder=os.path.join(base_dir, 'static'))


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
   # app.run(debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)


#if __name__ == '__main__':
@app.route('/guardar', methods=['POST'])
def guardar_route():
    try:
        # Utiliza request.get_json() para obtener los datos enviados desde el cliente
        data = request.get_json()

        # Llama a la función `guardar` importada, pasando los datos recibidos
        response_guardar = guardar(data)

        # Llama a la función `guardarBBDD` importada, pasando los datos recibidos
        response_guardarBBDD = guardarBBDD(data)

        # Devuelve la respuesta al cliente
        return jsonify({'message': 'Datos guardados correctamente'})

    except Exception as e:
        # Manejar cualquier excepción que pueda ocurrir
        error_message = f'Error al procesar los datos: {str(e)}'
        return jsonify({'error': error_message}), 500
#    app.run(host='192.168.1.201', port=5000, debug=True)