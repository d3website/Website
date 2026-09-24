/**
 * Site-wide content and company facts, carried over from the live d3dynamic.com
 * pages. Centralised so copy lives in one place until the Phase 3 design pass.
 * Verbatim marketing copy is kept close to the original where practical.
 */

export const company = {
  brand: "D3 Dynamic",
  legalName: "Dynamic Designs Decor",
  tagline: "New Level of Interior",
  email: "info@d3dynamic.com",
  phone: "+91 86691 02827",
  phoneHref: "tel:+918669102827",
  // Social links. Facebook + Pinterest are placeholders until Shevam
  // provides the page URLs; swap the "#" values then.
  instagram: "https://www.instagram.com/d3_dynamicdesignsdecor",
  facebook: "#",
  pinterest: "#",
} as const;

export type Office = {
  city: string;
  entity?: string;
  lines: string[];
};

export const offices: Office[] = [
  {
    city: "Dubai",
    entity: "Dynamic Fabrics FZCO",
    lines: [
      "#178, Dubai Textile City, PO Box 4496",
      "Dubai, United Arab Emirates",
    ],
  },
  {
    city: "Bahrain",
    entity: "Dynamic Fabrics W.L.L",
    lines: [
      "Shop No. 72, Building 1981, Road 1527",
      "Block 115, Hidd, Bahrain",
    ],
  },
  {
    city: "Saudi Arabia",
    entity: "Almotharek Arabia Trading Company",
    lines: [
      "B-10/25, Building No. 3778, Al Sabr Street",
      "Ash Shulah, Postal Code 34264",
      "Dammam, Kingdom of Saudi Arabia",
    ],
  },
  {
    city: "Mumbai",
    entity: "Dynamic Designs Decor LLP",
    lines: [
      "2nd Floor, Building Arihant Annex, House No. 888",
      "Shree Arihant Complex, Kalher",
      "Bhiwandi (421302), Maharashtra",
    ],
  },
  {
    city: "Panipat",
    entity: "Dynamic Designs Decor LLP",
    lines: ["Plot No. 1590 P, Sector-25, Part 2", "Panipat – 132103"],
  },
];

export const stats = [
  { value: "1800+", label: "Satisfied Customers" },
  { value: "4+", label: "Years of Experience" },
  { value: "3500+", label: "Fabric Collections" },
  { value: "3+", label: "Offices Worldwide" },
] as const;

export const catalogueSections = [
  { label: "Curtains", href: "/curtains" },
  { label: "Upholstery", href: "/upholstery" },
  { label: "Outdoor Fabric", href: "/outdoor-fabric" },
  { label: "All Collections", href: "/catalogue" },
] as const;

export type ServiceContent = {
  slug: string;
  navLabel: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  featuresHeading: string;
  features: { title: string; body: string }[];
};

export const services: ServiceContent[] = [
  {
    slug: "pet-friendly-fabric-for-sofa",
    navLabel: "Pet Friendly Fabric",
    title: "Pet Friendly Fabric for Sofa",
    subtitle: "Elevate your space with comfort and style",
    metaTitle: "Pet Friendly Fabric for Sofa in India | D3",
    metaDescription:
      "Durable, easy-to-clean pet-friendly sofa fabrics from Dynamic Designs Decor — comfort and style that stand up to your furry friends.",
    intro:
      "Welcome to Dynamic Designs Decor, where we understand the importance of creating a home that embraces every member of your family, including your beloved pets. As the leading stockist of premium pet-friendly fabrics in the MENA region, we take immense pride in offering fabrics that seamlessly blend comfort, durability, and style. Our mission is not just to meet your expectations but to exceed them, ensuring your home is adorned with the finest pet-friendly fabrics that cater to both your needs and those of your furry friends.",
    featuresHeading: "Why choose our pet-friendly fabrics?",
    features: [
      {
        title: "Durability and Resilience",
        body: "Engineered to withstand pet-related wear, stains, and scratches while keeping their looks.",
      },
      {
        title: "Easy Maintenance",
        body: "High-quality, easy-to-clean fabrics that shrug off spills and accidents.",
      },
      {
        title: "Stylish Designs",
        body: "A wide array of patterns and colours to suit any decor preference.",
      },
      {
        title: "Comfort for Your Pets",
        body: "Soft, cozy materials your pets will love to relax on.",
      },
      {
        title: "Commitment to Quality",
        body: "Rigorous testing standards behind every fabric we stock.",
      },
    ],
  },
  {
    slug: "fire-retardant-fabric-suppliers",
    navLabel: "Fire Retardant Fabric",
    title: "Fire Retardant Fabric Suppliers",
    subtitle: "Combining safety and style for your spaces",
    metaTitle: "Fire Retardant Fabric Suppliers in India | D3",
    metaDescription:
      "Certified fire retardant furnishing fabrics from Dynamic Designs Decor — safety and style for homes, hospitality and commercial spaces.",
    intro:
      "Welcome to Dynamic Designs Decor, your trusted partner for high-quality fire retardant fabrics that combine certified safety with considered design. Our fire retardant range is made to protect your spaces without compromising on the look and feel you want.",
    featuresHeading: "Why choose our fire retardant fabric?",
    features: [
      {
        title: "Certified Safety",
        body: "Fabrics that meet recognised fire-retardancy standards.",
      },
      {
        title: "Variety of Designs",
        body: "A broad selection of designs, so safety never limits your style.",
      },
      {
        title: "Durability and Longevity",
        body: "Built to perform and keep their appearance over years of use.",
      },
      {
        title: "Expert Guidance",
        body: "Support in choosing the right fabric for your requirements.",
      },
    ],
  },
  {
    slug: "leather-finish-sofa-cloth",
    navLabel: "Leather Finish Sofa Cloth",
    title: "Leather Finish Sofa Cloth",
    subtitle: "Where sophistication meets durability",
    metaTitle: "Leather Finish Sofa Cloth | D3",
    metaDescription:
      "Luxurious, durable leather finish sofa cloth from Dynamic Designs Decor — the look of leather with easy maintenance and lasting comfort.",
    intro:
      "Welcome to Dynamic Designs Decor, where sophistication meets durability in our carefully curated leather finish sofa cloth collection. Each piece is a testament to craftsmanship, offering an exquisite blend of luxury and longevity for any room.",
    featuresHeading: "Your journey into luxury",
    features: [
      {
        title: "Luxurious Appeal",
        body: "A touch of grandeur that immerses your space in luxury.",
      },
      {
        title: "Unmatched Durability",
        body: "Built to last, resistant to wear and tear, ageing gracefully.",
      },
      {
        title: "Effortless Maintenance",
        body: "Spills and stains vanish with a simple wipe.",
      },
      {
        title: "Versatile Designs",
        body: "A diverse range of designs to cater to every taste.",
      },
      {
        title: "Comfort Beyond Compare",
        body: "Unparalleled comfort as you sink into the softness.",
      },
    ],
  },
  {
    slug: "easy-to-clean-furniture-fabric",
    navLabel: "Easy to Clean Fabric",
    title: "Easy Clean Fabrics for Furniture and Couches",
    subtitle: "Elevate your home with effortless elegance",
    metaTitle: "Stylish Easy to Clean Furniture Fabrics | D3",
    metaDescription:
      "Stain-resistant, water-repellent, low-maintenance easy-clean furniture fabrics from Dynamic Designs Decor — style that keeps up with real life.",
    intro:
      "Welcome to Dynamic Designs Decor, your premier destination for exquisite and easy-clean fabrics for furniture and couches in the MENA region. We take great pride in being a leading stockist of top-quality furnishing fabrics, where unparalleled customer service and impeccable quality meet to redefine your living spaces. Our mission extends beyond mere satisfaction; we are dedicated to enhancing your homes with fabrics that seamlessly blend style, functionality, and convenience.",
    featuresHeading: "Why choose our easy clean fabrics?",
    features: [
      {
        title: "Effortless Maintenance",
        body: "Designed to repel stains and spills, so cleanup is a breeze.",
      },
      {
        title: "Durability Redefined",
        body: "Exceptionally durable, retaining beauty even after years of use.",
      },
      {
        title: "Variety of Styles",
        body: "A diverse range of styles, patterns and colours to match your decor.",
      },
      {
        title: "Comfort and Luxury",
        body: "Practical fabrics with superior comfort and a luxurious feel.",
      },
    ],
  },
];

export function getService(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}
