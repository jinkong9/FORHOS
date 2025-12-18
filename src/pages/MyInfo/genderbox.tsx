import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/Components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import type { ControllerRenderProps } from "react-hook-form";
import type { IFormInput } from "./form";

type Props = {
  field: ControllerRenderProps<IFormInput, "gender">;
};

const Gender = [
  {
    value: "man",
    label: "남성",
  },
  {
    value: "woman",
    label: "여성",
  },
];

export function GenderComboBOx({ field }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-40 justify-between">
          {field.value ? Gender.find((Gender) => Gender.value === field.value)?.label : "성별 선택"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {Gender.map((Gender) => (
                <CommandItem
                  key={Gender.value}
                  value={Gender.value}
                  onSelect={() => {
                    field.onChange(Gender.value);
                    setOpen(false);
                  }}
                >
                  {Gender.label}
                  <Check className={cn("ml-auto", field.value === Gender.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
