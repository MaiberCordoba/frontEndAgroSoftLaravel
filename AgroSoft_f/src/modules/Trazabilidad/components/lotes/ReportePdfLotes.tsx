// components/ReportePdfLotes.tsx
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
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  tableCol: {
    width: "12.5%",
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

export const ReportePdfLotes = ({ data }: { data: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PdfReportes title="reporte de lotes registrados" />

      <Text style={styles.paragraph}>
        Este reporte muestra todos los lotes registrados en el sistema Agrosoft,
        incluyendo su tamaño, ubicación y estado actual. Esta información es
        fundamental para la organización del terreno agrícola y la planificación
        de cultivos.
      </Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          {["ID", "Nombre", "Descripción", "Tam X", "Tam Y", "Estado", "Pos X", "Pos Y"].map((header, index) => (
            <View key={index} style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{header}</Text>
            </View>
          ))}
        </View>

        {data.map((lote, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lote.id}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lote.nombre}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lote.descripcion}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lote.tamX}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lote.tamY}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lote.estado ? "Disponible" : "Ocupado"}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lote.posX}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lote.posY}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
