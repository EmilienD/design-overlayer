import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')
  const [images, setImages] = useState<{ file: File; url: string }[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [areControlsHidden, setAreControlsHidden] = useState(false)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch((err) => {
        setError(err.message)
      })
  }, [])
  useEffect(() => {
    if (images.length && selectedIndex >= images.length) {
      setSelectedIndex(images.length - 1)
    }
  }, [images.length, selectedIndex])
  return (
    <>
      {error && <p>{error}</p>}

      <div className="container">
        <video ref={videoRef} autoPlay className="video" />
        {images[selectedIndex] && (
          <div className="overlay-container">
            <img src={images[selectedIndex].url} className="overlayed-image" />
          </div>
        )}
        <div
          className={['controls', areControlsHidden ? 'hidden' : ''].join(' ')}
          onClick={(ev) => {
            if (ev.currentTarget === ev.target)
              setAreControlsHidden(!areControlsHidden)
          }}
        >
          <label className="input-file-label">
            Add images
            <input
              className="file-input"
              type="file"
              onChange={(event) => {
                if (event.target.files) {
                  const fileArray = []
                  for (const file of event.target.files) {
                    const url = URL.createObjectURL(file)
                    fileArray.push({ file, url })
                  }
                  setImages([...images, ...fileArray])
                }
              }}
              accept="image/*"
              multiple
            />
          </label>
          <ul className="file-list">
            {images.map(({ url }, i) => (
              <li key={url} className={selectedIndex === i ? 'selected' : ''}>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  onDoubleClick={() => {
                    URL.revokeObjectURL(images[i].url)
                    setImages(images.filter((image) => image.url !== url))
                  }}
                >
                  <img src={url} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
