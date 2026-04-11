import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  /**
   * ODLUKA (odstupanje od Vite "zlatnog standarda"):
   * Vite podrazumevano otkriva samo varijable sa prefiksom "VITE_".
   * Korisnik je na Vercelu postavio GA ključ pod imenom NEXT_PUBLIC_GA_ID
   * (Next.js konvencija, uobičajena greška pri prvom podešavanju).
   * Umesto da menjamo Vercel, proširujemo envPrefix da Vite prihvati i
   * "NEXT_PUBLIC_" varijable — i zamenjuje ih u index.html (%NEXT_PUBLIC_GA_ID%)
   * i čini ih dostupnim u JS kodu (import.meta.env.NEXT_PUBLIC_GA_ID).
   */
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
});
