import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import { usegetUsoProductosControl } from "../../hooks/useProductosControl/useGetUseProductosControl";
import { useEditarUsoProductosControl } from "../../hooks/useProductosControl/useEditarUseProductosControl";
import { useCrearUsoProductosControl } from "../../hooks/useProductosControl/useCrearUseProductosControl";
import { useEliminarUsoProductosControl } from "../../hooks/useProductosControl/useEliminarUseProductosControl";
import { useGetProductosControl } from "../../hooks/productosControl/useGetProductosControl";
import { useGetControles } from "../../hooks/controles/useGetControless";
import EditarUsoProductosControlModal from "./EditarUsoProductoscontrolModal";
import { CrearUsoProductosControlModal } from "./CrearUsoProductoscontrolModal";
import EliminarUsoProductosControlModal from "./EliminarUsoProductoscontrolModal";
import { UsoProductosControl } from "../../types";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ReportePdfUsoProductosControl } from "./ReportePdfUuseproductoscontrol";
import { Download, FileText } from "lucide-react";
import { useState } from "react";

export function UsoProductosControlList() {
  const { data: rawData, isLoading, error } = usegetUsoProductosControl();
  const data = rawData?.map((item) => ({
    id: item.id_usoProductoControl,
    fk_ProductoControl: item.fk_ProductosControl?.id_productoControl,
    fk_Control: item.fk_Controles?.id,
    cantidadProducto: item.cantidad_producto_usada,
  })) ?? [];

  const { data: productosControl } = useGetProductosControl();
  const { data: controles } = useGetControles();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    usoproductosControlEditado,
    handleEditar,
  } = useEditarUsoProductosControl();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUsoProductosControl();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    usoproductosControlEliminado,
    handleEliminar,
  } = useEliminarUsoProductosControl();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      fk_ProductoControl: 0,
      fk_Control: 0,
      cantidadProducto: 0,
    });
  };

  const columnas = [
    { name: "Producto de Control", uid: "productoControl" },
    { name: "Control Aplicado", uid: "control" },
    { name: "Cantidad", uid: "cantidadProducto" },
    { name: "Acciones", uid: "acciones" },
  ];

  const [datosPDF, setDatosPDF] = useState<any[]>([]);

  const renderCell = (item: UsoProductosControl, columnKey: React.Key) => {
    switch (columnKey) {
      case "productoControl":
        const producto = productosControl?.find(
          (p) => p.id === item.fk_ProductoControl
        );
        return <span>{producto ? producto.nombre : "Desconocido"}</span>;

      case "control":
        const control = controles?.find((c) => c.id === item.fk_Control);
        return <span>{control ? control.descripcion : "Desconocido"}</span>;

      case "cantidadProducto":
        return <span>{item.cantidadProducto}</span>;

      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            
          />
        );

      default:
        return (
          <span>{String(item[columnKey as keyof UsoProductosControl])}</span>
        );
    }
  };

  if (isLoading || !productosControl || !controles) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar los datos</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="fk_ProductoControl"
        placeholderBusqueda="Buscar por producto"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}

        renderReporteAction={(data) => {
          const datos = data.map((item: UsoProductosControl) => {
            const producto = productosControl?.find(p => p.id === item.fk_ProductoControl)?.nombre || "Desconocido";
            const control = controles?.find(c => c.id === item.fk_Control)?.descripcion || "Desconocido";
            return {
              producto,
              control,
              cantidadProducto: item.cantidadProducto
            };
          });
          return (
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Visualizar reporte"
              onClick={() => setDatosPDF(datos)}
            >
              <FileText className="h-5 w-5 text-blue-600" />
            </button>
          );
        }}
      />

      {/* Espacio entre tabla y visor */}
      <div className="mt-8"></div>

      {/* Visualización PDF */}
      {datosPDF.length > 0 && (
        <div className="w-full flex flex-col items-center mt-4 space-y-4">
          <div className="w-full max-w-[95%] rounded-lg shadow-lg border border-gray-300 bg-white p-4" style={{ height: "85vh" }}>
            <PDFViewer style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}>
              <ReportePdfUsoProductosControl data={datosPDF} />
            </PDFViewer>
          </div>

          <PDFDownloadLink document={<ReportePdfUsoProductosControl data={datosPDF} />} fileName="reporte_uso_productos_control.pdf">
            {({ loading }) => (
              <button className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">
                {loading ? "Generando..." : "Descargar PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      )}

      {/* Modales */}
      {isEditModalOpen && usoproductosControlEditado && (
        <EditarUsoProductosControlModal usoProductoControl={usoproductosControlEditado} onClose={closeEditModal} />
      )}
      {isCreateModalOpen && (
        <CrearUsoProductosControlModal onClose={closeCreateModal} />
      )}
      {isDeleteModalOpen && usoproductosControlEliminado && (
        <EliminarUsoProductosControlModal usoProductoControl={usoproductosControlEliminado} isOpen={isDeleteModalOpen} onClose={closeDeleteModal} />
      )}
    </div>
  );
}
