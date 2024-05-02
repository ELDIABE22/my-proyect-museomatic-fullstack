import Navbar from "@/components/Navbar";

export default function MuseumsLayout({ children }) {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}
