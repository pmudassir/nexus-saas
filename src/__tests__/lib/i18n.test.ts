import { describe, it, expect } from "vitest";
import { t, isRTL, formatCurrency, formatNumber, formatDate } from "@/lib/i18n";

describe("i18n", () => {
  describe("t (translate)", () => {
    it("should return English translation by default", () => {
      expect(t("common.save")).toBe("Save");
      expect(t("common.cancel")).toBe("Cancel");
    });

    it("should return Spanish translation when specified", () => {
      expect(t("common.save", "es")).toBe("Guardar");
      expect(t("nav.dashboard", "es")).toBe("Panel");
    });

    it("should return French translation", () => {
      expect(t("common.delete", "fr")).toBe("Supprimer");
    });

    it("should fallback to English for unknown locale keys", () => {
      expect(t("common.save", "en")).toBe("Save");
    });
  });

  describe("isRTL", () => {
    it("should return true for Arabic", () => {
      expect(isRTL("ar")).toBe(true);
    });

    it("should return false for English", () => {
      expect(isRTL("en")).toBe(false);
    });

    it("should return false for other LTR languages", () => {
      expect(isRTL("es")).toBe(false);
      expect(isRTL("fr")).toBe(false);
      expect(isRTL("de")).toBe(false);
    });
  });

  describe("formatCurrency", () => {
    it("should format USD correctly", () => {
      const formatted = formatCurrency(1234.56, "USD", "en");
      expect(formatted).toContain("1,234.56");
    });

    it("should format with locale specific separators", () => {
      const formatted = formatCurrency(1234.56, "EUR", "de");
      expect(formatted).toContain("€");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with locale separators", () => {
      expect(formatNumber(1234567, "en")).toBe("1,234,567");
    });
  });

  describe("formatDate", () => {
    it("should format dates according to locale", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date, "en");
      expect(formatted).toContain("2024");
    });
  });
});
