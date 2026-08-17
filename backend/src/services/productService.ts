import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { DuplicateResourceError, NotFoundError } from '../lib/errors.js';
import { generateProductTagsFromText } from './aiService.js';

export async function createProduct(input: { name: string; description: string; imageUrl?: string | null }) {
  const name = input.name.trim();
  const description = input.description.trim();
  const imageUrl = input.imageUrl?.trim() || null;

  const existing = await prisma.product.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  });

  if (existing) {
    throw new DuplicateResourceError('A product with this name already exists');
  }

  try {
    return await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        tags: []
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new DuplicateResourceError('A product with this name already exists');
    }

    throw error;
  }
}

export async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  return product;
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  await prisma.product.delete({ where: { id } });
  return product;
}

export async function generateProductTags(productId: string) {
  const product = await getProductById(productId);
  const tags = await generateProductTagsFromText(product.name, product.description);

  return prisma.product.update({
    where: { id: productId },
    data: { tags }
  });
}
