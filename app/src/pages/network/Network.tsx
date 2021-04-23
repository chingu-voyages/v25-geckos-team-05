import React, { useState, useEffect, useRef } from "react";
import "./Network.css";
import backIcon from "../../images/backicon.svg";
import Button from "../../components/button";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import ProfileCard from "../../components/profileCard";
import OptionsMenu from "../../components/optionsMenu";
import { IUserConnection } from "../../services/user/user.type";
import Nav from "../../components/nav";
import TopBar from "../../components/topBar";
import Search from "../search";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAsync,
  removeConnectionAsync,
  selectCurrentUserId,
  selectProfileStatus,
  selectUserById,
  selectUserConnections,
} from "../profile/profileSlice";
import Status from "../../components/status";

function Network() {
  const match: any = useRouteMatch("/:userId");
  const userId = useRef(match.params.userId.toLowerCase());
  const history = useHistory();
  const handleGoBack = () => history.goBack();

  const connections = useSelector(selectUserConnections(userId.current));
  const status = useSelector(selectProfileStatus);
  const currentUserId = useSelector(selectCurrentUserId);
  const isMe = userId.current === "me" || userId.current === currentUserId;
  const dispatch = useDispatch();

  const [searchIsTriggered, setSearchIsTriggered] = useState<boolean>(false);
  const [searchQueryString, setSearchQueryString] = useState<string>("");

  const RemoveOption = ({
    connectionData,
  }: {
    connectionData: IUserConnection;
  }) => {
    return (
      <OptionsMenu
        buttons={{
          "Remove connection": {
            action: () => {
              dispatch(
                removeConnectionAsync({ connectionId: connectionData.userId })
              );
            },
            confirm: true,
          },
        }}
        refTitle={`${connectionData.firstName} ${connectionData.lastName}`}
      />
    );
  };

  const onSearchSubmit = (queryString: string) => {
    setSearchIsTriggered(!!queryString);
    setSearchQueryString(queryString);
  };

  useEffect(() => {
    !currentUserId && dispatch(getUserAsync("me"));
  });

  return (
    <div className="Network-page">
      <Status status={status} />
      <header className="Network-page__top-bar--mobile">
        <Button role="link" onClick={handleGoBack}>
          <img className="Network-page__back-icon" src={backIcon} alt="back" />
        </Button>
        <h1 className="Network-page__title">Connections</h1>
      </header>
      <TopBar
        className="Network-page__top-bar--desktop"
        onSearchSubmit={onSearchSubmit}
      />
      <Search query={searchQueryString} triggered={searchIsTriggered}>
        <div />
        <main className="Network-page__main">
          <ul className="Network-page__connections-list">
            {connections &&
              (Object.values(connections) as IUserConnection[]).map(
                (connectionData) => (
                  <li key={connectionData.userId}>
                    <Link
                      className="connections-list__link"
                      to={`/${connectionData.userId}/profile`}
                    >
                      <ProfileCard
                        type="connection"
                        {...{ userId: connectionData.userId, connectionData }}
                      />
                    </Link>
                    {isMe && <RemoveOption {...{ connectionData }} />}
                  </li>
                )
              )}
          </ul>
        </main>
      </Search>
      <Nav />
    </div>
  );
}

export default Network;
