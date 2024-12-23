import { useEffect, useRef, useState } from "react";
import { CloudinaryUploadEvent } from "../types/clodinary";
import { Button, Message, useToaster } from "rsuite";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import ImageIcon from "@rsuite/icons/Image";
export function UploadWidget(props: Props) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [imageUrl, setImageUrl] = useState("");
  const allowedFormats = ["jpg", "png", "jpeg"];
  imageUrl;
  const toaster = useToaster();

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
          if (!allowedFormats.includes(result.info.format)) {
            toaster.push(
              <Message type="error" showIcon>
                יש להעלות קובץ PNG בלבד
              </Message>,
              { placement: "topCenter" }
            );
            return;
          }
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
        <div
          className="bg-gray-300  justify-center cursor-pointer items-center relative rounded-full p-5"
          onClick={() => widgetRef.current.open()}
        >
          <ImageIcon style={{ fontSize: "2em" }} className="" />
          <PlusRoundIcon className="absolute top-[13px] left-[11px] " />
        </div>
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
