import CardTicketVip from "./CardTicketVip";
import CardTicketNormal from "./CardTicketNormal";

const TabTicketType = ({ ticketTotal, confirmType }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 justify-center gap-5">
      <CardTicketNormal ticketTotal={ticketTotal} confirmType={confirmType} />
      <CardTicketVip ticketTotal={ticketTotal} confirmType={confirmType} />
    </section>
  );
};

export default TabTicketType;
