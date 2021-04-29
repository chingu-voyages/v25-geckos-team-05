import React, { useState } from "react";
import Comment from "../../../../components/comment";
import "./Search-thread-comments.css";
import Post from "../../../post";
import { useSelector } from "react-redux";
import { selectCommentById } from "../../../../pages/home/homeSlice";

function SearchThreadComment({
  className,
  threadCommentId,
  queryString,
}: {
  queryString: string;
  threadCommentId: string;
  className?: string;
}) {
  const commentData = useSelector(selectCommentById(threadCommentId));

  const [
    expandedParentThreadVisible,
    setExpandedParentThreadVisible,
  ] = useState(false);

  const parentThreadDropDown = (visible: boolean) => {
    if (commentData?.parentThreadId && visible) {
      return (
        <Post
          {...{
            threadId: commentData.parentThreadId!,
            queryString: queryString,
          }}
          visibleExpanded={expandedParentThreadVisible}
          className="SearchThreadComment__parent-thread-excerpt"
        />
      );
    }
  };
  return (
    <div className={`${className || ""} SearchThreadComment__main`}>
      <div className="SearchThreadComment__Comment-section">
        <div className="SearchThreadComment__query-string">
          <p>"{queryString}"</p>
        </div>
        <Comment commentId={threadCommentId} />
        <div
          className="SearchThreadComment__expand-parent-thread-button"
          onClick={() => setExpandedParentThreadVisible((show) => !show)}
        >
          {expandedParentThreadVisible
            ? "- Hide parent thread"
            : "+ Show parent thread"}
        </div>
        {parentThreadDropDown(expandedParentThreadVisible)}
      </div>
    </div>
  );
}

export default SearchThreadComment;
