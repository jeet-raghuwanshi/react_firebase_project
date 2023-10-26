import { useState, useEffect } from "react";
import {Auth} from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import { getDocs, doc, addDoc, deleteDoc, updateDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList,setMovieList] = useState([]);

  //New movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // Update title state 
  const [updatedTitle, setUpdatedTitle] = useState("");

  // file upload state
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db,"movies");

  const getMovieList = async () => {
    //read the data from the movie list
    // set the movie list 
      try{
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMovieList(filteredData);
      } catch(error){
        console.error(error);
      }
    };

  const onsubmitMovie = async () => {
    try{
      await addDoc(moviesCollectionRef,{
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        recievedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,   //   "?"  is just a way to prevent errors in javascript
      });
      getMovieList();
    } catch(error){
      console.error(error);
    }
  };

  useEffect( () => {
    getMovieList();
  }, [onsubmitMovie]);


  const deleteMovie = async (id) => {
    try{
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
    } catch(error){
      console.error(error);
    }

  };

  const updateTitle = async (id) => {
    try{
      const movieDoc = doc(db, "movies",id);
      await updateDoc(movieDoc, {title: updatedTitle});
    } catch(error){
      console.error(error);
    }
  }

  const uplaodFile = async  () => {
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, `projectfiles/${fileUpload.name}`);
    try{
    await uploadBytes(filesFolderRef, fileUpload);
    } catch(error){
      console.error(error);
    }
  }

  return (
    <div className="App">
    <Auth />
    <div>
      <input placeholder="Movie title..." 
      onChange={(e) => setNewMovieTitle(e.target.value)}
      />
      <input placeholder="Release Date..." type="number" 
      onChange={(e) => setNewReleaseDate(Number(e.target.value))}
      />
      <input type="checkbox" 
        checked={isNewMovieOscar} 
        onChange={(e) => setIsNewMovieOscar(e.target.value)}/>
      <label>Recieved an Oscar</label>
      <button onClick={onsubmitMovie}>Submit Movie</button>
    </div>

    <div>
      {movieList.map((movie) => (
        <div>
          <h1 style={{color: movie.recievedAnOscar ? "green" : "red"}}> {movie.title} </h1>
          <p>Date : {movie.releaseDate}</p>
          <button onClick={() => deleteMovie(movie.id)}>Delete movie</button>
          <input placeholder="new title..." onChange={(e) => setUpdatedTitle(e.target.value)}/>
          <button onClick={() => updateTitle(movie.id)}>Update title</button>
        </div>
      ))}
    </div>
    <div>
      <input type="file" onChange={(e) => setFileUpload(e.target.files[0])}/>
      <button onClick={uplaodFile}>Upload File</button>
    </div>
    </div>
  );
}

export default App;