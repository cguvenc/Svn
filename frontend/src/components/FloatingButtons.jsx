import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { useContent } from "../context/ContentContext";

const FloatingButtons = () => {
  const { settings } = useContent();
  return (
    <>
      <a
        href={`tel:${settings.phone_raw}`}
        aria-label="Call us"
        className="fixed left-4 bottom-4 z-40 w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center shadow-lg pulse-ring hover:scale-105 transition-transform"
      >
        <Phone size={24} />
      </a>
      <a
        href={`https://wa.me/${settings.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed right-4 bottom-4 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg wa-pulse hover:scale-105 transition-transform"
      >
        <MessageCircle size={26} />
      </a>
    </>
  );
};

export default FloatingButtons;
