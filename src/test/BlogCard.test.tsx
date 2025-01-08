import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './utils';
import { BlogCard } from '@/components/BlogCard';

const mockPost = {
  id: '1',
  title: 'Test Post',
  content: 'Test Content',
  created_at: new Date().toISOString(),
  author_id: '123',
  profiles: {
    username: 'testuser'
  }
};

describe('BlogCard', () => {
  it('renders post title and author', () => {
    renderWithProviders(<BlogCard post={mockPost} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    renderWithProviders(<BlogCard post={mockPost} />);
    const date = new Date(mockPost.created_at).toLocaleDateString();
    expect(screen.getByText(new RegExp(date))).toBeInTheDocument();
  });
});