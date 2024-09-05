import win32serviceutil
import win32service
import win32event
import servicemanager
import logging
import subprocess
import pyodbc

# Configuración del logging
logging.basicConfig(
    filename='AplicacionGestionDeTareas\\server\\servicio.log',
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

class MyService(win32serviceutil.ServiceFramework):
    _svc_name_ = "ServicioProgramaIgnisTareasFantasma"
    _svc_display_name_ = "Servicio Gestion TAREAS"
    _svc_description_ = "Servicio para ejecutar el main de gestion de tareas para guardar los registros."

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)
        logging.info('Servicio inicializado')

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.hWaitStop)
        logging.info('Servicio detenido')

    def SvcDoRun(self):
        servicemanager.LogMsg(servicemanager.EVENTLOG_INFORMATION_TYPE,
                              servicemanager.PYS_SERVICE_STARTED,
                              (self._svc_name_, ''))
        logging.info('Servicio iniciado')
        self.main()

    def main(self):
        try:
            # Ejecutar el script Python usando subprocess
            logging.info('Ejecutando el programa principal')
            result = subprocess.run(
                ["python", "C:\\1.AplicacionIGNISTicketsMails\\server\\main.py"],
                capture_output=True,
                text=True
            )
            logging.info(f'Programa principal ejecutado con código de salida {result.returncode}')
            logging.info(f'Salida estándar: {result.stdout}')
            if result.stderr:
                logging.error(f'Error estándar: {result.stderr}')
        except Exception as e:
            logging.error(f'Error ejecutando el programa principal: {e}')

if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(MyService)


