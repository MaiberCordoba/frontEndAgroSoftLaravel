import { useGetVentas } from "../../hooks/ventas/useGetVentas";
import { useEditarVenta } from "../../hooks/ventas/useEditarVentas";
import { useCrearVenta } from "../../hooks/ventas/useCrearVentas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarVentasModal from "./EditarVentasModal";
import { CrearVentasModal } from "./CrearVentasModal";
import { ReporteVentas, Ventas } from "../../types";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { getReporteVentas } from "../../api/ventasApi";
import { useQuery } from "@tanstack/react-query";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportePdfVentas } from "./ReportePdfVentas";
import { Download } from "lucide-react";

export function VentasList() {
  const { data, isLoading, error } = useGetVentas();
  const { data : cosechas, isLoading : loadingCosechas } = useGetCosechas();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    ventaEditada, 
    handleEditar 
  } = useEditarVenta();
  
const { data: ventasData } = useQuery<ReporteVentas[]>({
  queryKey: ['reporteVentas'],
  queryFn: getReporteVentas
});
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearVenta();
  
  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Cosechas: 0, precioUnitario: 0, fecha: "" });
  };

  const columnas = [
    { name: "fecha de Cosecha", uid: "cosecha" },
    { name: "Precio Unitario", uid: "precioUnitario" },
    { name: "Fecha Venta", uid: "fecha" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Ventas, columnKey: React.Key) => {
    switch (columnKey) {
      case "cosecha":
        const cosecha = cosechas?.find((c) => c.id === item.fk_Cosechas);
        return <span>{cosecha ? cosecha?.fecha : "No definido"}</span>;
      case "precioUnitario":
        return <span>{item.precioUnitario}</span>;
      case "fecha":
        return <span>{item.fecha}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Ventas])}</span>;
    }
  };

  if (isLoading || loadingCosechas) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las Ventas</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="fecha"
        placeholderBusqueda="Buscar por fecha de venta"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && ventaEditada && (
        <EditarVentasModal
          venta={ventaEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearVentasModal
          onClose={closeCreateModal}
        />
      )}
    </div>
  );
}
