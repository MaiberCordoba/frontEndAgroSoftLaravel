import { useGetControles } from "../../hooks/controles/useGetControless";
import { useEditarControl } from "../../hooks/controles/useEditarControles";
import { useCrearControl } from "../../hooks/controles/useCrearControles";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarControlModal from "./EditarControlesModal";
import { CrearControlModal } from "./CrearControlesModal";
import DetallesControles from "./DetalleControlesModal";
import { Controles } from "../../types";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { ReportePdfControles } from "./ReportePdfControles";
import { Download } from "lucide-react";
import { useState } from "react";
import { useDetallesControl } from "../../hooks/controles/useDetalleControlModal";

export function ControlesList() {
  const { data, isLoading, error } = useGetControles();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    controlEditado,
    handleEditar,
  } = useEditarControl();
  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearControl();
  const {
    isOpen: isDetallesOpen,
    closeModal: closeDetallesModal,
    selectedControlId,
    handleVerDetalles,
  } = useDetallesControl(); 

  const [datosPDF, setDatosPDF] = useState<any | null>(null);

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      fk_Afeccion: 0,
      tiposControl: 0,
      fechaControl: "",
      descripcion: "",
    });
  };

  const columnas = [
    { name: "Fecha", uid: "fecha", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Afección", uid: "fk_Afeccion" },
    { name: "Tipo de Control", uid: "fk_TipoControl" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Controles, columnKey: React.Key) => {
    switch (columnKey) {
      case "fecha":
        return <span>{item.fechaControl}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "fk_Afeccion":
        return <span>{item.afecciones?.plagas?.nombre || "No definido"}</span>;
      case "fk_TipoControl":
        return <span>{item.tiposControl?.nombre || "No definido"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onVerDetalles={() => handleVerDetalles(item.id)} // Usamos handleVerDetalles
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Controles])}</span>;
    }
  };

  const generarReporte = () => {
    const datos = (data || []).map((item: Controles) => {
      const afeccion = item.afecciones?.plagas?.nombre || "No definido";
      const tipoControl = item.tiposControl?.nombre || "No definido";

      return {
        fechaControl: item.fechaControl,
        descripcion: item.descripcion,
        afeccion,
        tipoControl,
      };
    });

    setDatosPDF(datos);
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los controles</p>;

  return (
    <div className="p-4 space-y-6">
      {/* Tabla */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="descripcion"
        placeholderBusqueda="Buscar por descripción"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
        renderReporteAction={() => (
          <button
            onClick={generarReporte}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Visualizar reporte"
          >
            <Download className="h-5 w-5 text-green-600" />
          </button>
        )}
      />

      {/* Visualización del PDF */}
      {datosPDF && (
        <div className="w-full flex flex-col items-center mt-8 space-y-4">
          <div
            className="w-full max-w-[95%] rounded-lg shadow-lg border border-gray-300 bg-white p-4"
            style={{ height: "85vh" }}
          >
            <PDFViewer
              style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
            >
              <ReportePdfControles data={datosPDF} />
            </PDFViewer>
          </div>

          <PDFDownloadLink
            document={<ReportePdfControles data={datosPDF} />}
            fileName="reporte_controles.pdf"
          >
            {({ loading }) => (
              <button className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">
                {loading ? "Generando..." : "Descargar PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      )}

      {/* Modales */}
      {isEditModalOpen && controlEditado && (
        <EditarControlModal control={controlEditado} onClose={closeEditModal} />
      )}
      {isCreateModalOpen && <CrearControlModal onClose={closeCreateModal} />}
      {isDetallesOpen && selectedControlId && (
        <DetallesControles
          id={selectedControlId}
          isOpen={isDetallesOpen}
          onClose={closeDetallesModal}
        />
      )}
    </div>
  );
}