import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="page-foot">
      <div className="foot-inner">
        <div className="foot-left">
          <BrandMark />
          <span>Loopa</span>
          <span className="ver">v1.0 · 2026</span>
        </div>
        <div>
          <a href="#">GitHub</a> <a href="#">Twitter</a> <Link href="/about">About</Link> <a href="#">Privacy</a>{" "}
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
