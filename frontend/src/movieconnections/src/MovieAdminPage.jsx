
import { useState } from 'react'
import './MovieAdminPage.css';

function MovieAdminPage() {
  const [game, setGame] = useState([
    {
      title1: "", 
      clues1: [null, null, null, null]
    },
    {
      title2: "",
      clues2: [null, null, null, null]
    },
    {
      title3: "",
      clues3: [null, null, null, null]
    },
    {
      title4: "",
      clues4: [null, null, null, null]
    },
  ])
  const [goLiveDate, setGoLiveDate] = useState("");

  async function handleClueImageChange(movieIndex, clueIndex, file) {
    setGame(prev => {
      const copy = [...prev];
      const movieKey = Object.keys(copy[movieIndex])[1];
      copy[movieIndex][movieKey][clueIndex] = file;
      return copy;
    });
  }

  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_movie_clues");
    formData.append("folder", `movie_clues/${new Date().toISOString().slice(0,10)}`) // fix later to use a set date.

    const res = await fetch("https://api.cloudinary.com/v1_1/dmtcclna1/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");

    const data = await res.json();
    return data.secure_url;

  }
 

  async function handleSubmit() {
    const payload = {};
    let totalSize = 0;
    payload.goLiveDate = goLiveDate;

    const uploadPromises = [];

    game.forEach((movie, movieIndex) => {
      const titleKey = Object.keys(movie)[0];
      const cluesKey = Object.keys(movie)[1];
      payload[`title${movieIndex}`] = movie[titleKey];
      payload[`clues${movieIndex}`] = [];

      movie[cluesKey].forEach((clue, clueIndex) => {
        if (clue) {
          totalSize += clue.size;

          uploadPromises.push(
            uploadToCloudinary(clue).then(url => {
              payload[`clues${movieIndex}`][clueIndex] = url;
            })
          );
        }
      });
    });

    console.log(`Total upload size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);


    await Promise.all(uploadPromises);


    try {
      const res = await fetch('/api/movieconnections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('Game created: ', data);
    } catch (err) {
      console.error('Failed to submit game', err);
    }
  }







  return (
      <div className="admin-page-wrapper">
      <h1>create game</h1>
      <div className='game-create-wrapper'>

        {/* Movie 1 */}
        <div className='movie-wrapper' style={{gridRow: '1/2', border: '3px solid Green'}}>
          <div className='movie-clues-row'>
            {[0,1,2,3].map(i => (
              <div
                key={i}
                className="movie-clue"
                onClick={() => document.getElementById(`file0-${i}`).click()}
              >
                {game[0].clues1[i] ? (
                  <img
                    src={URL.createObjectURL(game[0].clues1[i])}
                    alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  `Clue ${i+1}`
                )}
                <input
                  type="file"
                  id={`file0-${i}`}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => handleClueImageChange(0, i, e.target.files[0])}
                />
              </div>
            ))}
            <input
              type='text'
              className='movie-name-input'
              placeholder='Title'
              value={game[0].title1}
              onChange={e => setGame(prev => {
                const copy = [...prev];
                copy[0].title1 = e.target.value;
                return copy;
              })}
            />
          </div>
        </div>

        {/* Movie 2 */}
        <div className='movie-wrapper' style={{gridRow: '2/3', border: '3px solid Yellow'}}>
          <div className='movie-clues-row'>
            {[0,1,2,3].map(i => (
              <div
                key={i}
                className="movie-clue"
                onClick={() => document.getElementById(`file1-${i}`).click()}
              >
                {game[1].clues2[i] ? (
                  <img
                    src={URL.createObjectURL(game[1].clues2[i])}
                    alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  `Clue ${i+1}`
                )}
                <input
                  type="file"
                  id={`file1-${i}`}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => handleClueImageChange(1, i, e.target.files[0])}
                />
              </div>
            ))}
            <input
              type='text'
              className='movie-name-input'
              placeholder='Title'
              value={game[1].title2}
              onChange={e => setGame(prev => {
                const copy = [...prev];
                copy[1].title2 = e.target.value;
                return copy;
              })}
            />
          </div>
        </div>

        {/* Movie 3 */}
        <div className='movie-wrapper' style={{gridRow: '3/4', border: '3px solid Red'}}>
          <div className='movie-clues-row'>
            {[0,1,2,3].map(i => (
              <div
                key={i}
                className="movie-clue"
                onClick={() => document.getElementById(`file2-${i}`).click()}
              >
                {game[2].clues3[i] ? (
                  <img
                    src={URL.createObjectURL(game[2].clues3[i])}
                    alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  `Clue ${i+1}`
                )}
                <input
                  type="file"
                  id={`file2-${i}`}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => handleClueImageChange(2, i, e.target.files[0])}
                />
              </div>
            ))}
            <input
              type='text'
              className='movie-name-input'
              placeholder='Title'
              value={game[2].title3}
              onChange={e => setGame(prev => {
                const copy = [...prev];
                copy[2].title3 = e.target.value;
                return copy;
              })}
            />
          </div>
        </div>

        {/* Movie 4 */}
        <div className='movie-wrapper' style={{gridRow: '4/5', border: '3px solid Purple'}}>
          <div className='movie-clues-row'>
            {[0,1,2,3].map(i => (
              <div
                key={i}
                className="movie-clue"
                onClick={() => document.getElementById(`file3-${i}`).click()}
              >
                {game[3].clues4[i] ? (
                  <img
                    src={URL.createObjectURL(game[3].clues4[i])}
                    alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  `Clue ${i+1}`
                )}
                <input
                  type="file"
                  id={`file3-${i}`}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => handleClueImageChange(3, i, e.target.files[0])}
                />
              </div>
            ))}
            <input
              type='text'
              className='movie-name-input'
              placeholder='Title'
              value={game[3].title4}
              onChange={e => setGame(prev => {
                const copy = [...prev];
                copy[3].title4 = e.target.value;
                return copy;
              })}
            />
          </div>
        </div>

      </div>

      <div className='settings'>
        <input type="date" id="goLiveDate" value={goLiveDate} onChange={e => setGoLiveDate(e.target.value)}/>
        <button className='submit-button' onClick={() => handleSubmit()}>Submit</button>
      </div>
    </div>
  );
}

export default MovieAdminPage;
