import Image from "next/image";
import Link from "next/link";
import { listNewArrivals } from "@/lib/data/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrivalRowActions } from "./arrival-row-actions";

function resolve(a: Awaited<ReturnType<typeof listNewArrivals>>[number]) {
  if (a.kind === "catalogue" && a.entry) {
    return {
      title: a.entry.collection_name,
      subtitle: a.entry.section?.name ?? "—",
      image: a.entry.thumbnail_url,
    };
  }
  return { title: a.title ?? "—", subtitle: a.subtitle ?? "—", image: a.image_url };
}

export default async function ArrivalsAdminPage() {
  const arrivals = await listNewArrivals();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">New Arrivals</h1>
          <p className="text-sm text-muted-foreground">
            {arrivals.length} {arrivals.length === 1 ? "card" : "cards"} on the
            homepage
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/arrivals/new" />}>
          Add arrival
        </Button>
      </div>

      {arrivals.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No arrivals yet.{" "}
          <Link href="/admin/arrivals/new" className="underline">
            Add your first card
          </Link>
          .
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {arrivals.map((a) => {
                const r = resolve(a);
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      {r.image ? (
                        <Image
                          src={r.image}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell>{r.subtitle}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {a.kind === "catalogue" ? "Catalogue" : "Manual"}
                      </Badge>
                    </TableCell>
                    <TableCell>{a.sort_order}</TableCell>
                    <TableCell>
                      {a.is_active ? (
                        <Badge>Shown</Badge>
                      ) : (
                        <Badge variant="secondary">Hidden</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <ArrivalRowActions
                        id={a.id}
                        title={r.title}
                        isActive={a.is_active}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
