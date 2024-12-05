import { Dropdown } from "rsuite";
import { DetailsItem } from "../types/soldier";

export default function CustomDropdown(props: Props) {
  return (
    <Dropdown title={props.placeholder}>
      {props.options.map((option) => {
        return <Dropdown.Item key={option.id}>{option.name}</Dropdown.Item>;
      })}
    </Dropdown>
  );
}
interface Props {
  options: DetailsItem[];
  placeholder: string;
}
