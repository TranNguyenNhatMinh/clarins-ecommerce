/**
 * Trang chủ - landing luxury beauty ecommerce
 * Compose các section: Hero, USP, Category, Highlight, Sản phẩm liên quan, Services
 * Newsletter nằm trong Footer
 */
import HeroSection from '../components/home/HeroSection';
import USPStrip from '../components/home/USPStrip';
import CategoryShowcase from '../components/home/CategoryShowcase';
import HighlightPromo from '../components/home/HighlightPromo';
import RelatedProductsSection from '../components/home/RelatedProductsSection';
import ServicesSection from '../components/home/ServicesSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <USPStrip />
      <CategoryShowcase />
      <HighlightPromo />
      <RelatedProductsSection />
      <ServicesSection />
    </>
  );
}
