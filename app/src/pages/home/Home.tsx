import React, { useEffect, useState } from "react";
import Button from "../../components/button";
import PostMaker from "../../components/postMaker";
import "./Home.css";
import editIcon from "../../images/editicon.svg";
import { IPostMakerProps } from "../../components/postMaker/PostMaker.type";
import Post from "../../components/post";
import ProfileCard from "../../components/profileCard";
import TopBar from "../../components/topBar";
import Nav from "../../components/nav";
import { useHistory } from "react-router-dom";
import Search from "../../pages/search";
import {
  createThreadAsync,
  readHomeFeedLatestAsync,
  selectHomeFeed,
  selectHomeStatus,
  selectLatestBucketDate,
} from "./homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { IFeedItem } from "../../services/feed/feed.type";
import Status from "../../components/status";

function Home() {
  const history = useHistory();

  const [searchIsTriggered, setSearchIsTriggered] = useState<boolean>(false);
  const [searchQueryString, setSearchQueryString] = useState<string>("");

  const dispatch = useDispatch();

  const status = useSelector(selectHomeStatus);
  const feed = useSelector(selectHomeFeed);
  const lastestFeedItem = useSelector(selectLatestBucketDate);

  useEffect(() => {
    dispatch(
      readHomeFeedLatestAsync({
        query: lastestFeedItem ? `newerThanDate=${lastestFeedItem}` : "",
      })
    );
  }, []);

  const resetPostMaker = () => {
    setIsPostMakerOpen(false);
    history.location.hash.match("#newpost") && history.push("/home");
  };
  const postMakerOptions: IPostMakerProps = {
    title: "Share",
    placeholder: "Share your thoughts. Add photos or hashtags.",
    onSubmit: ({ content, threadVisibility }) => {
      const data = {
        htmlContent: content,
        threadType: 0,
        visibility: threadVisibility,
        hashTags: [],
      };
      dispatch(createThreadAsync(data));
      resetPostMaker();
    },
    handleCancel: () => {
      resetPostMaker();
    },
    className: "Home__post-maker",
    fullView: true,
  };
  const [isPostMakerOpen, setIsPostMakerOpen] = useState(false);
  useEffect(() => {
    if (history.location.hash.match("#newpost")) {
      setIsPostMakerOpen(true);
    } else {
      setIsPostMakerOpen(false);
    }
  }, [history.location.hash]);

  const FeedItem = ({
    documentId,
    documentType,
    documentUpdatedAt,
  }: IFeedItem) => {
    switch (documentType) {
      case "thread":
        return (
          <li className="Home-page__feed__list__item">
            {/* TODO: edit Post componet to thread data from home slice */}
            <Post threadId={documentId} />
          </li>
        );
      default:
        return <li className="Home-page__invisible-item"></li>;
    }
  };

  const onSearchSubmit = (queryString: string) => {
    setSearchIsTriggered(!!queryString);
    setSearchQueryString(queryString);
  };

  return (
    <div className="Home-page">
      <Status status={status} />

      <TopBar className="Home-page__top-bar" onSearchSubmit={onSearchSubmit} />
      <ProfileCard
        type="home-page"
        userId="me"
        className="Home-page__profile"
      />
      <Search query={searchQueryString} triggered={searchIsTriggered}>
        <div className="Home-page__post-maker-start">
          {!isPostMakerOpen ? (
            <Button
              onClick={() => setIsPostMakerOpen(true)}
              className="Home-page__post-maker-start__button"
            >
              <img src={editIcon} alt="" />
              <h1>Share your thoughts or photos</h1>
            </Button>
          ) : (
            <PostMaker {...postMakerOptions} />
          )}
        </div>
        <div className="Home-page__feed">
          <ul className="Home-page__feed__list">
            {feed.map((item) =>
              item?.documentId ? (
                <FeedItem {...item} key={"feedItem" + item?.documentId} />
              ) : null
            )}
          </ul>
        </div>
      </Search>
      <Nav />
    </div>
  );
}

export default Home;
