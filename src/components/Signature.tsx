import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Item } from "../types/table";
import {
  PDFDownloadLink,
  Document,
  Page,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import ImproveSignature from "./ImproveSignature";
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
        {signatureDataURL && (
          <PDFDownloadLink
            document={
              <SignaturePDF item={props.item} signature={signatureDataURL} />
            }
            fileName="signature.pdf"
            className="cursor-pointer"
          >
            {/* {({ loading }) => {
              return <button className="mr-2">
                {loading ? "יוצר PDF..." : "הורד PDF"}
              </button>
            }} */}
            <Button>הורד</Button>
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
}

interface Props {
  item: Item;
  onEnd: Function;
}

interface PDFProps {
  item: Item;
  signature: string;
}

// Generate PDF Document
const SignaturePDF: React.FC<PDFProps> = ({ item, signature }) => {
  Font.register({
    family: "Alef",
    src: "http://fonts.gstatic.com/s/alef/v6/gzq6OSepdeZ1VdycsVw6Vg.ttf",
  });

  return (
    <Document>
      <Page style={styles.body} size="A4">
        <ImproveSignature item={item as Item} signature={signature} />
      </Page>
    </Document>
  );
};
const styles = StyleSheet.create({
  body: {
    fontSize: 12,
    fontFamily: "Alef", // Apply the registered font here
    padding: 20,
  },
});
