import { Link } from "@tanstack/react-router";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg gradient-accent" />
          <span className="font-semibold text-lg">Ventixo</span>
        </div>
        <ul className="flex gap-6 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/workflow" className="hover:text-foreground transition">
              Workflow
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-foreground transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-foreground transition">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-foreground transition">
              Terms
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="hover:text-foreground transition">
              Privacy
            </Link>
          </li>
        </ul>
        <div className="flex gap-3 text-muted-foreground">
          {[FaTwitter, FaGithub, FaLinkedin, FaInstagram].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="h-9 w-9 rounded-full glass flex items-center justify-center hover:text-foreground hover:scale-110 transition"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-8">
        © {new Date().getFullYear()} Ventixo. All rights reserved.
      </div>
    </footer>
  );
}
