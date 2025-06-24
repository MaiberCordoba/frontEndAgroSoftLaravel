import { usegetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useEditarInsumo } from "../../hooks/insumos/useEditarInsumos";
import { useCrearInsumo } from "../../hooks/insumos/useCrearInsumos";
import { useEliminarInsumo } from "../../hooks/insumos/useEliminarInsumos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarInsumosModal from "./EditarInsumosModal";
import { CrearInsumosModal } from "./CrearInsumosModal";
import EliminarInsumoModal from "./EliminarInsumos";
import { Insumos } from "../../types";

export function InsumosList() {
  const { data, isLoading, error } = usegetInsumos();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    insumoEditado,
    handleEditar,
  } = useEditarInsumo();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearInsumo();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    insumoEliminado,
    handleEliminar,
  } = useEliminarInsumo();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", descripcion: "", precio: 0, unidades: 0 });
  };

  const columnas = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Precio", uid: "precio" },
    { name: "Unidades", uid: "unidades" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Insumos, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "precio":
        return <span>${item.precio.toFixed(2)}</span>;
      case "unidades":
        return <span>{item.unidades}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Insumos])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los insumos</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por Nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && insumoEditado && (
        <EditarInsumosModal insumo={insumoEditado} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearInsumosModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && insumoEliminado && (
        <EliminarInsumoModal insumo={insumoEliminado} isOpen={isDeleteModalOpen} onClose={closeDeleteModal} />
      )}
    </div>
  );
}
