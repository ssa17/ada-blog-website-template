import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from 'vitest';
import CreatePost from "../pages/CreatePost";
import { supabase } from "@/integrations/supabase/client";

// Mock the entire supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'test-user-id' }
          }
        }
      })
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: { apiKey: 'test-api-key' },
        error: null
      })
    }
  }
}));

// Mock TinyMCE editor
vi.mock('@tinymce/tinymce-react', () => ({
  Editor: ({ onInit, onEditorChange }: any) => {
    // Simulate editor initialization
    if (onInit) {
      setTimeout(() => {
        onInit(null, { setContent: vi.fn() });
      }, 0);
    }
    return (
      <div data-testid="mock-editor">
        <textarea 
          onChange={(e) => onEditorChange?.(e.target.value)}
          data-testid="editor-textarea"
        />
      </div>
    );
  }
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("CreatePost", () => {
  it("renders the create post form", async () => {
    renderComponent();
    
    // Wait for the editor to load and component to render fully
    await waitFor(() => {
      expect(screen.getByText(/create new post/i)).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByTestId("mock-editor")).toBeInTheDocument();
  });

  it("displays the editor after loading", async () => {
    renderComponent();
    
    // Wait for loading state to resolve
    await waitFor(() => {
      expect(screen.queryByText("Loading editor...")).not.toBeInTheDocument();
    });
    
    const editor = screen.getByTestId("mock-editor");
    expect(editor).toBeInTheDocument();
  });
});