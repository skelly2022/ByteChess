"use client";
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const ModalGame: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }
    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }
  return (
    <>
      <div className="no-scrollbar fixed inset-0  z-[9999] flex h-full items-center justify-center overflow-y-auto overflow-x-hidden bg-green/60 outline-none focus:outline-none">
        <div className=" relative mx-auto my-6 w-full   md:h-auto md:w-3/6 lg:h-auto lg:w-1/3 ">
          <div
            className={`translate h-full duration-300 ${
              showModal ? "translate-y-0" : "translate-y-full"
            } ${showModal ? "opacity-100" : "opacity-0"}`}
          >
            <div className="translate relative flex h-full w-full flex-col rounded-lg  border-4 border-yellow bg-green text-white shadow-lg outline-none focus:outline-none md:h-auto lg:h-auto">
              {/* Header */}

              <div className="flex items-center justify-center rounded-t  p-3">
                <button
                  className="absolute left-9 border-0 p-1 transition hover:opacity-70"
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold text-yellow">{title}</div>
              </div>
              {/* Body */}

              <div className="relative flex-auto p-6">{body}</div>
              {/* Footer */}

              <div className="flex flex-col gap-2 p-3">{footer}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalGame;
