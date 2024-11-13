import React, { useState } from "react"
import ImageUploading, { ImageListType } from "react-images-uploading"

const BasicImageUploader = () => {
  const [images, setImages] = useState<ImageListType>([])
  const maxNumber = 69

  const onChange = (imageList: ImageListType) => {
    // data for submit
    setImages(imageList)
  }

  return (
    <div>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div>
            <button
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            <div>
              {imageList.map((image, index) => (
                <div key={index} style={{ margin: "10px" }}>
                  <img src={image.data_url} alt="" width="100" />
                  <div>
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  )
}

export default BasicImageUploader
