import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFlag } from "react-icons/bs";

const ActionContainer = () => {
  const icons = [
    {
      icon: <AiOutlineClose size={30} className="cursor-pointer text-white" />,
      text: "Close button clicked.",
      component: null,
    },
    {
      icon: <h1 className="text-4xl">½</h1>,
      text: (
        <div className="flex h-full w-full rounded-md  bg-blue px-2">
          <h1>Rematch Offer Sent..</h1>
        </div>
      ),
      component: null,
    },
    {
      icon: <BsFlag size={25} className="cursor-pointer text-white" />,
      text: "Flag button clicked.",
      component: (
        <div className="flex-col">
          <button>Send Rematch Offer</button>
          <button>Find New Opponent</button>
        </div>
      ),
    },
  ];
  const [activeIcon, setActiveIcon] = useState(null);
  const handleIconClick = (index) => {
    setActiveIcon(index);
    if (activeIcon === index) {
      setShowHalf(true);
    }
  };

  const resetActiveIcon = () => {
    setActiveIcon(null);
    setShowHalf(false);
    setShowFlag(false);
    setShowClose(false);
  };
  const [showClose, setShowClose] = useState(false);
  const [showHalf, setShowHalf] = useState(false);
  const [showFlag, setShowFlag] = useState(false);

  const toggleClose = () => {
    setShowClose(!showClose);
    setShowHalf(false);
    setShowFlag(false);
  };

  const toggleHalf = () => {
    setShowClose(false);
    setShowHalf(!showHalf);
    setShowFlag(false);
  };

  const toggleFlag = () => {
    setShowClose(false);
    setShowHalf(false);
    setShowFlag(!showFlag);
  };

  return (
    <div className="relative flex h-20 w-full items-center justify-center gap-10  text-white">
      {icons.map((item, index) => (
        <div
          key={index}
          className={`${
            activeIcon !== null && activeIcon !== index
              ? "hidden"
              : "bg-blue-500 gap-w flex pb-1 text-center font-sans text-white hover:scale-150"
          } ${
            activeIcon === index
              ? showClose || showHalf || showFlag
                ? ""
                : ""
              : ""
          }`}
        >
          <ul className="pr-3 text-sm">
            <li
              className={`inline-block w-auto transform transition-transform  ${
                activeIcon === index ? " " : ""
              }`}
              onClick={() => handleIconClick(index)}
            >
              {showHalf && activeIcon === index ? item.text : item.icon}
            </li>
          </ul>
          {showClose || showFlag ? (
            <div>
              {item.icon ===
              <AiOutlineClose size={30} className="cursor-pointer text-white" />
                ? showClose
                  ? "Close button clicked."
                  : ""
                : item.icon ===
                  <BsFlag size={25} className="cursor-pointer text-white" />
                ? showFlag
                  ? "Match Resigned"
                  : ""
                : ""}
            </div>
          ) : null}
        </div>
      ))}
      {activeIcon !== null && (
        <div className="bg-blue-500 top-50 absolute right-0 text-center font-sans text-white">
          <ul className="text-4xl">
            <li
              className="inline-block w-auto transform transition-transform hover:scale-150"
              onClick={() => resetActiveIcon()}
            >
              <AiOutlineClose size={30} className="cursor-pointer text-white" />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionContainer;
