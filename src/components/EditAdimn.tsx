import { Input } from "rsuite";
import { Admin } from "../types/table";
import { adminTranslate } from "../const";

export default function EditAdmin({
  onChangeInput,
  userKeyToPreview,
  admin,
  isEditMode,
}: Props) {
  return (
    <div className="flex flex-col justify-center items-center gap-4 ">
      {admin &&
        userKeyToPreview.map((key) => {
          return (
            <div className="flex flex-col gap-1">
              <span className="">{adminTranslate[key]}:</span>
              {key !== "signature" && (
                <Input
                  disabled={!isEditMode}
                  onChange={(e) => {
                    onChangeInput({
                      ...admin,
                      [key]: e,
                    });
                  }}
                  value={admin[key] as string}
                  placeholder={adminTranslate[key]}
                  key={key}
                />
              )}
              {key === "signature" &&
                (admin.signature ? (
                  <img className="w-full h-16" src={admin?.signature} alt="" />
                ) : (
                  <span className="font-bold text-red-500">אין חתימה</span>
                ))}
            </div>
          );
        })}
    </div>
  );
}
interface Props {
  admin: Admin;
  onChangeInput: (admin: Admin) => void;
  userKeyToPreview: Array<keyof Admin>;
  isEditMode: boolean;
}
