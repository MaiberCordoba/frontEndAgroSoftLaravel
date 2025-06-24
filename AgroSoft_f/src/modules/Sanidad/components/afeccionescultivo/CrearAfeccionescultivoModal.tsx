import { useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import ModalComponent from "@/components/Modal";
import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { EstadoAfeccion } from "../../types";
import { usePostAfeccionCultivo } from "../../hooks/afeccionescultivo/usePostAfeccionescultivo";
import { useGetPlantaciones } from "../../../Trazabilidad/hooks/plantaciones/useGetPlantaciones";

interface CrearAfeccionCultivoModalProps {
  onClose: () => void;
}

export const CrearAfeccionCultivoModal = ({
  onClose,
}: CrearAfeccionCultivoModalProps) => {
  const [fk_Plantaciones, setFk_Plantaciones] = useState<number | null>(null);
  const [fk_Plagas, setFk_Plagas] = useState<number | null>(null);
  const [fechaEncuentro, setFechaEncuentro] = useState<string>("");
  const [estado, setEstado] = useState<EstadoAfeccion | "">(
    EstadoAfeccion.Detectado
  );

  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } =
    useGetAfecciones();
  const { data: plantaciones, isLoading: isLoadingPlantaciones } =
    useGetPlantaciones();
  const { mutate, isPending } = usePostAfeccionCultivo();

  // Convertir fecha a formato ISO

  const handleSubmit = () => {
    const fechaISO = new Date(fechaEncuentro).toISOString();
    if (!fk_Plantaciones || !fk_Plagas || !estado || !fechaEncuentro) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Plantaciones, fk_Plagas, estado, fechaEncuentro: fechaISO },
      {
        onSuccess: () => {
          onClose();
          setFk_Plantaciones(null);
          setFk_Plagas(null);
          setEstado(EstadoAfeccion.Detectado);
          setFechaEncuentro("");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Afección Cultivo"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      {isLoadingPlantaciones ? (
        <p>Cargando plantaciones...</p>
      ) : (
        <Select
          label="Plantación"
          placeholder="Selecciona una plantación"
          selectedKeys={fk_Plantaciones ? [fk_Plantaciones.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Plantaciones(Number(selectedKey));
          }}
        >
          {(plantaciones || []).map((plantacion) => (
            <SelectItem
              key={plantacion.id.toString()}
              textValue={plantacion.id.toString()} // AQUI VA EL textValue
            >
              {plantacion.id}
            </SelectItem>
          ))}
        </Select>
      )}

      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de Plaga"
          placeholder="Selecciona un tipo de plaga"
          selectedKeys={fk_Plagas ? [fk_Plagas.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Plagas(Number(selectedKey));
          }}
        >
          {(tiposPlaga || []).map((tipo) => (
            <SelectItem
              key={tipo.id.toString()}
              textValue={tipo.nombre} // AQUI VA EL textValue correcto
            >
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
          const selectedState = Array.from(keys)[0];
          setEstado(selectedState as EstadoAfeccion);
        }}
      >
        {Object.values(EstadoAfeccion).map((estado) => (
          <SelectItem
            key={estado}
            textValue={estado} // AQUI VA EL textValue
          >
            {estado}
          </SelectItem>
        ))}
      </Select>

      <Input
        label="Fecha del Encuentro"
        type="date"
        value={fechaEncuentro}
        onChange={(e) => setFechaEncuentro(e.target.value)}
        required
      />
    </ModalComponent>
  );
};
