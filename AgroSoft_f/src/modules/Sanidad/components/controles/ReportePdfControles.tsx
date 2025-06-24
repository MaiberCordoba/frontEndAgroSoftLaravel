import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfReportes } from '@/components/ui/Reportes';

// Estilos reutilizables
const styles = StyleSheet.create({
  paragraph: {
    fontSize: 10,
    textAlign: 'justify',
    lineHeight: 1.5,
    marginVertical: 15,
    paddingHorizontal: 10,
    fontFamily: 'Helvetica'
  },
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  tableCell: {
    fontSize: 10
  }
});

// Tipado
type Props = {
  data: {
    fechaControl: string;
    descripcion: string;
    tipoControl: string;
    afeccion: string;
  }[];
};

// Componente
export const ReportePdfControles = ({ data }: Props) => (
  <Document>
    <Page style={styles.page}>
      <PdfReportes title="Reporte de Controles" />
      <Text style={styles.paragraph}>
        Este informe presenta los controles realizados en el sistema AGROSIS. Cada control está vinculado a una afección y a un tipo específico de tratamiento o monitoreo.
      </Text>

      <View style={styles.table}>
        {/* Encabezados */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Fecha</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Descripción</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Tipo de Control</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Afección</Text>
          </View>
        </View>

        {/* Filas de datos */}
        {data.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.fechaControl}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.descripcion}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.tipoControl}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.afeccion}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
