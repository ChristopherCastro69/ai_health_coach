import React, { useEffect, useState } from "react";

function Popup({ isOpen, setOpen, setUpdate, update }) {
  const [modelForPush, setModelForPush] = useState({
    displayName: "",
    modelName: "",
    includesImage: false,
  });

  const handleModels = () => {
    let models = localStorage.getItem("models");
    if (models) {
      if (modelForPush.displayName !== "" || modelForPush.modelName !== "") {
        let parsed = JSON.parse(models);
        parsed.push(modelForPush);
        localStorage.setItem("models", JSON.stringify(parsed));
        setOpen(false);
        setUpdate(!update);
      }
    } else {
      if (modelForPush.displayName !== "" || modelForPush.modelName !== "") {
        let arr = [];
        arr.push(modelForPush);
        localStorage.setItem("models", JSON.stringify(arr));
      }
    }
  };

  const handleInput = (e) => {
    const { name, value, checked } = e.target;
    setModelForPush((current) => ({
      ...current,
      [name]: name === "includesImage" ? checked : value,
    }));
  };

  useEffect(() => {
    console.log(modelForPush);
  }, [modelForPush]);

  return (
    <div
      className={
        isOpen
          ? "fixed z-[9999] w-full h-screen top-0 left-0 bg-[rgba(0,0,0,.6)] items-center justify-center opan flex"
          : "fixed z-[9999] w-full h-screen top-0 left-0 bg-[rgba(0,0,0,.6)] items-center justify-center opani hidden"
      }
    >
      <div className="lg:w-[32rem] w-11/12 bg-primary py-4 flex items-center justify-center rounded-md flex-col sca">
        <div className="w-full flex items-end justify-end px-3">
          <button
            onClick={() => setOpen(false)}
            className="text-white bg-input hover:bg-hovercl mb-2 p-2 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <input
          onChange={handleInput}
          name="displayName"
          type="text"
          className="text-text bg-input wc border-none outline-none rounded-xl p-4 focus:bg-hovercl my-2"
          placeholder="Display name"
        />
        <input
          onChange={handleInput}
          name="modelName"
          type="text"
          className="text-text bg-input wc border-none outline-none rounded-xl p-4 focus:bg-hovercl my-2"
          placeholder="Model name ex. gemma2:2b"
        />
        <div className="flex items-center justify-start text-text w-full px-4">
          <label htmlFor="">Is model includes image</label>
          <input
            onChange={handleInput}
            name="includesImage"
            type="checkbox"
            className="w-5 h-5 ml-2"
          />
        </div>
        <button
          onClick={handleModels}
          className="text-white bg-hovercl my-2 hover:bg-hovercl wc py-2 text-center rounded-xl"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default Popup;
