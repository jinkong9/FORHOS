import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import type { ControllerRenderProps } from "react-hook-form";
import type { IFormInput } from "./form";

const Location = [
  {
    value: "서울",
    label: "서울",
  },
  {
    value: "대전",
    label: "대전",
  },
  {
    value: "광주",
    label: "광주",
  },
  {
    value: "부산",
    label: "부산",
  },
  {
    value: "대구",
    label: "대구",
  },
];

type Props = {
  field: ControllerRenderProps<IFormInput, "location">;
};

export function LocationCombobox({ field }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-40 justify-between">
          {field.value ? Location.find((Location) => Location.value === field.value)?.label : "지역 선택"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput placeholder="지역 검색" className="h-9" />
          <CommandList>
            <CommandEmpty>해당 지역이 없습니다.</CommandEmpty>
            <CommandGroup>
              {Location.map((Location) => (
                <CommandItem
                  key={Location.value}
                  value={Location.value}
                  onSelect={() => {
                    field.onChange(Location.value);
                  }}
                >
                  {Location.label}
                  <Check className={cn("ml-auto", field.value === Location.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
