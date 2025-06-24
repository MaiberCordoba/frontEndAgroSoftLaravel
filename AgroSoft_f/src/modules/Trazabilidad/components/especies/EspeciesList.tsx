// views/especies/EspecieList.tsx
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { useEditarEspecies } from "../../hooks/especies/useEditarEspecies";
import { useCrearEspecies } from "../../hooks/especies/useCrearEspecies";
import { useEliminarEspecies } from "../../hooks/especies/useEliminarEpecies";
import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie";

import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarEspecieModal from "./EditarEspecieModal";
import { CrearEspecieModal } from "./CrearEspecieModal";
import EliminarEspecieModal from "./EliminarEspecie";
import { Especies } from "../../types";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { ReportePdfEspecies } from "./ReportePdfEspecies";

export function EspecieList() {
  const { data: especies, isLoading, error } = useGetEspecies();
  const { data: tiposEspecies } = useGetTiposEspecie();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    EspeciesEditada,
    handleEditar,
  } = useEditarEspecies();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearEspecies();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    EspeciesEliminada,
    handleEliminar,
  } = useEliminarEspecies();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      tipo_especie_nombre: null,
      nombre: "",
      descripcion: "",
      img: "",
      tiempoCrecimiento: 0,
    });
  };

  const tipoEspecieMap =
    tiposEspecies?.reduce((acc, tipo) => {
      acc[tipo.id] = tipo.nombre;
      return acc;
    }, {} as Record<number, string>) || {};

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Tiempo de Crecimiento (días)", uid: "tiempoCrecimiento", sortable: true },
    { name: "Tipo de Especie", uid: "fk_tiposespecie" },
    { name: "Acciones", uid: "acciones" },
  ];
  
  const renderCell = (item: Especies, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "tiempoCrecimiento":
        return <span>{item.tiempoCrecimiento} días</span>;
      case "fk_tiposespecie":
        return (
          <span>
            {item.TiposEspecie?.nombre ||
              (item.fkTiposEspecie && tipoEspecieMap[item.fkTiposEspecie]) ||
              "Sin Tipo"}
          </span>
        );
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}

          />
        );
      default:
        return <span>{String(item[columnKey as keyof Especies])}</span>;
    }
  };
  
  
  

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las especies</p>;

  return (
    <div className="p-4 space-y-4">
      <TablaReutilizable
        datos={especies || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
        renderReporteAction={(data) => {
          const dataConTipoNombre = data.map((item) => ({
            ...item,
            tipoNombre: item.TiposEspecie?.nombre ??
              (item.fk_TiposEspecie ? tipoEspecieMap[item.fk_TiposEspecie] : "Sin Tipo"),
          }));

          return (
            <PDFDownloadLink
              document={<ReportePdfEspecies data={dataConTipoNombre} />}
              fileName="reporte_especies.pdf"
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

      {isEditModalOpen && EspeciesEditada && (
        <EditarEspecieModal especie={EspeciesEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearEspecieModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && EspeciesEliminada && (
        <EliminarEspecieModal
          especie={EspeciesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
