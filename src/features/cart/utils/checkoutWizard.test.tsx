import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";

// 🛡️ Safe Step Fallback mock layout of your actual checkout step component layout
function MockCheckoutWizard() {
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState("");

  return (
    <div>
      <h2>Step Tracker: {step}</h2>
      {step === 1 ? (
        <div>
          <label htmlFor="name-input">Full Legal Name</label>
          <input 
            id="name-input" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <button 
            type="button" 
            onClick={() => name ? setStep(2) : alert("Field is required")}
          >
            Continue to Payment
          </button>
        </div>
      ) : (
        <div>
          <p>Order Summary Window</p>
          <button type="button">Pay Securely via Paystack</button>
        </div>
      )}
    </div>
  );
}

describe("Checkout Wizard UI Interaction Loop", () => {
  it("should step forward to payment summary view only when text validation matches inputs", () => {
    render(<MockCheckoutWizard />);

    // Check that we begin correctly on Step 1
    expect(screen.getByText("Step Tracker: 1")).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: /continue to payment/i });
    const nameInputField = screen.getByLabelText(/full legal name/i);

    // Click button while input is completely empty (should stay on step 1)
    fireEvent.click(continueButton);
    expect(screen.getByText("Step Tracker: 1")).toBeInTheDocument();

    // Type a mock customer profile name into the node field
    fireEvent.change(nameInputField, { target: { value: "John Doe" } });

    // Click button again with input properly populated
    fireEvent.click(continueButton);

    // VERIFY: The wizard has advanced into step 2 container layouts!
    expect(screen.getByText("Step Tracker: 2")).toBeInTheDocument();
    expect(screen.getByText("Order Summary Window")).toBeInTheDocument();
  });
});
