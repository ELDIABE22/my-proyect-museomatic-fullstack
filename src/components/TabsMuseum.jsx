import { GalleryIcon } from "@/components/icons/GalleryIcon ";
import { MusicIcon } from "@/components/icons/MusicIcon ";
import { Tabs, Tab } from "@nextui-org/react";
import CardCollection from "./CardCollection";
import CardEvent from "./CardEvent";

const TabsMuseum = ({ events, collections }) => {
  console.log(events);

  return (
    <Tabs
      aria-label="Options"
      variant="underlined"
      className="flex justify-center"
    >
      <Tab
        key="collections"
        title={
          <div className="flex items-center space-x-2">
            <GalleryIcon />
            <span>Colecciones</span>
          </div>
        }
      >
        <div>
          <p className="text-lg font-bold text-center mb-5">Colecciones</p>
          {collections.length > 0 ? (
            <div className="flex gap-5 justify-center flex-wrap">
              {collections.map((coll) => (
                <CardCollection key={coll.id} collections={coll} />
              ))}
            </div>
          ) : (
            <p className="text-center text-3xl font-bold">
              El museo no tiene colecciones.
            </p>
          )}
        </div>
      </Tab>
      <Tab
        key="events"
        title={
          <div className="flex items-center space-x-2">
            <MusicIcon />
            <span>Eventos</span>
          </div>
        }
      >
        <div>
          <p className="text-lg font-bold text-center mb-5">Eventos</p>
          <div className="flex gap-5 justify-center">
            {events.length > 0 ? (
              <div className="flex gap-5 justify-center flex-wrap">
                {events.map((ev) => (
                  <CardEvent key={ev.id} events={ev} />
                ))}
              </div>
            ) : (
              <p className="text-center text-3xl font-bold">
                El museo no tiene eventos.
              </p>
            )}
          </div>
        </div>
      </Tab>
    </Tabs>
  );
};

export default TabsMuseum;
