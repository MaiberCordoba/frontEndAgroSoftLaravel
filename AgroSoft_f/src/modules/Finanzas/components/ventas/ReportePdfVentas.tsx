import { PdfReportes } from '@/components/ui/Reportes';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { ReporteVentas } from '../../types';

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
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5
  },
  tableCellHeader: {
    margin: "auto",
    fontSize: 12,
    fontWeight: 'bold'
  },
  tableCell: {
    margin: "auto",
    fontSize: 10
  }
});

export const ReportePdfVentas = ({ data }: { data: ReporteVentas[] }) => (
  <Document>
    <Page style={styles.page}>
      <PdfReportes title="reporte de ventas realizadas" />
      <Text style={styles.paragraph}>
        Este documento contiene un resumen detallado de las ventas registradas en el sistema.
        Se incluyen productos vendidos, cantidades, precios unitarios y valores totales por venta.
        Esta información es útil para la gestión contable y el análisis comercial.
      </Text>

      <View style={styles.table}>
        {/* Encabezado de la tabla */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Producto</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Cantidad</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Precio Unitario</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Precio Final</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Fecha</Text></View> {/* Nueva columna para fecha */}
        </View>

        {/* Datos de la tabla */}
        {data?.map((venta, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{venta.Producto}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{venta.Cantidad}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                ${venta.PrecioProducto?.toLocaleString("es-CO")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                ${venta.PrecioFinal?.toLocaleString("es-CO")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              {/* Verificar la conversión de la fecha */}
              <Text style={styles.tableCell}>
                {new Date(venta.FechaVenta).toLocaleDateString("es-CO")}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
