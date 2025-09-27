import React from 'react';

function SidebarTopics(props) {
  return (
    <div>
      <h1 className="mt-12 ml-4 text-gray-500">{props.topic}</h1>
    </div>
  );
}

export default SidebarTopics;
