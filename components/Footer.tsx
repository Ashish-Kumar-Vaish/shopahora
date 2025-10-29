import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ShopAhora */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              ShopAhora
            </h3>

            <p className="mt-4 text-sm text-gray-500">
              Your minimalist e-commerce store.
            </p>
          </div>

          {/* Shop Related Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Shop
            </h3>

            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  href="/categories"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  href="/sale"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              About
            </h3>

            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Add social media links here */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Connect
            </h3>

            <div className="mt-4 flex space-x-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Facebook
              </a>

              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Twitter
              </a>

              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="border-t mt-8 pt-8">
          <p className="text-sm text-gray-400">
            &copy;{new Date().getFullYear()} ShopAhora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
