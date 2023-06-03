import React, { useState, useEffect } from "react";
import './Git.css'
import { useToast } from '@chakra-ui/react';


export default function GitHubUserSearch() {
    const toast=useToast();
     const accessToken = "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";

const headers = {
  Authorization: `Bearer ${accessToken}`,
};
    
  const [searchTerm, setSearchTerm] = useState("Sahilll15");
  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [starredRepos, setStarredRepos] = useState(null);

  const handleSearch = async () => {
   try {
  

    const userResponse = await fetch(`https://api.github.com/users/${searchTerm}`);
    if (userResponse.ok) {
      const user = await userResponse.json();

      const repositoriesResponse = await fetch(user.repos_url);
      const repositories = await repositoriesResponse.json();

      const followersResponse = await fetch(user.followers_url);
      const followers = await followersResponse.json();

      const starredReposResponse = await fetch(`https://api.github.com/users/${searchTerm}/starred`);
      const starredRepos = await starredReposResponse.json();

      setUserData(user);
      setRepositories(repositories);
      setFollowers(followers);
      setStarredRepos(starredRepos);
    } else {
      
      toast({
          title: "User not found",
          description: "The specified GitHub user does notexist.",
          position:"top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
    }
    } catch (error) {
      console.log(error)
        toast({
                title: "Failed!!",
                description: "No Such Username",
                position:"Top",
                status: "error",
                duration: 9000,
                isClosable: true,

            })      
      
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRepoClick = (repoUrl) => {
    window.open(repoUrl, "_blank");
  };

  useEffect(() => {
    document.body.style.background = "#f5f5f5";
  }, []);

  return (
    <div className="container">
      <div className="search-container">
        <input type="text" value={searchTerm} onChange={handleInputChange} placeholder="Enter a GitHub username" />
        <button onClick={handleSearch}>Search</button>
      </div>

      {userData ? (
        <div className="user-container">
          <h2>{userData.login}</h2>
          <img src={userData.avatar_url} alt={userData.login} />
          <p>Name: {userData.name}</p>
          <p>Location: {userData.location}</p>
          <p>Followers: {followers.length}</p>
          <p>Total Repositories: {userData.public_repos}</p>
          <p>Starred Repositories: {starredRepos.length}</p>
        </div>
      ):(
        <div className="developer-url-message">
          <p>This is a developer's URL. You can search for other GitHub users.</p>
        </div>
      )}

      {repositories && (
        <div className="repo-container">
          <h3>Repositories</h3>
          <ul>
            {repositories.map((repo) => (
              <li key={repo.id} onClick={() => handleRepoClick(repo.html_url)}>
                {repo.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {followers && (
        <div className="followers-container">
          <h3>Followers</h3>
          <ul>
            {followers.map((follower) => (
              <li key={follower.id}>{follower.login}</li>
            ))}
          </ul>
        </div>
      )}

      {starredRepos && (
        <div className="starred-repos-container">
          <h3>Starred Repositories</h3>
          <ul>
            {starredRepos.map((repo) => (
              <li key={repo.id} onClick={() => handleRepoClick(repo.html_url)}>
                {repo.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
