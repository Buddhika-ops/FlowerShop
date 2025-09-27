import React from 'react';

function SidebarButtons(props) {
  return (
    <div>
      <button
        type="button"
        className="flex items-center gap-3 w-full bg-gray-100 rounded-md hover:bg-gray-300 hover:rounded-md  text-gray-700  px-4 py-3  transition-colors duration-300"
        onClick={props.onClick}
      >
        <div className="w-6 h-6 ">
          <img src={props.icon} alt={props.lable} />
        </div>
        {props.lable}
      </button>
    </div>
  );
}

export default SidebarButtons;
