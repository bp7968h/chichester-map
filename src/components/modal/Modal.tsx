import React, { useEffect } from "react";
import ModalData from './ModalData';
import Accordin from "./Accordin";

interface ModalProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed w-full h-full inset-0 flex items-center justify-center z-50 bg-black/75">
      <div
        role="dialog"
        className="bg-alter_bg p-6 m-8 rounded-lg shadow-lg relative w-[70%] max-h-[80%] overflow-y-auto"
      >
        <button
          type="button"
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Close</span>
        </button>
        <div className="flex flex-col text-center sm:text-left">
            <h2 className="text-lg font-semibold ">
                {ModalData.title}
            </h2>
            <p className="text-md text-[rgb(200,200,200)]">
                {ModalData.descsriptin}
            </p>
        </div>
          <Accordin items={ModalData.details} />
      </div>
    </div>
  );
};

export default Modal;