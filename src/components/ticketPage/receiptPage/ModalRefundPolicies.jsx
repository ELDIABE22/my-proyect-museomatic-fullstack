import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@nextui-org/react";

const ModalRefundPolicies = ({ isOpen, onOpenChange }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="opaque"
      size="xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-2xl font-bold text-center">
              Políticas de reembolso
            </ModalHeader>
            <Divider />
            <ModalBody>
              <p className="text-base font-normal text-default-600">
                <span className="font-bold text-lg text-black">*</span> Las
                entradas para eventos en este museo no son <b>reembolsables</b>.
                Sin embargo, en caso de <b>cancelación del evento</b> por parte
                del museo, se emitirá un reembolso completo a los compradores de
                entradas.
              </p>

              <p className="text-base font-normal text-default-600">
                <span className="font-bold text-lg text-black">*</span> Para
                solicitar un reembolso en caso de cancelación del evento, por
                favor envíe un correo electrónico a <b>museomatic@gmail.com</b>{" "}
                con el asunto <b>Solicitud de reembolso</b> e incluya su nombre
                completo, número de pedido y una copia del recibo de compra.
              </p>

              <p className="text-base font-normal text-default-600">
                <span className="font-bold text-lg text-black">*</span> Las
                solicitudes de reembolso se procesarán dentro de los{" "}
                <b>5 días hábiles</b> posteriores a la recepción del correo
                electrónico. Se le notificará por correo electrónico la decisión
                final sobre su solicitud.
              </p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalRefundPolicies;
