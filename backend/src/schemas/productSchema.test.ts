import { describe, expect, it } from 'vitest';
import { createProductSchema } from './productSchema.js';

describe('createProductSchema', () => {
  it('accepts an image URL when creating a product', () => {
    const result = createProductSchema.parse({
      name: 'Mechanical Keyboard',
      description: 'Compact keyboard with RGB lighting',
      imageUrl: 'https://images.example.com/mechanical-keyboard.jpg'
    });

    expect(result).toMatchObject({
      name: 'Mechanical Keyboard',
      description: 'Compact keyboard with RGB lighting',
      imageUrl: 'https://images.example.com/mechanical-keyboard.jpg'
    });
  });
});
