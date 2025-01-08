import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './utils';
import Index from '@/pages/Index';

describe('Index Page', () => {
  it('renders welcome message', () => {
    renderWithProviders(<Index />);
    expect(screen.getByText('Welcome to ADA Blogs')).toBeInTheDocument();
  });

  it('shows sign in button when not authenticated', () => {
    renderWithProviders(<Index />);
    expect(screen.getByText('Sign in to post')).toBeInTheDocument();
  });

  it('shows loading state while fetching posts', () => {
    renderWithProviders(<Index />);
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });
});