import ProductDetailPage from '@/stories/page/ProductDetailPage';
import { products } from '@/data/products';

export function generateStaticParams() {
  return products.map((p) => ({ productId: String(p.id) }));
}

export async function generateMetadata({ params }) {
  const { productId } = await params;
  const product = products.find((p) => p.id === Number(productId));

  if (!product) {
    return {
      title: 'Product',
      description: 'Light defines the space.',
    };
  }

  const title = product.title;
  const description = product.description ?? product.tagline ?? 'Light defines the space.';
  const url = `/product/${product.id}`;
  const ogImage = `/og/product/${product.id}.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      siteName: 'Lumenstate',
      title: `${title} — Lumenstate`,
      description,
      url,
      locale: 'ko_KR',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} — Lumenstate`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Lumenstate`,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductDetailRoute({ params }) {
  const { productId } = await params;
  const product = products.find((p) => p.id === Number(productId)) || products[0];

  const meta = {
    itemNumber: `LM-${String(product.id).padStart(3, '0')}`,
    leadTime: '4 Weeks',
    shipDate: 'Jan 15, 2025',
  };

  return (
    <ProductDetailPage
      product={ { ...product, price: 1290 } }
      meta={ meta }
    />
  );
}
