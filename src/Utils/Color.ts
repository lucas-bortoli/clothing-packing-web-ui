export default class Color {
  private r: number;
  private g: number;
  private b: number;
  private a: number;

  // Private constructor
  private constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  // Static method to create a Color instance from RGBA values
  static fromRgba(r: number, g: number, b: number, a: number = 1): Color {
    return new Color(r, g, b, a);
  }

  // Static method to create a Color instance from RGB values
  static fromRgb(r: number, g: number, b: number): Color {
    return new Color(r, g, b, 1);
  }

  // Static method to create a Color instance from HSL values
  static fromHsl(h: number, s: number, l: number): Color {
    const { r, g, b } = Color.hslToRgb(h, s, l);
    return new Color(r, g, b, 1);
  }

  // Method to convert HSL to RGB
  private static hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hueToRgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  // Method to convert the Color instance to CSS format
  toCss(format: 'rgb' | 'rgba' | 'hsl' | 'hsla'): string {
    if (format === 'rgb') {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    } else if (format === 'rgba') {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    } else if (format === 'hsl' || format === 'hsla') {
      const { h, s, l } = Color.rgbToHsl(this.r, this.g, this.b);
      if (format === 'hsl') {
        return `hsl(${h}, ${s}%, ${l}%)`;
      } else {
        return `hsla(${h}, ${s}%, ${l}%, ${this.a})`;
      }
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }
  }

  calculateLuminance(color: Color): number {
    // Convert RGB values to the sRGB range [0, 1]
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    // Apply the gamma correction to convert sRGB to linear RGB
    const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    // Calculate the relative luminance
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  // Method to convert RGB to HSL
  private static rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number, l: number;
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0; break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }
}

function hashStringToNumber(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function generateRandomPastelColor(key: string): Color {
  const hash = hashStringToNumber(key);

  // Use the hash to generate random RGB values between 128 and 255 for pastel colors
  const r = 128 + (hash & 0xFF) % 128;
  const g = 128 + ((hash >> 8) & 0xFF) % 128;
  const b = 128 + ((hash >> 16) & 0xFF) % 128;

  return Color.fromRgb(r, g, b);
}

export function determineTextColorFromBackground(backgroundColor: Color): "light-text" | "dark-text" {
  // Calculate the relative luminance of the background color
  const luminance = backgroundColor.calculateLuminance(backgroundColor);

  // Choose the appropriate text color based on luminance
  // A threshold of 0.5 is commonly used; you can adjust it if necessary
  return luminance > 0.5 ? "dark-text" : "light-text";
}
