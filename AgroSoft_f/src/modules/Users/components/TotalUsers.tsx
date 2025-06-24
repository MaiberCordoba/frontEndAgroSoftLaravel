import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button
} from "@heroui/react";
import { getTotalUsers } from "../api/usersApi";
import { ReportePdfUsuarios } from './ReportePdfUsuarios';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";

export default function TotalUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userStats'],
    queryFn: getTotalUsers
  });

  if (isLoading) return <Spinner label="Cargando..." />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {data && (
          <PDFDownloadLink 
            document={<ReportePdfUsuarios data={data}/>}
            fileName="reporte_usuarios.pdf"
          >
            {({ loading }) => (
              <Download >
               
              </Download>
            )}
          </PDFDownloadLink>
        )}
      </div>

      <Table aria-label="Estadísticas de usuarios">
      <TableHeader>
          <TableColumn>USUARIOS</TableColumn>
          <TableColumn>VALOR</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Total usuarios</TableCell>
            <TableCell>{data?.total_usuarios}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Usuarios activos</TableCell>
            <TableCell>{data?.usuarios_activos}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Usuarios inactivos</TableCell>
            <TableCell>{data?.usuarios_inactivos}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

