'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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

export default function HomePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/products`);
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to load products');
      }

      setProducts(payload.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageUrl('');
      setImageFileName('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });

    setImageUrl(dataUrl);
    setImageFileName(file.name);
    setError('');
  };

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, imageUrl })
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to create product');
      }

      setName('');
      setDescription('');
      setImageUrl('');
      setImageFileName('');
      setSuccess('Product created successfully.');
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) {
      return;
    }

    setIsDeletingId(productToDelete.id);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/products/${productToDelete.id}`, { method: 'DELETE' });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to delete product');
      }

      setSuccess('Product deleted successfully.');
      setProductToDelete(null);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleGenerateTags = async (id: string) => {
    setGeneratingId(id);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/products/${id}/generate-tags`, { method: 'POST' });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Tag generation failed');
      }

      setSuccess('Tags generated successfully.');
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tag generation failed');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef6ff,_#f8fafc_40%,_#f1f5f9_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Inventory</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Product Management System</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {products.length} active products
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-[0_24px_50px_-30px_rgba(59,130,246,0.35)] backdrop-blur-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Add a product</h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">New</span>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Gaming Mouse"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="High precision gaming mouse with RGB lighting"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="imageUpload" className="mb-2 block text-sm font-medium text-slate-700">Product photo</label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-3 text-slate-900 shadow-sm transition file:mr-3 file:rounded-full file:border-0 file:bg-blue-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700"
                />
                {imageFileName && (
                  <p className="mt-2 text-xs text-slate-500">Selected: {imageFileName}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Creating product...' : 'Create Product'}
              </button>
            </form>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
                {success}
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">Products</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {products.length} items
              </span>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
                No products yet. Create your first product to get started.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {products.map((product) => (
                  <article key={product.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={product.imageUrl || placeholderImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 to-transparent" />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/product/${product.id}`} className="text-lg font-bold text-slate-900 transition hover:text-blue-700">
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          disabled={isDeletingId === product.id}
                          className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeletingId === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{product.description}</p>

                      {product.tags.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <span key={`${product.id}-${tag}`} className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">No tags yet</p>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-2 pt-3">
                        <Link href={`/product/${product.id}`} className="text-sm font-semibold text-blue-700 hover:underline">
                          View details
                        </Link>

                        {product.tags.length === 0 && (
                          <button
                            type="button"
                            onClick={() => handleGenerateTags(product.id)}
                            disabled={generatingId === product.id}
                            className="rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {generatingId === product.id ? 'Generating...' : 'Generate tags'}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Warning</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Delete product?</h3>
              </div>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                aria-label="Close delete confirmation"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-900">{productToDelete.name}</span>? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeletingId === productToDelete.id}
                className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeletingId === productToDelete.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
