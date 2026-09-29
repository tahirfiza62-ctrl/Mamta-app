import Hero from "../../components/Hero/Hero";
import CategoryCard from "../../components/ CategoryCard/ CategoryCard";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import WhyChooseMamta from "../../components/WhyChooseMamta/WhyChooseMamta";
import MotherBabyBanner from "../../components/MotherBabyBanner/MotherBabyBanner";
import Testimonials from "../../components/Testimonials/Testimonials";

import Newsletter from "../../components/Newsletter/Newsletter";
const Home = () => {
  return (
    <main>
      <Hero />
      <CategoryCard/>
      <FeaturedProducts />
      <WhyChooseMamta />
      <MotherBabyBanner />
      <Testimonials />
      <Newsletter/>

    </main>
  );
};

export default Home;