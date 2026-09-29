import { useState } from "react";
import api from "../services/api";

function ModeratorPage() {

  const [resultado, setResultado] =
    useState("");

  const probarAcceso = async () => {

    try {

      const response =
        await api.get(
          "/test/mod"
        );

      setResultado(
        response.data
      );

    } catch (error) {

      setResultado(
        error.response?.data?.message ||
        "Acceso denegado."
      );
    }
  };


  return (

    <div className="page-container">

      <div className="card">

        <h1>
          Panel de Moderador
        </h1>

        <p>
          Contenido exclusivo para
          moderadores.
        </p>

        <button
          onClick={probarAcceso}
        >
          Probar acceso de Moderador
        </button>

        {resultado && (

          <p className="resultado">
            {resultado}
          </p>

        )}

      </div>

    </div>
  );
}

export default ModeratorPage;