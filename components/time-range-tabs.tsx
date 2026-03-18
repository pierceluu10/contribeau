"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TimeRangeTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="lowercase">
        <TabsTrigger value="short_term">4 weeks</TabsTrigger>
        <TabsTrigger value="medium_term">6 months</TabsTrigger>
        <TabsTrigger value="long_term">all time</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
