import Image from "next/image";
import Link from "next/link";
import { listEntries } from "@/lib/data/admin";
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
import { EntryRowActions } from "./entry-row-actions";

export default async function DashboardPage() {
  const entries = await listEntries();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Catalogue entries</h1>
          <p className="text-sm text-muted-foreground">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <Button render={<Link href="/admin/catalogue/new" />}>Add entry</Button>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No entries yet.{" "}
          <Link href="/admin/catalogue/new" className="underline">
            Add your first catalogue entry
          </Link>
          .
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]">Thumb</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Design type</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Image
                      src={entry.thumbnail_url}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded object-cover"
                      unoptimized
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.collection_name}
                  </TableCell>
                  <TableCell>{entry.section?.name ?? "—"}</TableCell>
                  <TableCell>{entry.design_type?.name ?? "—"}</TableCell>
                  <TableCell>{entry.feature?.name ?? "—"}</TableCell>
                  <TableCell>
                    {entry.is_active ? (
                      <Badge>Published</Badge>
                    ) : (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <EntryRowActions
                      id={entry.id}
                      name={entry.collection_name}
                      isActive={entry.is_active}
                      pdfUrl={entry.pdf_url}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
