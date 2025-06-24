import ModalComponent from "@/components/Modal";
import { Actividades } from "../../types";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";

interface Props {
  actividad: Actividades;
  onClose: () => void;
}

const DetalleActividadModal = ({ actividad, onClose }: Props) => {
  const { data: usuarios } = useGetUsers()
  const { data: cultivos } = useGetCultivos()

  const usuario = usuarios?.find((u) => u.identificacion === actividad.fkUsuarios);
  const cultivo = cultivos?.find((c) => c.id === actividad.fkCultivos);
  return (
    <>
      <ModalComponent isOpen={true} onClose={onClose} title="Detalle de Actividad">
        <p><strong>Título:</strong> {actividad.titulo}</p>
        <p><strong>Descripción:</strong> {actividad.descripcion}</p>
        <p><strong>Fecha:</strong> {actividad.fecha}</p>
        <p><strong>Estado:</strong> {actividad.estado}</p>
        <p><strong>Cultivo:</strong> {cultivo?.nombre}</p>
        <p><strong>Usuario:</strong> {usuario?.nombre} {usuario?.apellidos}</p>
      </ModalComponent>
    </>
  );
};

export default DetalleActividadModal;