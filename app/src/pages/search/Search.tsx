import React, { useEffect, useState } from "react";
import Post from "../../components/post";
import NoSearchResult from "../../components/search/sub-components/no-results";
import SearchThreadComment from "../../components/search/sub-components/search-thread-comments";
import UserSearchResultCard from "../../components/search/sub-components/search-users";
import { processThread } from "../../services/feed/feed";
import { IProcessedThreadFeed } from "../../services/feed/feed.type";
import { hasSearchResultContent } from "../../services/search/search";
import { ISearchResults } from "../../services/search/search.types";
import { IThreadCommentWithParent }  from "../../services/search/search.types"

import "./Search.css";

function Search({
  searchResults,
  classNameInfo = "",
}: {
  searchResults: ISearchResults;
  classNameInfo?: string;
}) {
  const [publicThreads, setPublicThreads] = useState<IProcessedThreadFeed[]>(
    []
  );
  const [privateThreads, setPrivateThreads] = useState<IProcessedThreadFeed[]>(
    []
  );
  const [publicThreadComments, setPublicThreadComments] = useState<IThreadCommentWithParent[]>()
  const [privateThreadComments, setPrivateThreadComments] = useState<IThreadCommentWithParent[]>()
  const [queryString, setQueryString] = useState<string>("");

  useEffect(() => {
    setPublicThreads([]);
    setPrivateThreads([]);
    
    (async () => {
      if (
        searchResults.public_threads &&
        searchResults.public_threads.length > 0
      ) {
        const processedThreadData = await Promise.all(
          searchResults.public_threads.map((publicThread) =>
            processThread(publicThread)
          )
        );
        setPublicThreads([...publicThreads, ...processedThreadData]);
        setQueryString(searchResults.query_string);
      }

      if (
        searchResults.private_threads &&
        searchResults.private_threads?.length > 0
      ) {
        const processedPrivateThreadData = await Promise.all(
          searchResults.private_threads.map((privateThread) =>
            processThread(privateThread)
          )
        );
        setPrivateThreads([...privateThreads, ...processedPrivateThreadData]);
        setQueryString(searchResults.query_string);
      }

      if ( searchResults.public_thread_comments && 
          searchResults.public_thread_comments.length > 0
        ) {
          setPublicThreadComments([...searchResults.public_thread_comments])
          setQueryString(searchResults.query_string)
      }

      if (searchResults.private_thread_comments &&
        searchResults.private_thread_comments.length > 0
        ) {
          setPrivateThreadComments([...searchResults.private_thread_comments])
          setQueryString(searchResults.query_string)
        }
    })();
  }, [searchResults.public_threads, searchResults.private_threads]);
  
  return (
    <div className={`${classNameInfo || ""} Search-page-visible`}>
      {!hasSearchResultContent(searchResults) && <NoSearchResult />}
      {hasSearchResultContent(searchResults) &&
        searchResults.users?.map((user) => (
          <UserSearchResultCard {...user} key={user.id} />
        ))}
      {publicThreads.length > 0 &&
        publicThreads.map((publicThread) => (
          <Post
            {...{
              threadData: publicThread.threadData!,
              queryString: queryString,
              className: "Post__searchResult"
            }}
            showComments={true}
            key={publicThread.threadData?.id}
          />
        ))}
      {privateThreads.length > 0 &&
        privateThreads.map((privateThread) => (
          <Post
            {...{
              threadData: privateThread.threadData!,
              queryString: queryString,
              className: "Post__searchResult"
            }}
            showComments={true}
            key={privateThread.threadData?.id}
          />
        ))}
      {publicThreadComments?.length! > 0 && 
        publicThreadComments?.map((publicThreadComment) => (
          <SearchThreadComment queryString={queryString} 
          threadCommentData={publicThreadComment} />
        ))
      }
    </div>
  );
}

export default Search;
