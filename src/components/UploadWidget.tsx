import { useEffect, useRef, useState } from "react";
import { CloudinaryUploadEvent } from "../types/clodinary";
import { Button } from "rsuite";

import FileUploadIcon from "@rsuite/icons/FileUpload";
export function UploadWidget(props: Props) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [imageUrl, setImageUrl] = useState("");
  const secureUri = "http://res.cloudinary.com/dfsknqfnh/image/upload/";
  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dfsknqfnh",
        uploadPreset: "hapak162",
      },
      (error: any, result: CloudinaryUploadEvent) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          setImageUrl(`${secureUri}${result.info.path}`);
          props.onSetImageUrl(`${secureUri}${result.info.path}`);
          console.log("result", result);
          console.log("error", error);
        }
      }
    );
  }, []);

  return (
    <div className="w-full">
      {props.previewType === "button" && (
        <Button className="w-full" onClick={() => widgetRef.current.open()}>
          {props.text}
        </Button>
      )}
      {props.previewType === "addPhoto" && (
        <FileUploadIcon onClick={() => widgetRef.current.open()} />
      )}
    </div>
  );
}
UploadWidget.defaultProps = {
  text: "",
  previewType: "button",
  onSetImageUrl: () => {},
};

interface Props {
  text: string;
  onSetImageUrl: Function;
  previewType: "button" | "addPhoto";
}
