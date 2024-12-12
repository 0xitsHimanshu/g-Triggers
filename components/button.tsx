import React from "react";

function Button({ providerName, bgColor, method, onClick}: { providerName: string; bgColor: string; method: string; onClick: () => void}) {
  return (
    <button className={`bg-${bgColor}-600 hover:bg-${bgColor}-700 text-white font-bold py-3 px-6 rounded-lg w-full`}
        onClick={onClick}
    >
      {method} with {providerName}
    </button>
  );
};

export default Button;