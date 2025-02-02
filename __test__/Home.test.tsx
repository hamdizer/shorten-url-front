import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../pages/index";
import axios from "axios";
import React from "react";

// Mock axios
jest.mock("axios");

describe("Home component", () => {
  test("renders input field and button", () => {
    render(<Home />);

    const inputElement = screen.getByPlaceholderText("https://example.com");
    const buttonElement = screen.getByText("Shorten URL");

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  test("successfully shortens the URL", async () => {
    const mockedResponse = {
      data: { shortenedUrl: "https://short.ly/abc123" },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockedResponse);

    render(<Home />);

    const inputElement = screen.getByPlaceholderText("https://example.com");
    const buttonElement = screen.getByText("Shorten URL");

    fireEvent.change(inputElement, {
      target: { value: "https://example.com" },
    });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(screen.getByText("Shortened URL:")).toBeInTheDocument();
      expect(screen.getByText("https://short.ly/abc123")).toBeInTheDocument();
    });
  });

  test("handles error when URL shortening fails", async () => {
    const mockedError = new Error("Network Error");
    (axios.post as jest.Mock).mockRejectedValue(mockedError);

    render(<Home />);

    const inputElement = screen.getByPlaceholderText("https://example.com");
    const buttonElement = screen.getByText("Shorten URL");

    fireEvent.change(inputElement, {
      target: { value: "https://example.com" },
    });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred while shortening the URL")
      ).toBeInTheDocument();
    });
  });
});
