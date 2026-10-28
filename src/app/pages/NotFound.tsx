import { Btn, Container } from "../components/kit";

export function NotFound() {
  return (
    <header className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2 bg-hivis" />
      <Container className="flex min-h-[70vh] flex-col items-start justify-center gap-8 py-20">
        <div aria-hidden="true" className="display rounded-[4px] bg-hivis px-6 py-2 text-[clamp(6rem,28vw,16rem)] leading-none text-ink">404</div>
        <h1 className="display text-[clamp(2rem,4.8vw,3.6rem)]">Page not found</h1>
        <p className="max-w-[58ch] text-[17px] leading-relaxed text-white/80">
          The page you're looking for doesn't exist. You might have followed an old link or typed the URL incorrectly.
        </p>
        <div className="flex flex-wrap gap-3">
          <Btn to="/">Back to Home</Btn>
          <Btn to="/services" variant="ghost-light">Our services</Btn>
        </div>
      </Container>
    </header>
  );
}
