import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TryBahlint from "@/components/TryBahlint";
import InstallSection from "@/components/InstallSection";
import Footer from "@/components/Footer";
import Dock from "@/components/Dock";

const Index = () => {
	return (
		<div className="min-h-screen bg-base-100 pb-20 lg:pb-0">
			<main>
				<Hero />
				<InstallSection />
			</main>
			<Footer />
		</div>
	);
};

export default Index;
