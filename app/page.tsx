import About from "@/components/About";
import BestSellerSlider from "@/components/BestSellerSlider";
import CustomBuildPCINHomePage from "@/components/CustomBuildPCINHomePage";
import CustomerReview from "@/components/CustomerReview";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PreBuildPCINHomePage from "@/components/PreBuildPCINHomePage";
import ProductByCategoriesSlider from "@/components/ProductByCategoriesSlider";

export default function Home() {
  return (
    <>
      <Hero />
      <BestSellerSlider />
      <ProductByCategoriesSlider />
      <PreBuildPCINHomePage />
      <CustomBuildPCINHomePage />
      <About />
      <CustomerReview />
      <Footer />
      
    </>
  );
}
