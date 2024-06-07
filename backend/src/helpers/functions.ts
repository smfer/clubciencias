import { ValidatorError } from "./Error";

export const ValidarString = (campo: string, error: ValidatorError) => {
    if (typeof campo !== "string" || campo.trim().length < 1) throw error;
    return campo;
  };
export  const ValidarNumber = (campo: number, error: ValidatorError) => {
    if (typeof campo !== "number" || campo <= 0) throw error;
    return campo;
  };
  
  export const ValidateBolean =  (campo: boolean, error: ValidatorError) => {
    if (typeof campo !== "boolean" ) throw error;
    return campo;
  };
  