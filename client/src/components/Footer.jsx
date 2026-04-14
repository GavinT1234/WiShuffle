import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300 text-base-content py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-2">WiShuffle</h3>
            <p className="text-base-content/70">
              Connect with friends and discover music together.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="link link-hover text-base-content/70 hover:text-base-content"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="link link-hover text-base-content/70 hover:text-base-content"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <a
                  href="#features"
                  className="link link-hover text-base-content/70 hover:text-base-content"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/about")}
                  className="link link-hover text-base-content/70 hover:text-base-content"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/blog")}
                  className="link link-hover text-base-content/70 hover:text-base-content"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="link link-hover text-base-content/70 hover:text-base-content"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/privacy")}
                  className="link link-hover text-base-content/70 hover:text-base-content"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/terms")}
                  className="link link-hover text-base-content/70 hover:text-base-content"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/cookies")}
                  className="link link-hover text-base-content/70 hover:text-base-content"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-4"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-base-content/70 text-sm">
          <p>&copy; {currentYear} WiShuffle. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#twitter" className="link link-hover">
              Twitter
            </a>
            <a href="#instagram" className="link link-hover">
              Instagram
            </a>
            <a href="#discord" className="link link-hover">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
