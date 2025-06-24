import { useGetEras } from "../../hooks/eras/useGetEras";
import { useEditarEras } from "../../hooks/eras/useEditarEras";
import { useCrearEras } from "../../hooks/eras/useCrearEras";
import { useEliminarEras } from "../../hooks/eras/useEliminarEras";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";

import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarEraModal from "./EditarErasModal";
import { CrearEraModal } from "./CrearEraModal";
import EliminarEraModal from "./EliminarEras";
import { Eras } from "../../types";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportePdfEras } from "./ReportePdfEras";
import { Download } from "lucide-react";

export function EraList() {
  const { data, isLoading, error } = useGetEras();
  const { data: lotes } = useGetLotes();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    ErasEditada,
    handleEditar,
  } = useEditarEras();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearEras();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    ErasEliminada,
    handleEliminar,
  } = useEliminarEras();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      fk_Lotes: 0,
      estado: true,
      tamX: 0,
      tamY: 0,
      posX: 0,
      posY: 0,
    });
  };

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Lote", uid: "fk_Lote", sortable: true },
    { name: "Estado", uid: "estado" },
    { name: "Tamaño X", uid: "tamX" },
    { name: "Tamaño Y", uid: "tamY" },
    { name: "Posición X", uid: "posX" },
    { name: "Posición Y", uid: "posY" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Eras, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "fk_Lote":
        const lote = lotes?.find((l) => l.id === item.fkLotes);
        return <span>{lote ? lote.nombre : "Sin asignar"}</span>;
      case "estado":
        return <span>{item.estado ? "Disponible" : "Ocupado"}</span>;
      case "tamX":
        return <span>{item.tamX}</span>;
      case "tamY":
        return <span>{item.tamY}</span>;
      case "posX":
        return <span>{item.posX}</span>;
      case "posY":
        return <span>{item.posY}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Eras])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las eras</p>;

  return (
    <div className="p-4 space-y-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="id"
        placeholderBusqueda="Buscar por Numero"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
        renderReporteAction={(data) => {
          const dataConNombreLote = data.map((item) => {
            const lote = lotes?.find((l) => l.id === item.fk_Lotes);
            return {
              ...item,
              nombreLote: lote ? lote.nombre : "Sin asignar",
            };
          });

          return (
            <PDFDownloadLink
              document={<ReportePdfEras data={dataConNombreLote} />}
              fileName="reporte_eras.pdf"
            >
              {({ loading }) => (
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Descargar reporte"
                >
                  {loading ? (
                    <Download className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <Download className="h-5 w-5 text-red-600" />
                  )}
                </button>
              )}
            </PDFDownloadLink>
          );
        }}
      />

      {isEditModalOpen && ErasEditada && (
        <EditarEraModal era={ErasEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearEraModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && ErasEliminada && (
        <EliminarEraModal
          era={ErasEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
