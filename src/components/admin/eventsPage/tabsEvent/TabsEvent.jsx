import { useState } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import TabAnalysis from "./TabAnalysis";
import TabUpdate from "./TabUpdate";

const TabsEvent = ({ event, museum, getMuseumAndEvent }) => {
  const [selected, setSelected] = useState("");

  return (
    <Tabs
      selectedKey={selected}
      onSelectionChange={setSelected}
      size="lg"
      radius="none"
      aria-label="Options"
    >
      <Tab key="analysis" title="Análisis" className="w-full">
        <TabAnalysis event={event} />
      </Tab>

      <Tab key="update" title="Actualizar">
        <TabUpdate
          event={event}
          museum={museum}
          getMuseumAndEvent={getMuseumAndEvent}
        />
      </Tab>
    </Tabs>
  );
};

export default TabsEvent;
