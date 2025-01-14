import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from 'vitest';
import CreatePost from "../pages/CreatePost";

const queryClient = new QueryClient();

const renderComponent = () =>
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <CreatePost />
            </MemoryRouter>
        </QueryClientProvider>
    );

describe("CreatePost", () => {
    it("renders the CreatePost form", () => {
        renderComponent();

        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    });

    it("handles form input changes", () => {
        renderComponent();

        const titleInput = screen.getByLabelText(/title/i);
        const contentInput = screen.getByLabelText(/content/i);

        fireEvent.change(titleInput, { target: { value: "Test Title" } });
        fireEvent.change(contentInput, { target: { value: "Test Content" } });

        expect(titleInput).toHaveValue("Test Title");
        expect(contentInput).toHaveValue("Test Content");
    });

    it("does nothing when submit is clicked without input", () => {
        renderComponent();

        const submitButton = screen.getByRole("button", { name: /submit/i });
        fireEvent.click(submitButton);

        // No error message or submission indicator should appear
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it("displays a success message after form submission", () => {
        renderComponent();

        const titleInput = screen.getByLabelText(/title/i);
        const contentInput = screen.getByLabelText(/content/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        fireEvent.change(titleInput, { target: { value: "Valid Title" } });
        fireEvent.change(contentInput, { target: { value: "Valid Content" } });
        fireEvent.click(submitButton);

        // Simulate a success state
        expect(screen.getByText(/post created successfully/i)).toBeInTheDocument();
    });
});
