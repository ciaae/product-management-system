'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

const placeholderImage =
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80';

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Product ID is required.');
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || 'Unable to load product');
        }

        setProduct(payload.data ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-sm">
          Loading product details...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="max-w-lg rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
          <p className="text-lg font-bold">Unable to load product</p>
          <p className="mt-2 text-sm">{error}</p>
          <a href="/" className="mt-5 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md">
            Back to products
          </a>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800">Product not found</p>
          <a href="/" className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Back to products
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef6ff,_#f8fafc_40%,_#f1f5f9_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl rounded-[30px] border border-slate-200 bg-white/90 p-4 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.25)] sm:p-6 lg:p-8">
        <a href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
          ← Back to products
        </a>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
            <img
              src={product.imageUrl || placeholderImage}
              alt={product.name}
              className="h-full min-h-[280px] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Product</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">{product.description}</p>
            </div>

            <div className="mt-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tags</h2>
              {product.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <span key={`${product.id}-${tag}`} className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No tags generated yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
