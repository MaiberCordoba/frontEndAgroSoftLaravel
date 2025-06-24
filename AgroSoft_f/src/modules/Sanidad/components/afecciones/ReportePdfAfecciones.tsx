import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PdfReportes } from "@/components/ui/Reportes";

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 10,
    textAlign: "justify",
    lineHeight: 1.5,
    marginVertical: 15,
    paddingHorizontal: 10,
    fontFamily: "Helvetica",
  },
  page: {
    padding: 30,
    fontFamily: "Helvetica",
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
    padding: 5,
  },
  tableCol: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 10,
  },
});

type Props = {
  data: {
    id: number;
    nombre: string;
    descripcion: string;
    img?: string;
    fk_Tipo: number;
    tiposPlaga: {
      id: number;
      nombre: string;
      descripcion: string;
      img?: string;
    };
  }[];
};

export const ReportePdfAfecciones = ({ data }: Props) => (
  <Document>
    <Page style={styles.page}>
      <PdfReportes title="Reporte de Afecciones" />
      <Text style={styles.paragraph}>
        Este informe presenta las afecciones registradas en el sistema AGROSIS.
        Se detallan sus nombres, descripciones y el tipo de afectación
        correspondiente.
      </Text>

      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Nombre</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Descripción</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Tipo de Afectación</Text>
          </View>
        </View>

        {/* Filas */}
        {data.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.nombre}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.descripcion}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.descripcion}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
