import CardMuseums from "@/components/CardMuseums";

const MuseumsPage = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4 mx-3">
      <CardMuseums />
    </div>
  );
};

export default MuseumsPage;
