import { Mail, Coffee } from "lucide-react";
import { Separator } from "../components/ui/separator";

export function Footer() {
  const email = "matusalem.dev@gmail.com";

  return (
    <footer className="w-full border-t border-border bg-background text-muted-foreground text-sm py-6 mt-10">
      <div className="container mx-auto flex flex-col items-center gap-3 text-center">
        <p className="flex items-center gap-2">
          Desenvolvido com{" "}
          <Coffee className="w-4 h-4 text-[#6F4E37] dark:text-[#6F4E37]" /> por{" "}
          <span className="font-medium text-foreground">
            Matusalém de Sousa
          </span>
        </p>

        <div className="flex items-center gap-5">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Mail className="w-4 h-4" />
            {email}
          </a>

          <a
            href="https://github.com/matusal3m"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors">
            {/* SVG nativo do logo GitHub */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 
                3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
                0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61
                -.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729
                1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998
                .107-.776.418-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.933
                0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 
                1.005-.322 3.3 1.23a11.48 11.48 0 0 1 3-.404c1.02.005 
                2.045.137 3 .404 2.28-1.552 3.285-1.23 3.285-1.23.645 
                1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 
                0 4.61-2.805 5.63-5.475 5.92.435.372.81 1.102.81 
                2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.694.825.575C20.565 
                22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
