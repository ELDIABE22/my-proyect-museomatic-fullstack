import CardTicketsSold from "./CardTicketsSold";
import CardTotalTicketsSold from "./CardTotalTicketsSold";

const SectionMuseumSales = ({ searchTicketSale }) => {
  return (
    <section>
      <h2 className="font-bold text-2xl text-center mb-3">
        {searchTicketSale.Museo || "No tiene tickets vendidos!"}
      </h2>
      <div className="flex flex-wrap justify-center gap-5 mb-5">
        <CardTicketsSold searchTicketSale={searchTicketSale} />
        <CardTotalTicketsSold searchTicketSale={searchTicketSale} />
      </div>
    </section>
  );
};

export default SectionMuseumSales;
