const Contact = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Contact Us</h1>

      <div className="text-gray-700">
        <p className="mb-4">
          Have questions or need assistance? Feel free to reach out to us.
        </p>

        <p className="mb-4">
          {"You can contact us via email at "}
          <a
            href="mailto:info@shopahora.com"
            className="text-blue-600 hover:underline"
          >
            info@shopahora.com
          </a>
          {"."}
        </p>

        <p>We aim to respond to all inquiries within 24-48 hours.</p>
      </div>
    </>
  );
};

export default Contact;
