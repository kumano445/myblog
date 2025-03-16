"use client"; // クライアントコンポーネント

import { useState, useEffect } from "react";

export default function PostContent({ content }) {
  const [renderedContent, setRenderedContent] = useState("");

  useEffect(() => {
    setRenderedContent(content);
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />;
}
