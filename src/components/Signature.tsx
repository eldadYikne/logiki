import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Item } from "../types/table";

import { Button } from "rsuite";
export default function Signature(props: Props) {
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);

  const handleGenerateSignature = () => {
    if (sigCanvasRef.current) {
      const dataURL = sigCanvasRef.current.toDataURL("image/png");
      setSignatureDataURL(dataURL);
      console.log("signatureDataURL", signatureDataURL);
      props.onEnd(dataURL);
    }
  };

  const handleClear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
    setSignatureDataURL(null);
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigCanvasRef}
        penColor="black"
        canvasProps={{
          width: 250,
          height: 200,
          className: "sigCanvas border border-black",
        }}
        onEnd={handleGenerateSignature}
      />
      <div className="mt-4">
        <Button onClick={handleClear} className="mr-2">
          נקה חתימה
        </Button>
      </div>
    </div>
  );
}

interface Props {
  item: Item;
  onEnd: Function;
}
