export interface Artwork {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  description?: string;
  availability?: "available" | "sold" | "commissioned";
  img: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}
