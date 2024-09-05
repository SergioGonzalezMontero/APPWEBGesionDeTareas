Los lenguajes utilizados han sido:

Front: HTML, CSS, Javascript
Back: Phyton


RESUMEN

Esta aplicación es un acceso WEB a un formulario, donde se guardan las gestiones realizadas, junto con el tiempo invertido en esa gestión.
Una vez se de a enviar, esto se registrará en una BBDD SQL y en dos excel diferentes (por seguidad) para el fÁcil acceso a la información 
de la persona que no tenga acceso a la BBDD

Registra diversas situaciones, con un buscador, analiza todos los campos antes de poder enviarlo, muestra las 2 ultimas gestiones para no repetir.

COMO ABRIR:

SIEMPRE QUE SE REINICIE EL SERVIDOR HAY QUE INICIAR LA APLICACIÓN O SE PUEDE PONER AUTOMÁTICAMENTE DESDE EL MISMO SERVIDOR
	1- Se abre el cmd
	2- Se introduce:
		C:\AplicacionGestionDeTareas\server\main.py
	3- Y ya se inicia el programa.
	4- comprobar el acceso al programa desde cualquier navegador fuera del servidor:
		192.168.1.201:5000

LOS REGISTROS SE GUARDAN EN DOS EXCELS Y EN LA BBDD DEL 201.
	Direcciones:
		servidor 201: C:\Users\Administrador (aquí se guardan en excels por horas, por si hubiera algún problema en alguno de lo excels)
		servidor 205: \\192.168.1.205\Tareas

	BBDD:
		BBDD 201: En la BBDD, en la tabla tareas.