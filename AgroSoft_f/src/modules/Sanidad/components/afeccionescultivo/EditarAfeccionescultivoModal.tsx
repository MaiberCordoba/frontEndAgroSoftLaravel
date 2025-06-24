import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchAfeccionesCultivo } from "../../hooks/afeccionescultivo/usePatchAfeccionescultivo";
import { AfeccionesCultivo, EstadoAfeccion } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";

interface EditarAfeccionCultivoModalProps {
  afeccionCultivo: AfeccionesCultivo;
  onClose: () => void;
}

const EditarAfeccionCultivoModal: React.FC<EditarAfeccionCultivoModalProps> = ({
  afeccionCultivo,
  onClose,
}) => {
  // Inicializar fk_Plagas como null si fk_Plagas no es un número válido
  const [fk_Plagas, setFk_Plaga] = useState<number | null>(
    typeof afeccionCultivo.fk_Plagas === "number"
      ? afeccionCultivo.fk_Plagas
      : null
  );
  const [estado, setEstado] = useState<EstadoAfeccion>(
    (afeccionCultivo.estado as EstadoAfeccion) || EstadoAfeccion.Detectado
  );
  // Formatear fechaEncuentro para datetime-local (quitar la parte de la zona horaria)
  const [fechaEncuentro, setFechaEncuentro] = useState<string>(
    afeccionCultivo.fechaEncuentro
      ? new Date(afeccionCultivo.fechaEncuentro).toISOString().slice(0, 16)
      : ""
  );

  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } =
    useGetAfecciones();
  const { mutate, isPending } = usePatchAfeccionesCultivo();

  const handleSubmit = () => {
    if (!fk_Plagas || !estado || !fechaEncuentro) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    // Convertir fecha a formato ISO 8601
    const fechaDate = new Date(fechaEncuentro);
    if (isNaN(fechaDate.getTime())) {
      console.log("Fecha inválida.");
      return;
    }
    const fechaISO = fechaDate.toISOString();

    mutate(
      {
        id: afeccionCultivo.id,
        data: {
          fk_Plagas,
          estado,
          fechaEncuentro: fechaISO,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Error al actualizar afección:", error);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Afección Cultivo"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        value={fechaEncuentro}
        label="Fecha y Hora del Encuentro"
        type="datetime-local"
        onChange={(e) => setFechaEncuentro(e.target.value)}
        required
      />

      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de Plaga"
          placeholder="Selecciona un tipo de plaga"
          selectedKeys={fk_Plagas ? [fk_Plagas.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Plaga(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(tiposPlaga || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()} textValue={tipo.nombre}>
              {tipo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      <Select
        label="Estado de la Afección"
        placeholder="Selecciona el estado"
        selectedKeys={estado ? [estado] : []}
        onSelectionChange={(keys) => {
          const selectedState = Array.from(keys)[0] as
            | EstadoAfeccion
            | undefined;
          setEstado(selectedState || EstadoAfeccion.Detectado);
        }}
      >
        {Object.values(EstadoAfeccion).map((estado) => (
          <SelectItem key={estado} textValue={estado}>
            {estado}
          </SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};

export default EditarAfeccionCultivoModal;
