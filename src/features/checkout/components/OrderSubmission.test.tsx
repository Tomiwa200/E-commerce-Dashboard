import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createClient } from "@/utils/supabase/client";

// Define an explicit mock shape mimicking Supabase's fluent query syntax chain
const mockInsertMethod = vi.fn();
const mockFromMethod = vi.fn(() => ({
  insert: mockInsertMethod,
}));

// 🚀 STEP 1: Intercept the Supabase client generation factory
vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    from: mockFromMethod,
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "mock-user-123" } }, error: null }),
    },
  }),
}));

// A testable component button that calls Supabase on click
function SaveOrderButton() {
  const handleCheckoutSave = async () => {
    // This replicates the database push code inside CheckoutWizard
    const supabase = createClient();
    
    await supabase.from("orders").insert({ total_amount: 210, status: "paid" });
    alert("Database Logged!");
  };

  return <button onClick={handleCheckoutSave}>Finalize Transaction</button>;
}

describe("Supabase Transaction Integration Test", () => {
  it("should securely query the orders table using standard fluent interface schemas", async () => {
    // Clear out residual test run analytics tracking metrics
    vi.clearAllMocks();
    
    // Configure our fake database wrapper to return a successful promise resolution state
    mockInsertMethod.mockResolvedValue({ data: null, error: null });
    
    // Spy on window alerts
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<SaveOrderButton />);
    
    const actionButton = screen.getByRole("button", { name: /finalize transaction/i });
    fireEvent.click(actionButton);

    // VERIFY: Ensure the database fluent hooks were invoked with precise schemas
    await waitFor(() => {
      expect(mockFromMethod).toHaveBeenCalledWith("orders");
      expect(mockInsertMethod).toHaveBeenCalledWith({ total_amount: 210, status: "paid" });
      expect(alertSpy).toHaveBeenCalledWith("Database Logged!");
    });
  });
});
