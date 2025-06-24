import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useEditarCultivos } from "../../hooks/cultivos/useEditarCultivos";
import { useCrearCultivos } from "../../hooks/cultivos/useCrearCultivos";
import { useEliminarCultivos } from "../../hooks/cultivos/useEliminarCultivos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarCultivoModal from "./EditarCultivosModal";
import { CrearCultivoModal } from "./CrearCultivosModal";
import EliminarCultivoModal from "./EliminarCultivo";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportePdfCultivos } from "./ReportePdfCultivos";
import { Download } from "lucide-react";
import { Cultivos } from "../../types";

function formatDate(fecha: string) {
  return new Date(fecha).toISOString().split("T")[0];
}

export function CultivosList() {
  const { data, isLoading, error } = useGetCultivos();
  const { data: especies } = useGetEspecies();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    CultivosEditada,
    handleEditar,
  } = useEditarCultivos();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearCultivos();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    CultivosEliminada,
    handleEliminar,
  } = useEliminarCultivos();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      nombre: "",
      fk_Especies: 0,
      unidades: 0,
      fechaSiembra: "",
      activo: true,
    });
  };

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Especie", uid: "fk_especie", sortable: true },
    { name: "Unidades", uid: "unidades" },
    { name: "Fecha de Siembra", uid: "fechasiembra", sortable: true },
    { name: "Activo", uid: "activo", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Cultivos, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "nombre":
        return <span>{item.nombre}</span>;
      case "fk_especie":
        const especie = especies?.find((e) => e.id === item.fkEspecies);
        return <span>{especie ? especie.nombre : "Cargando..."}</span>;
      case "unidades":
        return <span>{item.unidades}</span>;
      case "fechasiembra":
        return <span>{formatDate(item.fechaSiembra)}</span>;
      case "activo":
        return <span>{item.activo ? "Sí" : "No"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Cultivos])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los cultivos</p>;

  return (
    <div className="p-4 space-y-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="id"
        placeholderBusqueda="Buscar por ID"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
        renderReporteAction={(datos) => {
          const datosConNombreEspecie = datos.map((item) => {
            const especie = especies?.find((e) => e.id === item.fk_Especies);
            return {
              ...item,
              nombreEspecie: especie ? especie.nombre : "Desconocida",
            };
          });

          return (
            <PDFDownloadLink
              document={<ReportePdfCultivos data={datosConNombreEspecie} />}
              fileName="reporte_cultivos.pdf"
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

      {isEditModalOpen && CultivosEditada && (
        <EditarCultivoModal
          cultivo={CultivosEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && <CrearCultivoModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && CultivosEliminada && (
        <EliminarCultivoModal
          cultivo={CultivosEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
