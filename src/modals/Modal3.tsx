"use client";
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface Modal3Props {
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

const Modal3: React.FC<Modal3Props> = ({
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
  const [showModal3, setShowModal3] = useState(isOpen);
  useEffect(() => {
    setShowModal3(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
    setShowModal3(false);
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
      <div className="no-scrollbar fixed inset-0 z-50 flex  h-screen  items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60  outline-none focus:outline-none ">
        <div className="  no-scrollbar relative  mx-auto h-[92%]   w-[92%] overflow-scroll md:w-5/6 lg:h-auto ">
          <div
            className={`translate h-full border-2 border-yellow bg-black duration-300  ${
              showModal3 ? "translate-y-0" : "translate-y-full"
            } ${showModal3 ? "opacity-100" : "opacity-0"}`}
          >
            <div
              className="translate relative flex h-full w-full  flex-col rounded-lg  bg-black  text-white shadow-lg outline-none 
             focus:outline-none md:h-auto lg:h-auto"
            >
              {/* Header */}

              <div className="flex items-center justify-center rounded-t  p-3">
                <button
                  className="absolute left-5 top-3 border-0 p-1 text-2xl transition hover:opacity-70"
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                {/* <div className="bg-black text-lg font-semibold text-yellow ">
                  {title}
                </div> */}
              </div>
              {/* Body */}

              <div className="h-full w-full">{body}</div>
              {/* Footer */}

              {/* <div className="flex flex-col gap-2 p-6">{footer}</div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal3;
