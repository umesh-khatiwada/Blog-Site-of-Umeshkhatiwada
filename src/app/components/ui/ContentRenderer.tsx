import React from "react";

const ContentRenderer: React.FC<{ description: string }> = ({ description }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: description }} />
  );
};

export default ContentRenderer;
