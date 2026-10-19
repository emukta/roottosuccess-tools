import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[70vh] place-items-center overflow-hidden py-20 text-center">
      <div className="grid-lines-dark pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />
      <div className="container-x">
        <p className="display text-[120px] font-bold leading-none text-ink sm:text-[180px]">
          ৪<span className="text-forest-600">০</span>৪
        </p>
        <h1 className="display mt-4 text-3xl font-bold text-ink sm:text-4xl">পেজটি খুঁজে পাওয়া যায়নি</h1>
        <p className="mt-2 text-muted">লিংকটি ভুল হতে পারে, অথবা পেজটি সরানো হয়েছে।</p>
        <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-forest-900 px-7 font-semibold text-white hover:bg-forest-800">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}
