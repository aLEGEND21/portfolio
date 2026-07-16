export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-12">
        <p className="text-sm text-faint">
          © {new Date().getFullYear()} Arnav Murthi
        </p>
      </div>
    </footer>
  );
}
