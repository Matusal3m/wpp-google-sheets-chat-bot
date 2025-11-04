export function Footer() {
  return (
    <footer className="text-center py-4 border-t border-gray-700 bg-gray-900 text-gray-400 text-sm">
      <p>
        Developed by{" "}
        <span className="font-semibold text-gray-200">Matusalém Sousa</span> —{" "}
        <a href="mailto:matusalem@example.com" className="hover:underline">
          matusalem@example.com
        </a>{" "}
        —{" "}
        <a
          href="https://github.com/matusalem2"
          target="_blank"
          className="hover:underline">
          GitHub
        </a>
      </p>
    </footer>
  );
}
