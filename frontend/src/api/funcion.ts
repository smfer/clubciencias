import { Method, Config, responseError } from "../types";
import { ApiError } from "../Error";

export const peticion = async <K, T extends Method>({
  url,
  base,
  body,
  headers,
  method,
  querys,
}: Config<T>) => {
  try {
    const urlServer =
      typeof base === "string" ? new URL(url, base) : new URL(url);



    if( querys && Object.keys( querys).length>= 1){
      for (const query in  querys) {
        urlServer.searchParams.append(query,querys[query])

        }
      }

    const respuesta = await fetch(urlServer.toString(), { body, headers, method });
    if (!respuesta.ok) {
      const apiError = (await respuesta.json()) as responseError;

      throw new ApiError({
        error: apiError.error,
        status: respuesta.status,
        code: apiError.codeError,
      });
    }

    return (await respuesta.json()) as K;
  } catch (error) {
    if(error instanceof ApiError) throw error

    throw new ApiError({
      error: "tuvimos un error en el servidor",
      status: 500,
      code: "500",
    });
  }
};
