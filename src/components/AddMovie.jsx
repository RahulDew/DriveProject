import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AddMovie = ({ getMovies }) => {
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState(0);
  const [gern, setGern] = useState("");
  const [length, setLength] = useState("");
  const [recivedOscar, setRecivedOscar] = useState(false);

  const moviesCollectionRef = collection(db, "movies");

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(moviesCollectionRef, {
        title: title,
        releaseDate: releaseDate,
        gern: gern,
        length: length,
        recivedOscar: recivedOscar,
        userId: auth?.currentUser?.uid,
        addedBy: auth?.currentUser?.email,
      });
    } catch (error) {
      console.log(error);
    }

    getMovies();
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Add Movie</h1>
      <form onSubmit={handleAddSubmit}>
        <input
          type="text"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="released date"
          onChange={(e) => setReleaseDate(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="gern"
          onChange={(e) => setGern(e.target.value)}
        />
        <input
          type="text"
          placeholder="length"
          onChange={(e) => setLength(e.target.value)}
        />
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={recivedOscar}
            style={{
              width: "13px",
              height: "13px",
            }}
            onChange={(e) => setRecivedOscar(e.target.checked)}
          />
          <label>Recived Oscar</label>
        </div>
        <button>Add</button>
      </form>
    </div>
  );
};

export default AddMovie;
