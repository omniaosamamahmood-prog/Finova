declare module "arabic-persian-reshaper" {
  type Shaper = {
    convertArabic(text: string): string;
    convertArabicBack(text: string): string;
  };

  const reshaper: {
    ArabicShaper: Shaper;
    PersianShaper: Shaper;
  };

  export default reshaper;
}
