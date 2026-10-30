import { useState } from 'react'
import './App.css'

async function isEpub(file:File): Promise<boolean> {
  const buffer = await file.slice(0, 58).arrayBuffer()
  const bytes = new Uint8Array(buffer)

  if (bytes.length < 58) {
    return false
  }

  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04
  if (!isZip) {
    return false
  }

  const text = new TextDecoder().decode(bytes.slice(30, 58))
  return text === 'mimetypeapplication/epub+zip'
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [epubResult, setEpubResult] = useState<boolean | null>(null)

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0] ?? null
    setFile(picked)
    setEpubResult(null)

    if (!picked) {
      return
    }

    const result = await isEpub(picked)
    setEpubResult(result)
  }

  return (
    <main>
      <input
        type="file"
        accept=".epub,application/epub+zip"
        onChange={handleChange}
      />
      {file && (
        <>
          <p>
            {file.name} 0 {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <p>
            {epubResult === null && 'Checking...'}
            {epubResult === true && 'Valid EPUB'}
            {epubResult === false && 'Not an EPUB'}
          </p>
        </>
      )}
      <h1>EPUB Detector</h1>
    </main>
  )
}

export default App
