import { Link } from "wouter";
import { Ghost } from "lucide-react";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-accent-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Ghost className="h-6 w-6 text-white" />
              <span className="font-serif text-xl font-bold">Ghost in the Archive</span>
            </div>
            <p className="text-primary-100 mb-4">
              A scholarly repository of transcribed historical documents, providing researchers and history enthusiasts with accessible primary sources
            </p>
            <div className="flex space-x-4">
            <a
                href="https://gogp.substack.com/"
                aria-label="Substack"
                className="text-primary-200 hover:text-white transition-colors"
              >
                {/* Substack Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-substack" viewBox="0 0 16 16">
                  <path d="M15 3.604H1v1.891h14v-1.89ZM1 7.208V16l7-3.926L15 16V7.208zM15 0H1v1.89h14z"/>
                </svg>
              </a>
              <a
                href="https://x.com/Mal_Hibou"
                aria-label="Twitter"
                className="text-primary-200 hover:text-white transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://github.com/SamuelPerrin/hieronymus"
                aria-label="GitHub"
                className="text-primary-200 hover:text-white transition-colors"
              >
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-sans font-semibold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/collections/letters" className="text-primary-200 hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/people/alexander-hamilton" className="text-primary-200 hover:text-white transition-colors">
                  People
                </Link>
              </li>
              <li>
                <Link href="/places/new-windsor" className="text-primary-200 hover:text-white transition-colors">
                  Places
                </Link>
              </li>
              <li>
                <Link href="/events/american-revolution" className="text-primary-200 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-primary-200 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-primary-200 hover:text-white transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-200 hover:text-white transition-colors">
                  Research Methodology
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-200 hover:text-white transition-colors">
                  How to Cite
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-200 hover:text-white transition-colors">
                  Contributors
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-200 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-accent-700 mt-8 pt-6 text-sm text-primary-200">
          <p>&copy; {new Date().getFullYear()} Ghost in the Archive. All rights reserved.</p>
          <p className="mt-2">
            This project is maintained by scholars committed to making historical primary sources accessible for research and education.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
