import { useEffect, useState } from "react";
import { TableData } from "../types/table";
import { useParams } from "react-router-dom";
import { Input, Modal } from "rsuite";
import { getBoardByIdWithCallback } from "../service/board";

interface Props {
  onSelectImage: Function;
  onCloseModal: () => void;
  isOpen: boolean;
}
interface PickImage {
  name: string;
  img: string;
}
const ImagePicker = ({ isOpen, onSelectImage, onCloseModal }: Props) => {
  const [selectedImage, setSelectedImage] = useState<PickImage>();
  const [data, setData] = useState<TableData>();
  const { id } = useParams();
  const [filterInput, setFilterInput] = useState<string>("");
  let existImagesNamesGlobal: string[] = [];

  useEffect(() => {
    async function fetchData() {
      await getBoardByIdWithCallback("hapak162", ["items"], (a) => {
        console.log("a", a);
        setData((prev) => ({ ...prev, ...a } as TableData));
      });
    }

    fetchData();
  }, [id]);
  useEffect(() => {}, [isOpen]);
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        onCloseModal();
      }}
    >
      <Modal.Header>
        <Modal.Title>
          <h3>בחר תמונה מהמאגר</h3>
          <Input
            onChange={(e) => {
              setFilterInput(e);
            }}
            value={filterInput}
            placeholder={"שם פריט"}
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-1">
            {data &&
              data.items
                .map((item) => ({ name: item.name, img: item.profileImage }))
                .filter((item) => {
                  if (existImagesNamesGlobal.includes(item.name)) {
                    return false;
                  } else {
                    existImagesNamesGlobal.push(item.name);
                    return true;
                  }
                })
                .map((item, i) => (
                  <div
                    onClick={() => {
                      setSelectedImage(item);
                      console.log(selectedImage, item);
                      onSelectImage(item?.img);
                      onCloseModal();
                    }}
                    className={`relative flex flex-col 
                    ${
                      selectedImage?.img === item.img
                        ? " border-blue-300 border-4"
                        : "border-transparent"
                    }
                  justify-center items-center`}
                  >
                    <span className="absolute text-sm top-0 text-center bg-blue-100 w-full justify-center flex items-center">
                      {item.name}
                    </span>
                    <img
                      key={i}
                      src={item.img}
                      alt={item.name}
                      className={`cursor-pointer p-4 `}
                    />
                  </div>
                ))}
          </div>
          {selectedImage && (
            <div className="mt-4">
              <strong>נבחר:</strong> {selectedImage.name}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImagePicker;
