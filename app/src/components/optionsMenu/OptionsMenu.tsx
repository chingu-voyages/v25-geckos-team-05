import React, { useState, useRef, useEffect } from "react";
import Button from "../button";
import "./OptionsMenu.css";

interface IOption {
  action: () => void;
  confirm?: boolean;
}

interface IOptions {
  buttons: { [keyof: string]: IOption };
  refTitle?: string;
  children?: JSX.Element;
  className?: string;
}

interface IConfirmData {
  title: string;
  handleYes: () => void;
  handleCancel: () => void;
}

function OptionsMenu({ buttons, refTitle, children, className }: IOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<IConfirmData | null>(null);
  const handleCallAction = ({ action, confirm }: IOption, title: string) => {
    const execute = (func: () => any) => {
      setIsOpen(false);
      setConfirmData(null);
      func();
    };
    if (confirm) {
      setConfirmData({
        title,
        handleYes: () => execute(action),
        handleCancel: () => execute(() => null),
      });
    } else {
      execute(action);
    }
  };
  const clickedInMenuRef = useRef(false);

  useEffect(() => {
    const handleClose = () => {
      if (!clickedInMenuRef.current) {
        setIsOpen(false);
        setConfirmData(null);
      } else {
        clickedInMenuRef.current = false;
        window?.addEventListener("click", handleClose, { once: true });
      }
    };
    if (isOpen) {
      window?.addEventListener("click", handleClose, { once: true });
    }
    return () => {
      window?.removeEventListener("click", handleClose);
    };
  }, [isOpen]);
  return (
    <div className={`Options-menu ${className ? className : ""}`}>
      <Button
        onClick={() => setIsOpen((open) => !open)}
        className="Options-menu__toggle"
      >
        {children ? (
          children
        ) : (
          <span className="Options-menu__toggle__default-dots">...</span>
        )}
      </Button>
      {isOpen && (
        <dialog
          open={true}
          className="Options-menu__list"
          onClick={() => (clickedInMenuRef.current = true)}
        >
          {confirmData ? (
            <div className="Options-menu__confirmation">
              <p role="alert" className="Options-menu__confirmation__message">
                {confirmData.title} {refTitle ? refTitle : ""} are you sure?
              </p>
              <Button
                onClick={confirmData.handleCancel}
                className="square"
                autoFocus
              >
                Cancel
              </Button>
              <Button
                onClick={confirmData.handleYes}
                className="square primary"
              >
                Yes
              </Button>
            </div>
          ) : (
            Object.entries(buttons).map(
              ([title, option]: [string, IOption]) => (
                <Button
                  key={title + JSON.stringify(option)}
                  onClick={() => handleCallAction(option, title)}
                  className="Options-menu__button square"
                >
                  {title}
                </Button>
              )
            )
          )}
        </dialog>
      )}
    </div>
  );
}

export default OptionsMenu;
