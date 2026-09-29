import { useState } from "react";
import api from "../services/api";

function UserPage() {

  const [resultado, setResultado] =
    useState("");

  const probarAcceso = async () => {

    setResultado(
      "Consultando..."
    );

    try {

      const response =
        await api.get(
          "/test/user"
        );

      setResultado(
        response.data
      );

    } catch (error) {

      setResultado(
        error.response?.data?.message ||
        "No se pudo acceder al recurso."
      );
    }
  };


  return (

    <div className="page-container">

      <div className="card">

        <h1>
          Panel de Usuario
        </h1>

        <p>
          Contenido disponible para
          usuarios autenticados.
        </p>

        <button
          onClick={probarAcceso}
        >
          Probar acceso protegido
        </button>

        {resultado && (

          <p className="resultado">

            Resultado:
            {" "}
            {resultado}

          </p>

        )}

      </div>

    </div>
  );
}

export default UserPage;