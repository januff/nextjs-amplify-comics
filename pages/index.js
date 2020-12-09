import { useState } from 'react'
import Predictions from "@aws-amplify/predictions"
import { useCreateScan } from '../hooks/datastax'

export default function Home() {
  const [fullText, setFullText] = useState("No text yet")
  const [scan, setScan] = useState(null)
  const [file, setFile] = useState(null)
  const [src, setSrc] = useState(null)
  const [createScan, createInfo] = useCreateScan()

  const selectFile = e => {
    setScan(null)
    const selected = e.target.files[0]
    setFile(selected)
    setSrc(URL.createObjectURL(selected))
  }

  const scanImage = () => {
    console.log('scanning')
    Predictions.identify({
      text: { 
        source: { file }, 
        format: "PLAIN"}
      })
      .then(scan => {
        setScan(scan)
        setFullText(scan.text.fullText)
      })
    }
    
    const saveText = () => {
      console.log('saving')
      let update = {
        name: file.name,
        size: file.size,
        type: file.type,
        ...scan.text,
      }
      createScan(update)
  }

  return (
    
    <section>
      
      {src && 
        <div className="preview">
          <img src={src} />
        </div>
      }

      <div className="file-input">
        <input 
          type="file"
          accept="image/png, image/jpeg" 
          value=''
          onChange={selectFile}  
          className="file" 
        />
        <label htmlFor="file">
          Select
        </label>
        <input 
          type="button" 
          value="Scan" 
          onClick={scanImage}
          disabled={!file}
        />
        <input 
          type="button" 
          value="Save" 
          onClick={saveText}
          disabled={!scan}
          />
      </div>

    </section>
  )
}
