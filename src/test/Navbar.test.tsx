import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from 'vitest';
import Navbar from "../components/Navbar";
import { supabase } from "@/integrations/supabase/client";

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: null
        }
      })
    }
  }
}));

describe("Navbar", () => {
  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it("shows sign in when user is not authenticated", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
  });
});