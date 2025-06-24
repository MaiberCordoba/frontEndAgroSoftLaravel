// components/ReportePdfSemilleros.tsx
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PdfReportes } from "@/components/ui/Reportes";
import { Semilleros } from "../../types";

interface SemilleroExtendido extends Semilleros {
  nombreEspecie: string;
}

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

function formatDate(date: string) {
  return new Date(date).toISOString().split("T")[0];
}

export const ReportePdfSemilleros = ({ data }: { data: SemilleroExtendido[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PdfReportes title="reporte de semilleros registrados" />

      <Text style={styles.paragraph}>
        Este reporte contiene el listado de semilleros registrados en el sistema Agrosoft. Se detallan las especies sembradas, la cantidad de unidades por semillero, así como las fechas de siembra y estimación de desarrollo. Esta información permite un control eficiente de los procesos de propagación de cultivos.
      </Text>

      <View style={styles.table}>
        {/* Encabezado de tabla */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>ID</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Especie</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Unidades</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>F. Siembra</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>F. Estimada</Text>
          </View>
        </View>

        {/* Filas de datos */}
        {data.map((semillero, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{semillero.id}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{semillero.nombreEspecie}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{semillero.unidades}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatDate(semillero.fechaSiembra)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatDate(semillero.fechaEstimada)}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
