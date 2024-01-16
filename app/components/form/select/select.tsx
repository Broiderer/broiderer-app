import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '@radix-ui/react-select'

type SelectOptionsProps = {
  options: string[]
  value: string
  onValueChange: (value: string) => void
}

export default function SelectOptions({
  options,
  value,
  onValueChange,
}: SelectOptionsProps) {
  return (
    <Select value={value} onValueChange={(val) => onValueChange(val)}>
      <SelectTrigger className="bro-button">
        <SelectValue placeholder={value}></SelectValue>
        <SelectIcon className="SelectIcon">
          &nbsp;<i className="bro-icon bro-icon-chevron-down"></i>
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent className="bro-radix-select-content">
          <SelectViewport className="bro-radix-select-viewport">
            {options.map((opt) => (
              <SelectItem
                value={opt}
                key={opt}
                className="bro-radix-select-item"
              >
                <SelectItemText>{opt}</SelectItemText>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  )
}
