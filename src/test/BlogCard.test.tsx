import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from 'vitest';
import { BlogCard } from "../components/BlogCard";

const mockPost = {
  id: '1',
  title: 'Test Post',
  content: '<p>Test content</p>',
  created_at: new Date().toISOString(),
  profiles: {
    username: 'testuser'
  }
};

describe("BlogCard", () => {
  it("renders post information correctly", () => {
    render(
      <MemoryRouter>
        <BlogCard post={mockPost} />
      </MemoryRouter>
    );

    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(`By ${mockPost.profiles.username} • ${new Date(mockPost.created_at).toLocaleDateString()}`)).toBeInTheDocument();
  });

  it("renders truncated content", () => {
    const longContent = '<p>'.concat('Very long content '.repeat(50), '</p>');
    const postWithLongContent = { ...mockPost, content: longContent };

    render(
      <MemoryRouter>
        <BlogCard post={postWithLongContent} />
      </MemoryRouter>
    );

    const displayedContent = screen.getByText(/Very long content/);
    expect(displayedContent.textContent?.length).toBeLessThan(longContent.length);
  });
});