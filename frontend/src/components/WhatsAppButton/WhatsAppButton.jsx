import "./WhatsAppButton.css";

const WhatsAppButton = () => {
  const phoneNumber = "923431516875";

  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-floating-button"
      aria-label="Chat with us on WhatsApp"
    >
      <svg
        className="whatsapp-icon"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M16 2.4C8.49 2.4 2.4 8.49 2.4 16c0 2.4.63 4.65 1.73 6.61L2.3 29.7l7.25-1.8A13.53 13.53 0 0 0 16 29.6c7.51 0 13.6-6.09 13.6-13.6S23.51 2.4 16 2.4Zm0 24.73c-2.11 0-4.18-.57-5.98-1.66l-.43-.26-4.3 1.07 1.1-4.19-.28-.44A11.23 11.23 0 1 1 16 27.13Zm6.16-8.41c-.34-.17-2.02-1-2.33-1.11-.31-.11-.54-.17-.77.17-.23.34-.88 1.11-1.08 1.34-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.69-2.01-1.89-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.05-2.55-.28-.67-.56-.58-.77-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.69 5.86 5.18.82.35 1.46.56 1.96.72.82.26 1.56.22 2.15.13.66-.1 2.02-.83 2.3-1.63.28-.8.28-1.49.2-1.63-.08-.14-.31-.23-.65-.4Z"
        />
      </svg>

      <span className="whatsapp-tooltip">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;