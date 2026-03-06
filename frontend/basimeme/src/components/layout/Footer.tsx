import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-amber-400 text-black font-black text-sm flex items-center justify-center">BM</div>
              <span className="font-black text-white text-lg">BasiMeme.it</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              La libreria italiana di template meme. Trova, condividi e usa le migliori basi per i tuoi meme.
            </p>
            <p className="text-zinc-600 text-xs mt-3">
              Powered by{" "}
              <a href="https://memefattori.it" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-semibold">
                Memefattori
              </a>
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Esplora</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/cerca" className="hover:text-white transition-colors">Cerca</Link></li>
              <li><Link href="/upload" className="hover:text-white transition-colors">Carica una base</Link></li>
              <li><Link href="/?sort=trending" className="hover:text-white transition-colors">Trending</Link></li>
              <li><Link href="/?sort=newest" className="hover:text-white transition-colors">Nuove</Link></li>
            </ul>
          </div>

          {/* Legale */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Info</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/termini" className="hover:text-white transition-colors">Termini di servizio</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy policy</Link></li>
              <li><a href="mailto:ciao@basimeme.it" className="hover:text-white transition-colors">Contattaci</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} BasiMeme.it — Tutti i diritti riservati</p>
          <p>Made with 🧃 in Italia</p>
        </div>
      </div>
    </footer>
  );
}
