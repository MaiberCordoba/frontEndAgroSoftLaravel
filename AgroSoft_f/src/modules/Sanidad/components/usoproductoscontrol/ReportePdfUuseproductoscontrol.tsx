import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfReportes } from '@/components/ui/Reportes';

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
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  tableCol: {
    width: '33.33%',
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

type Props = {
  data: {
    producto: string;
    control: string;
    cantidadProducto: number;
  }[];
};

export const ReportePdfUsoProductosControl = ({ data }: Props) => (
  <Document>
    <Page style={{ padding: '40 30' }}>
      <PdfReportes title="Reporte de uso de productos para el control" />

      <Text style={styles.paragraph}>
        Este informe presenta un resumen del uso de productos destinados al control en el sistema AGROSIS. 
        Cada registro indica el producto utilizado, el control aplicado y la cantidad empleada.
      </Text>

      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Producto</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Control Aplicado</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Cantidad</Text>
          </View>
        </View>

        {/* Filas de datos */}
        {data.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.producto}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.control}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.cantidadProducto}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
