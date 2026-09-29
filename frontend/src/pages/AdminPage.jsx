import { useState } from "react";
import api from "../services/api";

function AdminPage() {

  const [resultado, setResultado] =
    useState("");

  const probarAcceso = async () => {

    try {

      const response =
        await api.get(
          "/test/admin"
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
          Panel de Administrador
        </h1>

        <p>
          Contenido exclusivo para
          administradores.
        </p>

        <button
          onClick={probarAcceso}
        >
          Probar acceso de Administrador
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

export default AdminPage;