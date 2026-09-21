/**
 * Database types for the D3 Dynamic catalogue schema (see supabase/schema.sql,
 * Project Plan §4.3).
 *
 * Hand-authored for now to keep the data layer typed before a Supabase project
 * exists. Once the project is provisioned, regenerate with:
 *   npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      sections: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      features: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      design_types: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      catalogue_entries: {
        Row: {
          id: string;
          collection_name: string;
          section_id: string;
          feature_id: string | null;
          design_type_id: string;
          thumbnail_url: string;
          pdf_url: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          collection_name: string;
          section_id: string;
          feature_id?: string | null;
          design_type_id: string;
          thumbnail_url: string;
          pdf_url: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          collection_name?: string;
          section_id?: string;
          feature_id?: string | null;
          design_type_id?: string;
          thumbnail_url?: string;
          pdf_url?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "catalogue_entries_section_id_fkey";
            columns: ["section_id"];
            referencedRelation: "sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "catalogue_entries_feature_id_fkey";
            columns: ["feature_id"];
            referencedRelation: "features";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "catalogue_entries_design_type_id_fkey";
            columns: ["design_type_id"];
            referencedRelation: "design_types";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience row aliases
export type Section = Database["public"]["Tables"]["sections"]["Row"];
export type Feature = Database["public"]["Tables"]["features"]["Row"];
export type DesignType = Database["public"]["Tables"]["design_types"]["Row"];
export type CatalogueEntry =
  Database["public"]["Tables"]["catalogue_entries"]["Row"];
