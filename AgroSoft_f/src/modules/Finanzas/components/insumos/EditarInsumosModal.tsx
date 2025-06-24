import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchInsumos } from '../../hooks/insumos/usePatchInsumos'; // Nuevo hook
import { Insumos } from '../../types';
import { Input } from '@heroui/react';

interface EditarInsumosModalProps {
  insumo: Insumos;
  onClose: () => void;
}

const EditarInsumosModal: React.FC<EditarInsumosModalProps> = ({ insumo, onClose }) => {
  const [nombre, setNombre] = useState<string>(insumo.nombre);
  const [descripcion, setDescripcion] = useState<string>(insumo.descripcion);
  const [precio, setPrecio] = useState<number>(insumo.precio);
  const [unidades, setUnidades] = useState<number>(insumo.unidades);

  const { mutate, isPending } = usePatchInsumos();

  const handleSubmit = () => {
    if (!nombre || !descripcion || precio <= 0 || unidades < 0) {
      console.log("Por favor, completa todos los campos correctamente.");
      return;
    }

    mutate(
      {
        id: insumo.id,
        data: {
          nombre,
          descripcion,
          precio,
          unidades,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Insumo"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          variant: 'light',
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        value={nombre}
        label="Nombre"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Input
        value={descripcion}
        label="Descripción"
        type="text"
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <Input
        value={precio.toString()}
        label="Precio"
        type="number"
        onChange={(e) => setPrecio(Number(e.target.value))}
        required
      />
      <Input
        value={unidades.toString()}
        label="Unidades"
        type="number"
        onChange={(e) => setUnidades(Number(e.target.value))}
        required
      />
    </ModalComponent>
  );
};

export default EditarInsumosModal;
