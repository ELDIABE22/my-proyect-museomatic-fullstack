import { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { MusicIcon } from "@/components/icons/MusicIcon ";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { GalleryIcon } from "@/components/icons/GalleryIcon ";
import { commentSchema } from "@/utils/zod";
import axios from "axios";
import toast from "react-hot-toast";
import TabEvent from "./tabEvent/TabEvent";
import TabCollection from "./tabCollection/TabCollection";
import TabForo from "./TabForo";

const TabsMuseum = ({ events, collections, foro, getMuseumDetails }) => {
  const [comment, setComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [error, setError] = useState(null);

  const { data: session } = useSession();

  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendingComment(true);

    try {
      commentSchema.parse({
        comment,
      });

      setError(null);

      const data = {
        user_id: session?.user.id,
        museo_id: params.id,
        comentario: comment,
      };

      const res = await axios.post("/api/museum/comment", data);
      const { message } = res.data;

      if (message === "Comentario enviado") {
        toast.success(message, {
          style: {
            backgroundColor: "#DCDCDC",
            color: "#000000",
            border: "1px solid #000000",
            padding: "16px",
          },
          iconTheme: {
            primary: "#000000",
            secondary: "#FFFFFF",
          },
        });

        getMuseumDetails();
        setComment("");
      } else {
        toast.error(message, {
          style: {
            backgroundColor: "#FF0000",
            color: "#FFFFFF",
            border: "1px solid #FF0000",
            padding: "16px",
          },
          iconTheme: {
            primary: "#FF0000",
            secondary: "#FFFFFF",
          },
        });
      }

      setSendingComment(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setSendingComment(false);
    }
  };

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
        <TabCollection collections={collections} />
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
        <TabEvent events={events} />
      </Tab>

      <Tab
        key="foro"
        className="px-2 md:px-5"
        title={
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span>Comentarios</span>
          </div>
        }
      >
        <TabForo
          handleSubmit={handleSubmit}
          sendingComment={sendingComment}
          error={error}
          comment={comment}
          setComment={setComment}
          foro={foro}
        />
      </Tab>
    </Tabs>
  );
};

export default TabsMuseum;
