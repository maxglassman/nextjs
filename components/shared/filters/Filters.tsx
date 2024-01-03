import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filters = ({ filters, otherClasses, containerClasses }: Props) => {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
        <SelectTrigger
          className={`${otherClasses} body-regular rlight-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <SelectValue placeholder="Select a Filter" />
        </SelectTrigger>
        <SelectContent>
          {filters.map((filter) => {
            return (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
