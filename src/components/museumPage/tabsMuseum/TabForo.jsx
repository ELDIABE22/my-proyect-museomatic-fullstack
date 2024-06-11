import { Avatar, Button, Divider, Textarea } from "@nextui-org/react";

const TabForo = ({
  handleSubmit,
  sendingComment,
  error,
  comment,
  setComment,
  foro,
}) => {
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <p className="text-lg font-bold">Agregar comentario</p>
        <form onSubmit={handleSubmit} className="w-full">
          <Textarea
            isDisabled={sendingComment}
            radius="none"
            placeholder="Escribe tu comentario!"
            className="mb-4"
            isRequired={error}
            value={comment}
            onValueChange={setComment}
          />
          <Button
            type="submit"
            isLoading={sendingComment}
            radius="none"
            variant="shadow"
            className="w-full bg-black text-white"
          >
            Enviar
          </Button>
        </form>
      </div>
      <Divider className="my-5" />
      <p className="text-lg font-bold text-center mb-3">Comentarios</p>
      <div className="flex flex-col gap-5">
        {foro.length > 0 ? (
          <>
            {foro.map((fo) => (
              <div key={fo.id} className="flex gap-4 sm:gap-2">
                <div className="w-[10%] md:w-auto">
                  <Avatar
                    showFallback
                    src="https://images.unsplash.com/broken"
                  />
                </div>
                <div>
                  <span className="text-gray">{fo.nombre}</span>
                  <p className="text-sm md:text-base">{fo.comentario}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center text-3xl font-bold">
            Se el primero en comentar!
          </p>
        )}
      </div>
    </>
  );
};

export default TabForo;
