import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./components/Auth";
import { db, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import AddMovie from "./components/AddMovie";

function App() {
  // for movies list getting from the database
  const [movies, setMovies] = useState([]);

  // for adding new movie in database
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedReleaseDate, setUpdatedReleaseDate] = useState(0);
  const [updatedGern, setUpdatedGern] = useState("");
  const [updatedLength, setUpdatedLength] = useState("");
  const [updatedRecivedOscar, setUpdatedRecivedOscar] = useState(false);

  // for uploading file
  const [file, setFile] = useState(null);
  console.log(file);

  const moviesCollectionRef = collection(db, "movies");

  const getMovies = async () => {
    const data = await getDocs(moviesCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log(filteredData);
    setMovies(filteredData);
  };

  useEffect(() => {
    getMovies();
  }, []);

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovies();
  };

  const updateMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, {
      title: updatedTitle,
      releaseDate: updatedReleaseDate,
      recivedOscar: updatedRecivedOscar,
      gern: updatedGern,
      length: updatedGern,
    });
    getMovies();
  };

  const handleUploadFile = async () => {
    if (!file) return;
    const filesFolderRef = ref(storage, `sample-wallpapers/${file.name}`);
    try {
      console.log("bhai yahan aa rha h flow");
      await uploadBytes(filesFolderRef, file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container">
        <Auth />

        <div
          className="file-upload-wrapper"
          style={{
            backgroundColor: "rgba(99, 99, 99, 0.33)",
            padding: "3rem",
            borderRadius: "10px",
            width: "30rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            textAlign: "center",
            margin: "auto",
          }}
        >
          <input
            type="file"
            style={{
              backgroundColor: "rgba(99, 99, 99, 0.5)",
              padding: "2rem",
              borderRadius: "10px",
            }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            style={{
              padding: "0.8rem",
              borderRadius: "10px",
              backgroundColor: "rgba(84, 226, 167, 0.611)",
              cursor: "pointer",
            }}
            onClick={handleUploadFile}
          >
            Upload
          </button>
        </div>

        <AddMovie getMovies={getMovies} />
        <h1 style={{ textAlign: "center" }}>Movies List</h1>
        <div className="main-list-wrapper">
          {movies.map((item) => (
            <div key={item.id} className="movie-data">
              <div
                style={{
                  color: item.recivedOscar
                    ? "rgb(84, 226, 167)"
                    : "rgb(220, 76, 76)",
                }}
              >
                {" "}
                Title: {item.title}
              </div>
              <div> - {item.releaseDate}</div>
              <div> - {item.gern}</div>
              <div> - {item.length}</div>
              <div> added by - {item.addedBy}</div>
              <button
                style={{
                  padding: "0.8rem",
                  borderRadius: "10px",
                  backgroundColor: "rgb(320, 76, 76)",
                  marginTop: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={() => deleteMovie(item.id)}
              >
                delete
              </button>
              <h3
                style={{
                  marginTop: "1rem",
                }}
              >
                update data
              </h3>
              <div className="update-movies-container">
                <input
                  type="text"
                  placeholder="title"
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="released date"
                  onChange={(e) =>
                    setUpdatedReleaseDate(Number(e.target.value))
                  }
                />
                <input
                  type="text"
                  placeholder="gern"
                  onChange={(e) => setUpdatedGern(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="length"
                  onChange={(e) => setUpdatedLength(e.target.value)}
                />
                <div className="checkbox-container">
                  <input
                    style={{
                      width: "13px",
                      height: "13px",
                    }}
                    type="checkbox"
                    onChange={(e) => setUpdatedRecivedOscar(e.target.checked)}
                  />
                  <label
                    style={{
                      fontSize: "1rem",
                    }}
                  >
                    Recived Oscar
                  </label>
                </div>
                <button
                  style={{
                    padding: "0.8rem",
                    borderRadius: "10px",
                    cursor: "pointer",
                    backgroundColor: "rgba(123, 123, 123, 0.329)",
                    marginTop: "0.5rem",
                  }}
                  onClick={() => updateMovie(item.id)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
