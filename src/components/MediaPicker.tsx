'use client'
// pra funcionar onchange, padrao do next

import { ChangeEvent, useEffect, useState } from 'react'

export function MediaPicker(props: any) {
  let { coverUrl } = props;

  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (props) {
      setPreview(coverUrl)
    }
  }, [coverUrl]);

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    coverUrl = null

    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = coverUrl == null ? URL.createObjectURL(files[0]) : coverUrl
    setPreview(previewURL)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        name="coverUrl"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}
