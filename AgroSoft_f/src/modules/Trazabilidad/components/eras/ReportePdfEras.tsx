// components/ReportePdfEras.tsx
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
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
    width: "14.28%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  tableCol: {
    width: "14.28%",
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

export const ReportePdfEras = ({ data }: { data: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PdfReportes title="reporte de eras registradas" />

      <Text style={styles.paragraph}>
        Este reporte contiene el listado de eras registradas en el sistema
        Agrosoft, detallando su estado, tamaño y ubicación dentro del centro
        de formación. La información es útil para el control, mantenimiento y
        asignación de cultivos en el entorno agrícola.
      </Text>

      <View style={styles.table}>
        {/* Encabezados */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>ID</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Lote</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Estado</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Tam X</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Tam Y</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Pos X</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Pos Y</Text>
          </View>
        </View>

        {/* Filas de datos */}
        {data.map((era, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{era.id}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{era.nombreLote}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{era.estado ? "Disponible" : "Ocupado"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{era.tamX}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{era.tamY}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{era.posX}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{era.posY}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
    