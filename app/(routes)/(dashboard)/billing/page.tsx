import Header from "../_common/header";
import PricingSection from "./_common/pricing-section";

const Billing = () => {
  return (
    <>
      <Header title="Billing" />
      <div className="mx-auto pt-12 w-full max-w-6xl">
        <div className="px-4 pt-6">
          <PricingSection />
        </div>
      </div>
    </>
  );
};

export default Billing;
