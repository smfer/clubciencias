// src/ErrorPage.js

import {  useRouteError } from 'react-router-dom';
import { ApiError } from '../../Error';

const errorMessages: { [k: number]: string } = {
  500: 'Error interno del servidor (500).',
  401: 'Acceso no autorizado (401). Redirigiendo a la página de inicio de sesión...',
  403: 'Acceso prohibido (403).',
};

const ErrorPage = () => {
  const error = useRouteError() as ApiError | unknown;
  console.log(error)
  const errorMessage: string = error instanceof ApiError ? errorMessages[error.status] : 'Se ha producido un error desconocido.';


  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div className="bg-gray-700 p-8 rounded shadow-md">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-gray-300">{errorMessage}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
