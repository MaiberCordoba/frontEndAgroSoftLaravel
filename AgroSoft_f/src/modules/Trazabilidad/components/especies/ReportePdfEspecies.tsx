import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PdfReportes } from "@/components/ui/Reportes";
import { Especies } from "@/modules/Trazabilidad/types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  paragraph: {
    fontSize: 10,
    textAlign: "justify",
    lineHeight: 1.5,
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 9,
    textAlign: "center",
  },
});

export const ReportePdfEspecies = ({
  data,
}: {
  data: (Especies & { tipoNombre?: string })[];
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PdfReportes title="reporte de especies registradas" />

      <Text style={styles.paragraph}>
        Este reporte contiene el listado de especies registradas en el sistema Agrosoft,
        incluyendo información sobre su nombre, tipo, tiempo de crecimiento y descripción
        general. Esta información es clave para la gestión de cultivos y planificación de siembras.
      </Text>

      <View style={styles.table}>
        {/* Encabezados */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>ID</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Nombre</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Tipo</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Tiempo (días)</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Descripción</Text>
          </View>
        </View>

        {/* Filas de datos */}
        {data.map((especie, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{especie.id}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{especie.nombre}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{especie.tipo_especie_nombre || "Sin tipo"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{especie.tiempoCrecimiento}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{especie.descripcion}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
