// components/ReportePdfCultivos.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PdfReportes } from "@/components/ui/Reportes";

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
    width: "16.66%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  tableCol: {
    width: "16.66%",
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

function formatDate(fecha: string) {
  return new Date(fecha).toISOString().split("T")[0];
}

export const ReportePdfCultivos = ({ data }: { data: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PdfReportes title="reporte de cultivos registrados" />

      <Text style={styles.paragraph}>
        Este reporte presenta el listado de cultivos registrados en el sistema
        AgroSoft, especificando nombre, especie, unidades sembradas, fecha de
        siembra y su estado actual. Esta información es relevante para el
        seguimiento productivo de cada cultivo en las instalaciones del SENA.
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
            <Text style={styles.tableCellHeader}>Especie</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Unidades</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Fecha Siembra</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Activo</Text>
          </View>
        </View>

        {/* Filas de datos */}
        {data.map((cultivo, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{cultivo.id}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{cultivo.nombre}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{cultivo.nombreEspecie}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{cultivo.unidades}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatDate(cultivo.fechaSiembra)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{cultivo.activo ? "Sí" : "No"}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
