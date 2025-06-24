// views/tiposEspecie/ReportePdfTiposEspecie.tsx
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PdfReportes } from "@/components/ui/Reportes";
import { TiposEspecie } from "@/modules/Trazabilidad/types";

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
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  tableCol: {
    width: "33.33%",
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

export const ReportePdfTiposEspecie = ({ data }: { data: TiposEspecie[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PdfReportes title="reporte de tipos de especie registrados" />

      <Text style={styles.paragraph}>
        Este documento presenta el listado de tipos de especie registrados en AgroSoft, incluyendo su nombre y una breve descripción. Esta información permite clasificar y organizar las especies dentro del sistema.
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
            <Text style={styles.tableCellHeader}>Descripción</Text>
          </View>
        </View>

        {/* Filas de datos */}
        {data.map((tipo, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{tipo.id}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{tipo.nombre}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{tipo.descripcion}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
