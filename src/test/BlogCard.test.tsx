import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from 'vitest';
import { BlogCard } from "../components/BlogCard";

const mockPost = {
  id: '1',
  title: 'Test Post',
  content: '<p>Test content that is longer than 150 characters. '.repeat(10) + '</p>',
  created_at: '2025-01-16T18:10:00Z',
  updated_at: '2025-01-16T18:10:00Z',
  edited_at: null,
  author_id: '123',
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
    expect(screen.getByText(/By testuser/)).toBeInTheDocument();
  });

  it("renders truncated content", () => {
    render(
      <MemoryRouter>
        <BlogCard post={mockPost} />
      </MemoryRouter>
    );

    const displayedContent = screen.getByText(/Test content/);
    expect(displayedContent.textContent?.length).toBeLessThan(mockPost.content.length);
  });

  it("handles posts without username", () => {
    const postWithoutUsername = {
      ...mockPost,
      profiles: null
    };

    render(
      <MemoryRouter>
        <BlogCard post={postWithoutUsername} />
      </MemoryRouter>
    );

    expect(screen.getByText("By Unknown")).toBeInTheDocument();
  });

  it("strips HTML tags from content", () => {
    const postWithHtmlTags = {
      ...mockPost,
      content: '<p>Test <strong>content</strong> with <em>HTML</em> tags</p>'
    };

    render(
      <MemoryRouter>
        <BlogCard post={postWithHtmlTags} />
      </MemoryRouter>
    );

    const content = screen.getByText(/Test content with HTML tags/);
    expect(content).toBeInTheDocument();
  });
});