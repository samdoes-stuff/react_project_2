import React, { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Results({ element, artwork, dogImg, catImg }) {
  const { name } = useContext(UserContext);

  return (
    <div>
      <p>
        <strong>{name}</strong>, your element is: {element}
      </p>
      {artwork ? (
        <div className="artwork">
          <h2>{artwork.title}</h2>
          <img src={artwork.primaryImage} alt={artwork.title} />
          <p>{artwork.artistDisplayName}</p>
          <p>{artwork.objectDate}</p>
        </div>
      ) : (
        <p>No artwork found.</p>
      )}
      <div>
        <h3>Dog Image</h3>
        {dogImg ? <img src={dogImg} alt="Random Dog" style={{maxWidth: "200px"}}/> : <p>Loading dog image...</p>}
        <h3>Kitten Image</h3>
        {catImg ? <img src={catImg} alt="Random Kitten" style={{maxWidth: "200px"}}/> : <p>Loading kitten image...</p>}
      </div>
    </div>
  );
}