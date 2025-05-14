import { useEffect, useRef, useState } from "react";
import { CloudinaryUploadEvent } from "../types/clodinary";
import { Button, Message, Modal, useToaster } from "rsuite";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import ImageIcon from "@rsuite/icons/Image";
export function UploadWidget(props: Props) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [imageUrl, setImageUrl] = useState("");
  const allowedFormats = ["jpg", "png", "jpeg", "jfif"];
  imageUrl;
  const toaster = useToaster();
  const maxFileSize = 3 * 1024 * 1024; // 3 MB
  const [isImagesPickerOpen, setIsImagesPickerOpen] = useState<boolean>(false);

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
            if (result.info.bytes > maxFileSize) {
              toaster.push(
                <Message type="error" showIcon>
                  הקובץ גדול מדי. הגודל המקסימלי הוא 5 MB
                </Message>,
                { placement: "topCenter" }
              );
              return;
            }
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
        <Button
          className="w-full"
          onClick={() => {
            if (props?.isImagePickerPopup) {
              setIsImagesPickerOpen(true);
            } else {
              widgetRef.current.open();
            }
          }}
        >
          {props.text}
        </Button>
      )}
      {props.previewType === "addPhoto" && (
        <div
          className="bg-gray-300  justify-center cursor-pointer items-center relative rounded-full p-5"
          onClick={() => {
            if (props?.isImagePickerPopup) {
              setIsImagesPickerOpen(true);
            } else {
              widgetRef.current.open();
            }
          }}
        >
          <ImageIcon style={{ fontSize: "2em" }} className="" />
          <PlusRoundIcon className="absolute top-[13px] left-[11px] " />
        </div>
      )}

      <Modal
        open={isImagesPickerOpen}
        onClose={() => {
          setIsImagesPickerOpen(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>תמונת פרופיל</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <Button
              color="yellow"
              appearance="primary"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (props.openImagesPicker) {
                  props.openImagesPicker(true);
                  setIsImagesPickerOpen(false);
                }
              }}
            >
              בחר מבנק תמונות
            </Button>
            <Button
              color="blue"
              appearance="primary"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                widgetRef.current.open();
                setIsImagesPickerOpen(false);
              }}
            >
              העלאה מהמכשיר
            </Button>
          </div>
        </Modal.Body>
      </Modal>
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
  openImagesPicker?: Function;
  isImagePickerPopup?: boolean;
}
