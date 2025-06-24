// hooks/useSeleccion.ts
import { Selection } from "@heroui/react";
import { useState } from "react";

/**
 * Hook para manejar la selección múltiple de filas en tablas
 * @returns {
 *   selectedKeys: Set de keys seleccionados
 *   setSelectedKeys: Función para actualizar la selección
 * }
 */
export const useSeleccion = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  
  return {
    selectedKeys,
    setSelectedKeys
  };
};