import { useState } from "react";
import { Drawer } from "rsuite";
import {
  WhatsappShareButton,
  TelegramShareButton,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";
import CopyIcon from "@rsuite/icons/Copy";
import QRCode from "react-qr-code"; // Import react-qr-code

const ShareModal = ({ open, onClose, shareUrl, title }: Props) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Copy link to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <Drawer placement="bottom" open={open} onClose={onClose} size="sm">
      <Drawer.Body className="p-4 flex flex-col items-center">
        <h4 className="mb-4 text-center">{title}</h4>

        {/* QR Code */}
        <div className="mb-4 bg-white p-2 border rounded-md">
          <QRCode value={shareUrl} size={150} />
        </div>

        {/* Social Share Buttons */}
        <div className="flex gap-4 items-center justify-center mb-4">
          {/* <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={40} round />
          </FacebookShareButton> */}
          {/* <TwitterShareButton url={shareUrl}>
            <TwitterIcon size={40} round />
          </TwitterShareButton> */}
          <WhatsappShareButton url={shareUrl}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <TelegramShareButton url={shareUrl}>
            <TelegramIcon size={40} round />
          </TelegramShareButton>
          <CopyIcon className="text-2xl cursor-pointer" onClick={handleCopy} />
        </div>

        {copySuccess && (
          <span className="bg-slate-200 rounded-3xl p-3">Copied!</span>
        )}
      </Drawer.Body>
    </Drawer>
  );
};

export default ShareModal;

interface Props {
  shareUrl: string;
  open: boolean;
  title: string;
  onClose: () => void;
}
