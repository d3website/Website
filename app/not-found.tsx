import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="site-editorial flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center">
      <Image
        src="/images/d3-lockup.png"
        alt="Dynamic Designs Decor"
        width={220}
        height={108}
        className="mb-10 h-auto w-44"
        priority
      />
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-4xl font-medium sm:text-5xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved. Explore our
        fabric collections or head back home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/catalogue" />}
        >
          Browse collections
        </Button>
      </div>
    </main>
  );
}
